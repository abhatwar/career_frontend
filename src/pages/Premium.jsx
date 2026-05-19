import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import DOMPurify from 'dompurify';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Vite-compatible PDF.js worker (renders PDF as canvas — no browser toolbar)
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Tiled diagonal watermark (SVG data URL, repeated as CSS background)
const WATERMARK_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='340' height='180'%3E%3Ctext x='50%25' y='50%25' fill='rgba(255%2C255%2C255%2C0.055)' font-size='13' font-family='sans-serif' font-weight='bold' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 170 90)'%3ECAREER ENCYCLOPEDIA%E2%80%82%E2%80%A2%E2%80%82PERSONAL USE ONLY%3C/text%3E%3C/svg%3E")`;

export default function Premium() {
  const { contentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const contentRef = useRef(null);

  // Fetch premium content metadata
  useEffect(() => {
    api
      .get(`/content/${contentId}/premium`)
      .then((res) => setContent(res.data.content))
      .catch((err) => {
        const msg =
          err.response?.data?.message ||
          'Failed to load content. Please try again.';
        setError(msg);
        if (err.response?.status === 403) {
          setTimeout(() => navigate('/'), 3000);
        }
      })
      .finally(() => setLoading(false));
  }, [contentId, navigate]);

  // If content is a PDF, load it as a blob so the auth header is sent
  useEffect(() => {
    if (!content || content.content_type !== 'pdf') return;

    let objectUrl;
    const token = localStorage.getItem('token');
    fetch(`/api/content/${contentId}/view-pdf`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Access denied');
        return res.blob();
      })
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
      })
      .catch(() => setError('Failed to load PDF. Please try again.'));

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [content, contentId]);

  // ── Content protection ─────────────────────────────────────
  useEffect(() => {
    // Disable right-click context menu
    const blockContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', blockContextMenu);

    // Block Ctrl/Cmd + S, P, A, U and F12 (DevTools)
    const blockShortcuts = (e) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['s', 'p', 'a', 'u'].includes(key)) {
        e.preventDefault();
      }
      if (['f12', 'f11'].includes(key)) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', blockShortcuts);

    // Block drag-and-drop of content
    const blockDrag = (e) => e.preventDefault();
    document.addEventListener('dragstart', blockDrag);

    return () => {
      document.removeEventListener('contextmenu', blockContextMenu);
      document.removeEventListener('keydown', blockShortcuts);
      document.removeEventListener('dragstart', blockDrag);
    };
  }, []);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="text-6xl mb-6 text-gray-700 select-none">◎</div>
          <h2 className="text-xl font-semibold mb-3">Access Restricted</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary px-6 py-3">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Sanitize HTML before rendering (OWASP A03 — Injection prevention)
  const safeBody = DOMPurify.sanitize(content?.body || '', {
    ALLOWED_TAGS: [
      'h1','h2','h3','h4','h5','h6','p','ul','ol','li','strong','em','b','i',
      'blockquote','hr','br','a','code','pre','table','thead','tbody','tr','th','td',
      'span','div','img',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'src', 'alt', 'width', 'height'],
    FORBID_SCRIPTS: true,
  });

  return (
    <div className="min-h-screen pt-16 pb-20">
      {/* ── Content Header ───────────────────────────────────── */}
      <div className="border-b border-border bg-dark-2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            <span className="text-green-400 text-xs uppercase tracking-widest font-medium">
              Premium Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white no-select">
            {content?.title}
          </h1>
          {content?.description && (
            <p className="text-gray-500 mt-2 text-sm no-select">
              {content.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Content Body ─────────────────────────────────────── */}
      {content?.content_type === 'pdf' ? (
        <div className="max-w-5xl mx-auto px-2 sm:px-6 py-6">
          {pdfUrl ? (
            <div
              className="relative select-none"
              onContextMenu={(e) => e.preventDefault()}
            >
              {/* Tiled watermark — pointer-events:none so PDF canvas is fully visible */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ backgroundImage: WATERMARK_SVG, backgroundRepeat: 'repeat' }}
              />
              {/* Per-user watermark */}
              {user && (
                <div
                  className="absolute bottom-6 right-6 z-10 pointer-events-none text-xs text-white font-mono select-none"
                  style={{ opacity: 0.18, transform: 'rotate(-18deg)' }}
                >
                  {user.email}
                </div>
              )}
              {/* PDF rendered as canvas pages — no browser toolbar, no download/print */}
              <Document
                file={pdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                onLoadError={(err) => setError(`Failed to render PDF: ${err.message}`)}
                className="flex flex-col items-center gap-3"
                loading={<LoadingSpinner fullScreen={false} />}
              >
                {numPages &&
                  Array.from({ length: numPages }, (_, i) => (
                    <Page
                      key={i + 1}
                      pageNumber={i + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={Math.min(window.innerWidth - 32, 900)}
                      className="shadow-xl rounded"
                    />
                  ))}
              </Document>
            </div>
          ) : (
            <LoadingSpinner fullScreen={false} />
          )}
        </div>
      ) : (
        <div
          ref={contentRef}
          className="max-w-4xl mx-auto px-4 sm:px-6 py-10 no-select"
          style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
          }}
        >
          <div
            className="premium-body"
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        </div>
      )}

      {/* ── Bottom Protection Bar ────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark/90 backdrop-blur-md border-t border-border px-4 py-2.5 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-gray-600">
          <span>© Career Encyclopedia — Personal use only. Do not share or redistribute.</span>
          <span className="hidden sm:flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Protected Content
          </span>
        </div>
      </div>
    </div>
  );
}

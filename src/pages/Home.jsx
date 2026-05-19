import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

// ── Static copy ────────────────────────────────────────────────────────────────
const TEASER_FEATURES = [
  { icon: '◈', title: 'Expert Insights', desc: 'Curated career guidance from industry professionals across every field.' },
  { icon: '◇', title: 'Structured Roadmaps', desc: 'Clear, step-by-step paths tailored to your career aspirations.' },
  { icon: '◆', title: 'Lifetime Access', desc: 'Pay once — access the full content forever with all future updates.' },
  { icon: '◉', title: 'Secure & Private', desc: 'Your data is encrypted and content is DRM-protected.' },
];

const CHECKLIST = [
  'Comprehensive career guidance — all chapters',
  'Structured roadmaps for 50+ career paths',
  'Expert-curated tools and resources',
  'All current and future content updates',
  'Secure, distraction-free reading experience',
];

const TYPE_LABEL = {
  pdf: 'PDF Document',
  video: 'Video Course',
  mixed: 'Mixed Media',
  text: 'Reading Material',
};

// ── Coming Soon page ──────────────────────────────────────────────────────────
function ComingSoon({ onSignup }) {
  const [email, setEmail] = useState('');
  const [notified, setNotified] = useState(false);

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) setNotified(true);
  };

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full bg-white/[0.012] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/5 rounded-full px-4 py-1.5 text-xs text-amber-400 mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-slow" />
            Something big is coming
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-6">
            The Career
            <br />
            <span className="text-gray-500 font-light">Encyclopedia</span>
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-lg mx-auto mb-4 leading-relaxed">
            We're putting the finishing touches on something that will change how you navigate your career.
          </p>
          <p className="text-gray-600 text-sm max-w-md mx-auto mb-10">
            Expert roadmaps, structured career paths, and lifetime access — coming soon at an unbeatable price.
          </p>

          {/* Notify form */}
          {notified ? (
            <div className="inline-flex items-center gap-2 border border-green-500/30 bg-green-500/5 rounded-xl px-6 py-3 text-green-400 text-sm mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              We'll notify you the moment it launches!
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2 justify-center mb-6 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="input-field flex-1 text-sm"
              />
              <button type="submit" className="btn-primary px-6 py-2.5 text-sm whitespace-nowrap">
                Notify Me
              </button>
            </form>
          )}

          <button
            onClick={onSignup}
            className="btn-secondary px-6 py-2.5 text-sm"
          >
            Create Account — It's Free
          </button>

          <p className="mt-8 text-gray-700 text-xs tracking-wide uppercase">
            One-time purchase · No subscription · Lifetime access
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-700 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Preview</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Teaser features */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">What to Expect</h2>
            <p className="text-gray-500 text-sm">A sneak peek at what we're building for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEASER_FEATURES.map((f, i) => (
              <div key={i} className="card relative overflow-hidden group cursor-default opacity-80 hover:opacity-100 transition-opacity duration-300">
                <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent pointer-events-none" />
                <span className="text-3xl text-gray-600 group-hover:text-gray-300 transition-colors duration-300 block">{f.icon}</span>
                <h3 className="text-white font-semibold mt-5 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price teaser */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Unbeatable Price</h2>
          <p className="text-gray-500 text-sm mb-12">Stay tuned — it's going to be very affordable.</p>
          <div className="card border-amber-500/10 p-8 sm:p-10">
            <div className="inline-flex items-center gap-2 border border-amber-500/20 bg-amber-500/5 rounded-full px-3 py-1 text-xs text-amber-400 mb-6">
              Coming soon
            </div>
            <div className="text-6xl font-bold tracking-tight text-gray-700 mb-2">₹ ?</div>
            <p className="text-gray-600 text-sm mb-8">Price revealed on launch</p>
            <ul className="text-left space-y-3 mb-8">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-500 text-sm">
                  <span className="text-amber-500/60 flex-shrink-0 mt-0.5">◇</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="w-full py-3.5 rounded-lg border border-white/10 text-gray-600 text-sm cursor-default text-center">
              Available Soon
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ── Product Live page ─────────────────────────────────────────────────────────
function ProductPage({ content, hasAccess, purchasing, error, onBuyNow, onSignup, isAuthenticated }) {
  const priceRupees = Math.round(content.price / 100);
  const typeLabel = TYPE_LABEL[content.content_type] || 'Premium Content';

  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full bg-white/[0.015] blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-8 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
            {typeLabel} · Now Available
          </div>

          {/* Title — split into two lines naturally */}
          <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight leading-[1.1] mb-6">
            {content.title}
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl max-w-xl mx-auto mb-4 leading-relaxed">
            {content.description || 'Premium career guidance crafted by experts — structured, actionable, and lifetime accessible.'}
          </p>

          {/* Price pill */}
          <div className="inline-flex items-center gap-3 border border-white/10 bg-white/5 rounded-full px-5 py-2 mb-10">
            <span className="text-2xl font-bold text-white">₹{priceRupees}</span>
            <span className="text-gray-500 text-xs">one-time · lifetime access</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onBuyNow}
              disabled={purchasing}
              className="btn-primary px-8 py-4 text-base w-full sm:w-auto min-w-[240px] disabled:opacity-60"
            >
              {purchasing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : hasAccess ? (
                'View Content →'
              ) : (
                `Get Access — ₹${priceRupees}`
              )}
            </button>

            {!isAuthenticated && (
              <button onClick={onSignup} className="btn-secondary px-8 py-4 text-base w-full sm:w-auto">
                Create Account
              </button>
            )}
          </div>

          {error && <p className="mt-5 text-red-400 text-sm max-w-sm mx-auto">{error}</p>}

          {hasAccess && (
            <div className="mt-4 inline-flex items-center gap-2 text-green-400 text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              You already have access to this content
            </div>
          )}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-700 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">What's Inside</h2>
            <p className="text-gray-500 text-sm">Everything you need to build a successful career, in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEASER_FEATURES.map((f, i) => (
              <div key={i} className="card hover:border-white/20 transition-all duration-300 group cursor-default">
                <span className="text-3xl text-gray-600 group-hover:text-gray-300 transition-colors duration-300 block">{f.icon}</span>
                <h3 className="text-white font-semibold mt-5 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing card */}
      <section className="py-24 px-4 border-t border-border" id="pricing">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Simple Pricing</h2>
          <p className="text-gray-500 text-sm mb-12">No hidden fees. No subscriptions. Pay once.</p>

          <div className="card border-white/15 p-8 sm:p-10 relative overflow-hidden">
            <div aria-hidden className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.025] to-transparent" />

            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-xs text-gray-400 mb-6">
              One-time purchase · {typeLabel}
            </div>

            <div className="flex items-start justify-center gap-1 mb-2">
              <span className="text-2xl text-gray-400 font-light mt-3">₹</span>
              <span className="text-8xl font-bold tracking-tighter leading-none">{priceRupees}</span>
            </div>
            <p className="text-gray-500 text-sm mb-8">Lifetime access — pay once, own it forever</p>

            <ul className="text-left space-y-3 mb-10">
              {CHECKLIST.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                  <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={onBuyNow}
              disabled={purchasing}
              className="btn-primary w-full py-4 text-base disabled:opacity-60"
            >
              {purchasing ? 'Processing...' : hasAccess ? 'Access Content →' : `Buy Now — ₹${priceRupees}`}
            </button>

            {error && <p className="mt-4 text-red-400 text-xs text-center">{error}</p>}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <span className="font-semibold text-gray-400">Career<span className="font-light">Enc</span></span>
        <p>© {new Date().getFullYear()} Career Encyclopedia. All rights reserved.</p>
        <p>Secured by Razorpay</p>
      </div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/content')
      .then((res) => {
        if (res.data.content?.length > 0) setContent(res.data.content[0]);
      })
      .catch(() => {})
      .finally(() => setContentLoading(false));
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !content) return;
    api
      .get(`/payment/access/${content._id}`)
      .then((res) => setHasAccess(res.data.hasAccess))
      .catch(() => {});
  }, [isAuthenticated, content]);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (hasAccess) {
      navigate(`/premium/${content._id}`);
      return;
    }
    if (!content) return;

    setPurchasing(true);
    setError('');

    try {
      const orderRes = await api.post('/payment/create-order', { contentId: content._id });

      if (!orderRes.data.success) {
        if (orderRes.data.alreadyPurchased) {
          setHasAccess(true);
          navigate(`/premium/${content._id}`);
          return;
        }
        setError(orderRes.data.message);
        return;
      }

      const { id: orderId, amount, currency, key } = orderRes.data.order;

      const options = {
        key,
        amount,
        currency,
        name: 'Career Encyclopedia',
        description: content.title,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              contentId: content._id,
            });
            if (verifyRes.data.success) {
              setHasAccess(true);
              navigate(`/premium/${content._id}`);
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch {
            setError('Payment verification failed. Please contact support.');
          } finally {
            setPurchasing(false);
          }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#ffffff' },
        modal: { ondismiss: () => setPurchasing(false), animation: true },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setError('Payment failed. Please try again.');
        setPurchasing(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setPurchasing(false);
    }
  };

  if (contentLoading) return <LoadingSpinner />;

  if (!content) {
    return <ComingSoon onSignup={() => navigate('/signup')} />;
  }

  return (
    <ProductPage
      content={content}
      hasAccess={hasAccess}
      purchasing={purchasing}
      error={error}
      onBuyNow={handleBuyNow}
      onSignup={() => navigate('/signup')}
      isAuthenticated={isAuthenticated}
    />
  );
}

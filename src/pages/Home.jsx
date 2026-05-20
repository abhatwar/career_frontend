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
function ProductPage({ content, hasAccess, purchasing, error, onBuyNow, onSignup, isAuthenticated, allContents, accessSet, purchasingId, errors, onCardAction }) {
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

      {/* All content catalog */}
      {allContents.length > 1 && (
        <section className="py-24 px-4 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Browse All Content</h2>
              <p className="text-gray-500 text-sm">{allContents.length} item{allContents.length !== 1 ? 's' : ''} available — pay per content, own forever.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allContents.map((item) => (
                <div key={item._id}>
                  <ContentCard
                    item={item}
                    owned={accessSet.has(item._id)}
                    purchasing={purchasingId}
                    onAction={onCardAction}
                  />
                  {errors[item._id] && (
                    <p className="mt-2 text-red-400 text-xs px-1">{errors[item._id]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Career journey section */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/5 rounded-full px-4 py-1.5 text-xs text-amber-400 mb-6 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-slow" />
              Your Career Starts Here
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">From Confusion to Clarity —<br /><span className="text-gray-500 font-light">in Three Steps</span></h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto">Most people spend years figuring out their path. We compressed that into structured, expert-built content.</p>
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
            {[
              {
                step: '01',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                ),
                title: 'Explore Topics',
                desc: 'Browse our growing library of career guides — from tech and finance to design and law.',
              },
              {
                step: '02',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v1H6v-1c0-1.657 1.343-3 3-3s3 1.343 3 3zm0 0v1m0 4h.01M5 20h14a2 2 0 0 0 2-2v-5H3v5a2 2 0 0 0 2 2z" />
                  </svg>
                ),
                title: 'Unlock Access',
                desc: 'One-time payment per guide. No subscription. Yours forever — including every future update.',
              },
              {
                step: '03',
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Build Your Career',
                desc: 'Follow proven roadmaps, absorb expert insights, and move forward with absolute clarity.',
              },
            ].map((s, i) => (
              <div key={i} className="card relative overflow-hidden group hover:border-white/20 transition-all duration-300 cursor-default">
                <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.025] to-transparent pointer-events-none" />
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white/20 transition-all duration-300">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-bold text-dark-3 group-hover:text-dark-2 transition-colors duration-300 select-none">{s.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '50+', label: 'Career Paths Covered' },
              { value: '1×', label: 'Pay Once, Own Forever' },
              { value: '100%', label: 'Expert-Curated Content' },
              { value: '∞', label: 'Lifetime Updates Included' },
            ].map((stat, i) => (
              <div key={i} className="rounded-2xl border border-border bg-white/[0.02] px-5 py-6 text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 text-xs leading-tight">{stat.label}</div>
              </div>
            ))}
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

// ── Content Catalog Card ──────────────────────────────────────────────────────
function ContentCard({ item, owned, purchasing, onAction }) {
  const priceRupees = Math.round(item.price / 100);
  const typeLabel = TYPE_LABEL[item.content_type] || 'Premium Content';
  const isActive = purchasing === item._id;

  return (
    <div className="card border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col gap-4">
      {/* Type badge */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 border border-white/10 bg-white/5 rounded-full px-3 py-1 text-[10px] text-gray-400 uppercase tracking-wider">
          {typeLabel}
        </span>
        {owned && (
          <span className="inline-flex items-center gap-1.5 text-green-400 text-[10px] uppercase tracking-wider">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Owned
          </span>
        )}
      </div>

      {/* Title & description */}
      <div className="flex-1">
        <h3 className="text-white font-semibold text-base mb-2 leading-snug">{item.title}</h3>
        {item.description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.description}</p>
        )}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <span className="text-xl font-bold text-white">₹{priceRupees}</span>
        <button
          onClick={() => onAction(item)}
          disabled={isActive}
          className="btn-primary px-5 py-2 text-sm disabled:opacity-60"
        >
          {isActive ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Processing...
            </span>
          ) : owned ? (
            'View Content →'
          ) : (
            'Get Access'
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [allContents, setAllContents] = useState([]);
  const [contentLoading, setContentLoading] = useState(true);
  // Set of contentIds the user has purchased
  const [accessSet, setAccessSet] = useState(new Set());
  // Which contentId is currently being purchased
  const [purchasingId, setPurchasingId] = useState(null);
  const [errors, setErrors] = useState({}); // { [contentId]: message }

  // Fetch all active content
  useEffect(() => {
    api
      .get('/content')
      .then((res) => {
        if (res.data.content?.length > 0) setAllContents(res.data.content);
      })
      .catch(() => {})
      .finally(() => setContentLoading(false));
  }, []);

  // Fetch all purchased content IDs for logged-in user
  useEffect(() => {
    if (!isAuthenticated) return;
    api
      .get('/payment/my-access')
      .then((res) => {
        if (res.data.success) setAccessSet(new Set(res.data.contentIds));
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleAction = async (item) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (accessSet.has(item._id)) {
      navigate(`/premium/${item._id}`);
      return;
    }

    setPurchasingId(item._id);
    setErrors((prev) => ({ ...prev, [item._id]: '' }));

    try {
      const orderRes = await api.post('/payment/create-order', { contentId: item._id });

      if (!orderRes.data.success) {
        if (orderRes.data.alreadyPurchased) {
          setAccessSet((prev) => new Set([...prev, item._id]));
          navigate(`/premium/${item._id}`);
          return;
        }
        setErrors((prev) => ({ ...prev, [item._id]: orderRes.data.message }));
        return;
      }

      const { id: orderId, amount, currency, key } = orderRes.data.order;

      const options = {
        key,
        amount,
        currency,
        name: 'Career Encyclopedia',
        description: item.title,
        order_id: orderId,
        handler: async (response) => {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              contentId: item._id,
            });
            if (verifyRes.data.success) {
              setAccessSet((prev) => new Set([...prev, item._id]));
              navigate(`/premium/${item._id}`);
            } else {
              setErrors((prev) => ({ ...prev, [item._id]: 'Payment verification failed. Please contact support.' }));
            }
          } catch {
            setErrors((prev) => ({ ...prev, [item._id]: 'Payment verification failed. Please contact support.' }));
          } finally {
            setPurchasingId(null);
          }
        },
        prefill: { name: user?.name || '', email: user?.email || '' },
        theme: { color: '#ffffff' },
        modal: { ondismiss: () => setPurchasingId(null), animation: true },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setErrors((prev) => ({ ...prev, [item._id]: 'Payment failed. Please try again.' }));
        setPurchasingId(null);
      });
      rzp.open();
    } catch (err) {
      setErrors((prev) => ({ ...prev, [item._id]: err.response?.data?.message || 'Something went wrong. Please try again.' }));
      setPurchasingId(null);
    }
  };

  if (contentLoading) return <LoadingSpinner />;

  if (allContents.length === 0) {
    return <ComingSoon onSignup={() => navigate('/signup')} />;
  }

  const featured = allContents[0];
  const featuredOwned = accessSet.has(featured._id);

  return (
    <ProductPage
      content={featured}
      hasAccess={featuredOwned}
      purchasing={purchasingId === featured._id}
      error={errors[featured._id] || ''}
      onBuyNow={() => handleAction(featured)}
      onSignup={() => navigate('/signup')}
      isAuthenticated={isAuthenticated}
      allContents={allContents}
      accessSet={accessSet}
      purchasingId={purchasingId}
      errors={errors}
      onCardAction={handleAction}
    />
  );
}

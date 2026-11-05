import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  ArrowUp,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './Common';
import { CATS, PHONE, PHONE_RAW, EMAIL, ADDRESS, MAPS_URL, WHATSAPP_URL } from '../data/data';

const FooterHeading = ({ children }) => (
  <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-[#E5B544]">
    {children}
  </h4>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-xs sm:text-sm text-[#A7ADB4] transition-colors duration-200 hover:text-[#E5B544]"
    >
      {children}
    </Link>
  </li>
);

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    if (status === 'loading') return;

    const email = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    const accessKey =
      import.meta.env.VITE_WEB3FORMS_ACCESS_KEY ||
      '2741f35b-765b-4bd6-b8aa-0b87a7563f2a';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: 'New Callback Request - THE BEST INSURANCE POINT',
          from_name: 'THE BEST INSURANCE POINT',
          email: email,
          message: `New callback request received from website footer.\nCustomer Email: ${email}\nForwarded to: bestinsurance.pmk@gmail.com`,
          botcheck: false,
        }),
      });

      const data = await response.json();
      if (response.ok && (data.success || data.status === 200)) {
        setStatus('success');
        setEmailInput('');
      } else {
        setStatus('error');
        setErrorMessage(data.message || 'Submission failed. Please try again or call us.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('Unable to connect. Please check your connection or call us directly.');
    }
  };

  return (
    <>
      <footer className="border-t-2 border-[#E5B544] bg-[#171717] text-white">
        {/* Main Footer Content */}
        <div className="wrap grid gap-8 sm:gap-10 py-12 sm:py-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 text-sm">
          {/* Column 1: Brand & Tagline */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 sm:gap-3">
              <div className="rounded-xl bg-white p-1.5 shadow-sm shrink-0">
                <Logo className="h-9 sm:h-10 w-auto" />
              </div>
              <div>
                <b className="block font-display text-lg font-black tracking-tight text-white">
                  THE BEST
                </b>
                <span className="block text-[10.5px] sm:text-[11px] font-black tracking-[0.18em] text-[#E5B544]">
                  INSURANCE POINT
                </span>
              </div>
            </Link>

            <p className="mt-3 text-xs italic text-[#E5B544] font-semibold">
              Your World. Your People. Our Protection.
            </p>

            <p className="mt-3 max-w-sm text-xs sm:text-sm text-[#A7ADB4] leading-relaxed">
              India's trusted insurance advisory helping individuals, families, and businesses secure the right motor, commercial, health, and life insurance with 50+ IRDAI approved partners.
            </p>

            {/* Social Icons */}
            <div className="mt-5 flex gap-2.5">
              {[
                [Facebook, 'Facebook'],
                [Instagram, 'Instagram'],
                [Linkedin, 'LinkedIn'],
                [Youtube, 'YouTube'],
              ].map(([Icon, label]) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={label}
                  className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-[#A7ADB4] transition-colors hover:border-[#E5B544] hover:bg-[#E5B544] hover:text-[#171717]"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Insurance Categories */}
          <div>
            <FooterHeading>Insurance Plans</FooterHeading>
            <ul className="space-y-2.5">
              {CATS.map((c) => (
                <FooterLink key={c.id} to={c.path}>
                  {c.title}
                </FooterLink>
              ))}
              <FooterLink to="/insurance/car">Third-Party Cover</FooterLink>
              <FooterLink to="/insurance/car">Zero-Dep Car Cover</FooterLink>
              <FooterLink to="/insurance/life-family">Family Health Floater</FooterLink>
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2.5">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/#why">Why Choose Us</FooterLink>
              <FooterLink to="/#services">Our Services</FooterLink>
              <FooterLink to="/#partners">Insurance Partners</FooterLink>
              <FooterLink to="/claims">Claims Assistance</FooterLink>
              <FooterLink to="/contact">Contact Support</FooterLink>
            </ul>
          </div>

          {/* Column 4: Contact & Callback */}
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterHeading>Contact Us</FooterHeading>
            <div className="mb-3">
              <span className="block font-bold text-white text-xs sm:text-sm">THE BEST INSURANCE POINT</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#E5B544]" />
                <a href={`tel:${PHONE_RAW}`} className="text-[#A7ADB4] hover:text-[#E5B544] transition-colors">
                  Mobile: {PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#E5B544]" />
                <a href={`mailto:${EMAIL}`} className="text-[#A7ADB4] hover:text-[#E5B544] break-all transition-colors">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#E5B544]" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A7ADB4] hover:text-[#E5B544] transition-colors leading-relaxed"
                  title="View on Google Maps"
                >
                  {ADDRESS}
                </a>
              </li>
            </ul>

            <div className="mt-5 border-t border-white/10 pt-4">
              <span className="block text-xs font-semibold text-white mb-2">Request Callback</span>
              {status === 'success' ? (
                <div className="rounded-xl bg-[#E5B544]/15 border border-[#E5B544]/40 p-3 text-xs text-[#E5B544] space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <CheckCircle2 size={15} className="text-[#E5B544] shrink-0" />
                    <span>Callback Request Received!</span>
                  </div>
                  <p className="text-[11px] text-[#A7ADB4] leading-relaxed">
                    Thank you! Our advisor will contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setEmailInput('');
                      setErrorMessage('');
                    }}
                    className="text-[10.5px] text-[#E5B544] hover:underline pt-0.5 inline-block cursor-pointer font-medium"
                  >
                    Request another callback →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-1.5">
                  <div className="flex gap-1.5">
                    <input
                      required
                      type="email"
                      value={emailInput}
                      onChange={(e) => {
                        setEmailInput(e.target.value);
                        if (status === 'error') {
                          setStatus('idle');
                          setErrorMessage('');
                        }
                      }}
                      placeholder="Your email address"
                      disabled={status === 'loading'}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-[#E5B544] focus:outline-none focus:ring-1 focus:ring-[#E5B544] disabled:opacity-60"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      aria-label="Send callback request"
                      className="btn-gold !px-3 !py-2 rounded-xl shrink-0 flex items-center justify-center disabled:opacity-60 cursor-pointer"
                    >
                      {status === 'loading' ? (
                        <Loader2 size={14} className="animate-spin text-[#171717]" />
                      ) : (
                        <Send size={14} />
                      )}
                    </button>
                  </div>
                  {status === 'error' && errorMessage && (
                    <p className="text-[11px] text-[#F51F2B] flex items-center gap-1 pt-0.5">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6 text-center text-xs text-[#A7ADB4]">
          <div className="wrap flex flex-col items-center justify-center gap-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
              <Link to="/about" className="hover:text-[#E5B544] transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/about" className="hover:text-[#E5B544] transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link to="/claims" className="hover:text-[#E5B544] transition-colors">IRDAI Guidelines</Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-[#E5B544] transition-colors">Contact Support</Link>
            </div>

            <div className="space-y-1.5 text-center pt-2 border-t border-white/5 w-full max-w-xl">
              <p className="font-semibold tracking-wide text-white/90 text-xs sm:text-[13px]">
                © 2026 THE BEST INSURANCE POINT. ALL RIGHTS RESERVED.
              </p>
              <p className="text-[11px] sm:text-xs font-bold tracking-widest text-[#E5B544] uppercase">
                DEVELOPED BY ECOFRIENDLY TECH SOLUTION
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-3.5 sm:right-5 z-50 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle size={24} />
      </a>

      {/* Back to Top Floating Button in Brand Gold */}
      {showScrollTop && (
        <button
          aria-label="Scroll back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-3.5 sm:right-5 z-50 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-[#E5B544] text-[#171717] shadow-lg transition-all hover:bg-[#CF9F30] hover:scale-110 active:scale-95"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}

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
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './Common';
import { CATS, PHONE, EMAIL, ADDRESS } from '../data/data';

const FooterHeading = ({ children }) => (
  <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-[#DFB24A]">
    {children}
  </h4>
);

const FooterLink = ({ to, children }) => (
  <li>
    <Link
      to={to}
      className="text-xs sm:text-sm text-[#A7ADB4] transition-colors duration-200 hover:text-[#DFB24A]"
    >
      {children}
    </Link>
  </li>
);

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setNewsletterSent(true);
      setEmailInput('');
    }
  };

  return (
    <>
      <footer className="border-t-2 border-[#DFB24A] bg-[#171717] text-white">
        {/* Main Footer Content */}
        <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5 text-sm">
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="rounded-xl bg-white p-1.5 shadow-sm">
                <Logo className="h-10 w-auto" />
              </div>
              <div>
                <b className="block font-display text-lg font-black tracking-tight text-white">
                  THE BEST
                </b>
                <span className="block text-[11px] font-black tracking-[0.2em] text-[#DFB24A]">
                  INSURANCE COMPANY
                </span>
              </div>
            </Link>

            <p className="mt-3 text-xs italic text-[#DFB24A] font-semibold">
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
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/5 text-[#A7ADB4] transition-colors hover:border-[#DFB24A] hover:bg-[#DFB24A] hover:text-[#171717]"
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
          <div>
            <FooterHeading>Contact Us</FooterHeading>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#DFB24A]" />
                <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="text-[#A7ADB4] hover:text-[#DFB24A]">
                  {PHONE}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#DFB24A]" />
                <a href={`mailto:${EMAIL}`} className="text-[#A7ADB4] hover:text-[#DFB24A]">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#DFB24A]" />
                <span className="text-[#A7ADB4]">{ADDRESS}</span>
              </li>
            </ul>

            <div className="mt-5 border-t border-white/10 pt-4">
              <span className="block text-xs font-semibold text-white mb-2">Request Callback</span>
              {newsletterSent ? (
                <p className="rounded-lg bg-[#DFB24A]/20 border border-[#DFB24A]/40 p-2 text-xs text-[#DFB24A]">
                  Thank you! Our advisor will call you shortly.
                </p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-1.5">
                  <input
                    required
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Your email address"
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs text-white placeholder-slate-400 focus:border-[#DFB24A] focus:outline-none focus:ring-1 focus:ring-[#DFB24A]"
                  />
                  <button
                    type="submit"
                    aria-label="Send callback request"
                    className="btn-gold !px-3 !py-2 rounded-xl shrink-0"
                  >
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-5 text-center text-xs text-[#A7ADB4]">
          <div className="wrap flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p>
              © {new Date().getFullYear()} <b>THE BEST INSURANCE COMPANY</b>. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link to="/about" className="hover:text-[#DFB24A]">Privacy Policy</Link>
              <span>•</span>
              <Link to="/about" className="hover:text-[#DFB24A]">Terms of Service</Link>
              <span>•</span>
              <Link to="/claims" className="hover:text-[#DFB24A]">IRDAI Guidelines</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle size={26} />
      </a>

      {/* Back to Top Floating Button in Brand Gold */}
      {showScrollTop && (
        <button
          aria-label="Scroll back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-[#DFB24A] text-[#171717] shadow-lg transition-all hover:bg-[#C89B2B] hover:scale-110 active:scale-95"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </>
  );
}

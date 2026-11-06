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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

          {/* Column 4: Contact Information */}
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

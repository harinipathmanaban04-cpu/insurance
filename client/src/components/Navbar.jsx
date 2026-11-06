import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X, Phone, ShieldCheck, CheckCircle2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATS, PHONE } from '../data/data';
import { Logo } from './Common';

const links = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Why Choose Us', '/#why'],
  ['Services', '/#services'],
  ['Claims Assistance', '/claims'],
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [insuranceAccordion, setInsuranceAccordion] = useState(false);
  const dropdownRef = useRef(null);
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname, hash]);

  const isActive = (pathWithHash) => {
    const [path, h] = pathWithHash.split('#');
    return pathname === path && (h ? hash === '#' + h : path !== '/' || !hash);
  };

  const handleNavClick = (e, path) => {
    if (path.includes('#')) {
      const [p, h] = path.split('#');
      if (pathname === p || (p === '/' && pathname === '')) {
        const el = document.getElementById(h);
        if (el) {
          e.preventDefault();
          window.history.pushState(null, '', path);
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  const navLinkClass = (active) =>
    `relative flex items-center h-[74px] px-2.5 xl:px-3.5 text-[13.5px] xl:text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
      active
        ? 'text-[#F51F2B] font-bold after:absolute after:bottom-0 after:inset-x-2 after:h-[3px] after:rounded-full after:bg-[#F51F2B]'
        : 'text-[#101C38] hover:text-[#F51F2B]'
    }`;

  const isInsuranceActive = pathname.startsWith('/insurance');

  return (
    <header className="relative z-50 border-b border-[#E5E7EB] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Top Utility Micro-Bar */}
      <div className="hidden border-b border-[#E5E7EB] bg-white px-4 py-1.5 text-xs text-[#53627A] md:block">
        <div className="wrap flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-6 min-w-0">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#101C38] shrink-0">
              <ShieldCheck size={14} className="text-[#F51F2B]" />
              <span>Trusted Insurance Point</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#101C38] shrink-0">
              <CheckCircle2 size={14} className="text-[#E5B544]" />
              <span>50+ IRDAI Approved Partners</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 font-medium text-[#53627A] truncate">
              <Shield size={13} className="text-[#101C38]/70" />
              <span>Fast & Reliable Policy Issuance & Claim Support</span>
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`tel:${PHONE.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-bold text-[#101C38] hover:text-[#F51F2B] transition-colors"
            >
              <Phone size={13} className="text-[#F51F2B]" />
              <span>Toll-Free Helpline: {PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="wrap flex h-[64px] sm:h-[74px] items-center justify-between gap-2 sm:gap-4">
        {/* Brand Shield Logo & Name */}
        <Link to="/" className="flex shrink-0 items-center gap-2 sm:gap-3 group min-w-0">
          <Logo className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
          <div className="leading-tight min-w-0">
            <span className="block font-display text-sm min-[360px]:text-base sm:text-xl font-black tracking-tight text-[#101C38] whitespace-nowrap">
              THE BEST
            </span>
            <span className="block text-[8px] min-[360px]:text-[9px] sm:text-[11px] font-black tracking-[0.14em] min-[360px]:tracking-[0.16em] text-[#F51F2B] whitespace-nowrap">
              INSURANCE POINT
            </span>
            <span className="hidden text-[10px] font-medium text-[#53627A] sm:block">
              Your World. Your People. Our Protection.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex h-[74px]">
          <Link to="/" className={navLinkClass(isActive('/'))}>
            Home
          </Link>

          {/* Insurance Dropdown */}
          <div
            ref={dropdownRef}
            className="relative flex items-center h-[74px]"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`${navLinkClass(isInsuranceActive)} inline-flex items-center gap-1`}
            >
              <span>Insurance</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-[#F51F2B]' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className="absolute left-0 top-[calc(100%-8px)] z-50 pt-2 w-[310px] sm:w-[320px] max-w-xs"
                >
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-card">
                    <div className="px-2.5 pb-2 mb-2 border-b border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#53627A]">
                        Insurance Categories
                      </span>
                      <span className="text-[10px] font-semibold text-[#F51F2B]">
                        4 Plans
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {CATS.map((c) => {
                        const Icon = c.icon;
                        const active = pathname === c.path;
                        return (
                          <Link
                            key={c.id}
                            to={c.path}
                            className={`group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-150 ${
                              active
                                ? 'bg-[#FAF2DE] text-[#101C38] ring-1 ring-[#E5B544]'
                                : 'hover:bg-[#FAF2DE] text-[#101C38]'
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                active
                                  ? 'bg-[#E5B544] text-[#101C38]'
                                  : 'bg-[#FAF2DE] text-[#101C38] group-hover:bg-[#E5B544]'
                              }`}
                            >
                              <Icon size={19} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="block text-sm font-bold text-[#101C38] leading-tight">
                                {c.nav}
                              </span>
                              <span className="block text-xs text-[#53627A] leading-snug mt-0.5 line-clamp-2">
                                {c.short}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.slice(1).map(([title, path]) => (
            <Link
              key={title}
              to={path}
              onClick={(e) => handleNavClick(e, path)}
              className={navLinkClass(isActive(path))}
            >
              {title}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-4 xl:px-5 py-2 text-xs font-bold text-[#101C38] shadow-xs hover:border-[#101C38] hover:bg-[#F7F8FA] transition-all whitespace-nowrap"
          >
            Contact Us
          </Link>

          <Link
            to="/contact#quote"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#E5B544] hover:bg-[#CF9F30] px-4 sm:px-5 py-2 text-xs font-bold text-[#101C38] shadow-xs transition-all whitespace-nowrap active:translate-y-0.5"
          >
            <span>Get a Quote</span>
            <ArrowRight size={14} />
          </Link>

          <button
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#101C38] hover:bg-[#F7F8FA] hover:text-[#F51F2B] lg:hidden focus:outline-none transition-colors shrink-0"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-[#E5E7EB] bg-white lg:hidden max-h-[calc(100dvh-64px)] sm:max-h-[calc(100dvh-74px)] overflow-y-auto overscroll-contain shadow-lg"
          >
            <div className="wrap space-y-1 py-3 sm:py-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                  isActive('/')
                    ? 'bg-[#FFF1F2] text-[#F51F2B] font-bold'
                    : 'text-[#101C38] hover:bg-[#F7F8FA] hover:text-[#F51F2B]'
                }`}
              >
                Home
              </Link>

              {/* Mobile Insurance Accordion */}
              <div>
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-[#101C38] hover:bg-[#F7F8FA] hover:text-[#F51F2B] transition-colors"
                  aria-expanded={insuranceAccordion}
                  onClick={() => setInsuranceAccordion(!insuranceAccordion)}
                >
                  <span className="flex items-center gap-2">
                    <span>Insurance Categories</span>
                    <span className="rounded-full bg-[#FFF1F2] text-[#F51F2B] px-2 py-0.5 text-[10px] font-bold">4 Plans</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      insuranceAccordion ? 'rotate-180 text-[#F51F2B]' : 'text-[#53627A]'
                    }`}
                  />
                </button>
                {insuranceAccordion && (
                  <div className="my-1.5 space-y-1 rounded-xl bg-[#F7F8FA] p-2 sm:p-2.5">
                    {CATS.map((c) => {
                      const Icon = c.icon;
                      const active = pathname === c.path;
                      return (
                        <Link
                          key={c.id}
                          to={c.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? 'bg-white text-[#F51F2B] font-bold shadow-xs'
                              : 'text-[#101C38] hover:bg-white hover:text-[#F51F2B]'
                          }`}
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FAF2DE] text-[#101C38]">
                            <Icon size={16} className="text-[#F51F2B]" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold">{c.nav}</span>
                            <span className="block text-[11px] text-[#53627A] truncate">{c.short}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {links.slice(1).map(([title, path]) => (
                <Link
                  key={title}
                  to={path}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleNavClick(e, path);
                  }}
                  className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                    isActive(path)
                      ? 'bg-[#FFF1F2] text-[#F51F2B] font-bold'
                      : 'text-[#101C38] hover:bg-[#F7F8FA] hover:text-[#F51F2B]'
                  }`}
                >
                  {title}
                </Link>
              ))}

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`block rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                  isActive('/contact')
                    ? 'bg-[#FFF1F2] text-[#F51F2B] font-bold'
                    : 'text-[#101C38] hover:bg-[#F7F8FA] hover:text-[#F51F2B]'
                }`}
              >
                Contact Us
              </Link>

              <div className="pt-3 pb-1 border-t border-[#E5E7EB] mt-2">
                <Link
                  to="/contact#quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-[#E5B544] hover:bg-[#CF9F30] text-[#101C38] w-full justify-center !py-3.5 text-sm font-bold shadow-sm inline-flex items-center gap-1.5 transition-all"
                >
                  <span>Get a Free Quote</span>
                  <ArrowRight size={15} />
                </Link>
                <a
                  href={`tel:${PHONE.replace(/\s+/g, '')}`}
                  className="mt-3 flex items-center justify-center gap-2 text-xs text-[#53627A] hover:text-[#F51F2B] transition-colors"
                >
                  <Phone size={13} className="text-[#F51F2B]" />
                  <span>Helpline: {PHONE}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

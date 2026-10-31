import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Menu, X, Phone, ShieldCheck } from 'lucide-react';
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

  const navLinkClass = (active) =>
    `relative flex items-center h-[74px] px-2.5 xl:px-3.5 text-[13.5px] xl:text-[14.5px] font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer ${
      active
        ? 'text-[#ED1C24] font-bold after:absolute after:bottom-0 after:inset-x-2 after:h-[3px] after:rounded-full after:bg-[#ED1C24]'
        : 'text-[#1F2937] hover:text-[#ED1C24]'
    }`;

  const isInsuranceActive = pathname.startsWith('/insurance');

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
      {/* Top Utility Micro-Bar */}
      <div className="hidden border-b border-[#E5E7EB] bg-[#F7F8FA] px-4 py-1.5 text-xs text-[#5B6472] md:block">
        <div className="wrap flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#171717]">
              <ShieldCheck size={14} className="text-[#ED1C24]" />
              Trusted Insurance Company • 50+ IRDAI Approved Partners
            </span>
            <span className="text-[#E5E7EB]">|</span>
            <span className="text-[#5B6472]">Fast & Reliable Policy Issuance & Claim Support</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${PHONE.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1.5 font-semibold text-[#171717] hover:text-[#ED1C24] transition-colors"
            >
              <Phone size={13} className="text-[#ED1C24]" />
              <span>Toll-Free Helpline: {PHONE}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="wrap flex h-[74px] items-center justify-between gap-4">
        {/* Brand Shield Logo & Name */}
        <Link to="/" className="flex shrink-0 items-center gap-3 group">
          <Logo className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105" />
          <div className="leading-tight">
            <span className="block font-display text-lg sm:text-xl font-black tracking-tight text-[#171717]">
              THE BEST
            </span>
            <span className="block text-[10px] sm:text-[11px] font-black tracking-[0.16em] text-[#ED1C24]">
              INSURANCE COMPANY
            </span>
            <span className="hidden text-[10px] font-medium text-[#5B6472] sm:block">
              Your World. Your People. Our Protection.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Properly aligned with no text wrapping) */}
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
                  dropdownOpen ? 'rotate-180 text-[#ED1C24]' : ''
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
                  className="absolute left-0 top-[calc(100%-8px)] z-50 pt-2 w-[310px] sm:w-[320px] max-w-[calc(100vw-2rem)]"
                >
                  <div className="rounded-2xl border border-[#E5E7EB] bg-white p-3.5 shadow-card">
                    <div className="px-2.5 pb-2 mb-2 border-b border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6472]">
                        Insurance Categories
                      </span>
                      <span className="text-[10px] font-semibold text-[#ED1C24]">
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
                                ? 'bg-[#FAF2DE] text-[#171717] ring-1 ring-[#DFB24A]'
                                : 'hover:bg-[#FAF2DE] text-[#171717]'
                            }`}
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                                active
                                  ? 'bg-[#DFB24A] text-[#171717]'
                                  : 'bg-[#FAF2DE] text-[#171717] group-hover:bg-[#DFB24A]'
                              }`}
                            >
                              <Icon size={19} />
                            </span>
                            <div className="flex-1 min-w-0">
                              <span className="block text-sm font-bold text-[#171717] leading-tight">
                                {c.nav}
                              </span>
                              <span className="block text-xs text-[#5B6472] leading-snug mt-0.5 line-clamp-2">
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
            <Link key={title} to={path} className={navLinkClass(isActive(path))}>
              {title}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions: Contact Us outline + Get a Quote Gold button */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-xs font-bold text-[#171717] shadow-xs hover:border-[#ED1C24] hover:text-[#ED1C24] hover:bg-[#FFF1F2] transition-all whitespace-nowrap"
          >
            Contact Us
          </Link>

          <Link
            to="/contact#quote"
            className="btn-gold hidden sm:inline-flex items-center gap-1.5 !px-4 !py-2 text-xs font-bold shadow-xs whitespace-nowrap"
          >
            <span>Get a Quote</span>
            <ArrowRight size={14} />
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#171717] hover:bg-[#F7F8FA] lg:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="overflow-hidden border-t border-[#E5E7EB] bg-white lg:hidden"
          >
            <div className="wrap space-y-1 py-4">
              <Link
                to="/"
                className="block rounded-xl px-4 py-2.5 text-base font-semibold text-[#171717] hover:bg-[#F7F8FA] hover:text-[#ED1C24]"
              >
                Home
              </Link>

              {/* Mobile Insurance Accordion */}
              <div>
                <button
                  className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-base font-semibold text-[#171717] hover:bg-[#F7F8FA] hover:text-[#ED1C24]"
                  aria-expanded={insuranceAccordion}
                  onClick={() => setInsuranceAccordion(!insuranceAccordion)}
                >
                  <span>Insurance Categories</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${
                      insuranceAccordion ? 'rotate-180 text-[#ED1C24]' : ''
                    }`}
                  />
                </button>
                {insuranceAccordion && (
                  <div className="my-1 space-y-1 rounded-xl bg-[#F7F8FA] p-2 pl-4">
                    {CATS.map((c) => {
                      const Icon = c.icon;
                      return (
                        <Link
                          key={c.id}
                          to={c.path}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#171717] hover:bg-white hover:text-[#ED1C24]"
                        >
                          <Icon size={16} className="text-[#ED1C24]" />
                          <span>{c.nav}</span>
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
                  className="block rounded-xl px-4 py-2.5 text-base font-semibold text-[#171717] hover:bg-[#F7F8FA] hover:text-[#ED1C24]"
                >
                  {title}
                </Link>
              ))}

              <Link
                to="/contact"
                className="block rounded-xl px-4 py-2.5 text-base font-semibold text-[#171717] hover:bg-[#F7F8FA] hover:text-[#ED1C24]"
              >
                Contact Us
              </Link>

              <div className="pt-3">
                <Link to="/contact#quote" className="btn-gold w-full justify-center">
                  Get a Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

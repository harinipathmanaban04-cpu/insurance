import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  X,
  Wallet,
  Clock,
  FileCheck,
  HeartHandshake,
  Lock,
  MousePointerClick,
  ClipboardList,
  UserCheck,
  ListChecks,
  Umbrella,
  ChevronLeft,
  ChevronRight,
  Star,
  Award,
  Sparkles,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import { CATS, TESTIMONIALS } from '../data/data';
import { PARTNER_LOGOS } from '../data/partners';
import { Reveal } from './Common';

// -------------------------------------------------------------
// 1. SMART PROTECTION SELECTOR
// -------------------------------------------------------------
export const Selector = () => {
  const [selectedId, setSelectedId] = useState('car');
  const navigate = useNavigate();
  const currentCat = CATS.find((x) => x.id === selectedId);

  return (
    <section className="wrap py-8">
      <div className="card border border-[#E5E7EB] bg-[#F7F8FA] p-4 sm:p-6 lg:p-8 shadow-card">
        <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
          {/* Header */}
          <div className="text-center lg:text-left lg:max-w-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3 py-1 text-xs font-bold text-[#171717] border border-[#E5B544]/50 mb-2">
              <Sparkles size={13} className="text-[#F51F2B]" />
              <span>Quick Plan Finder</span>
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#171717]">
              Smart Protection <span className="text-[#F51F2B]">Selector</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#53627A]">
              Select what you want to insure to find the best policy in minutes.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="grid w-full flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:max-w-2xl min-w-0">
            {CATS.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedId(cat.id)}
                  aria-pressed={isSelected}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-2.5 min-[360px]:p-3 sm:p-4 text-center transition-all duration-200 focus:outline-none min-h-[96px] min-w-0 ${
                    isSelected
                      ? 'border-[#E5B544] bg-white shadow-sm ring-2 ring-[#E5B544]/30'
                      : 'border-[#E5E7EB] bg-white hover:border-[#E5B544]/60'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-2 top-2 sm:right-2.5 sm:top-2.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-[#F51F2B] text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                  <span
                    className={`mb-2 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-[#E5B544] text-[#171717]'
                        : 'bg-[#FAF2DE] text-[#171717] group-hover:bg-[#E5B544]'
                    }`}
                  >
                    <Icon size={19} />
                  </span>
                  <span className="text-xs font-bold text-[#171717] leading-tight">
                    {cat.id === 'life-family'
                      ? 'Health + Life'
                      : cat.id === 'commercial'
                      ? 'Commercial'
                      : cat.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="w-full text-center max-w-xs sm:max-w-sm mx-auto lg:max-w-none lg:mx-0 lg:w-56 shrink-0 border-t border-[#E5E7EB] pt-4 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
            <span className="text-xs text-[#53627A] block">Selected Protection:</span>
            <b className="block text-sm font-bold text-[#171717] mt-0.5 truncate">
              {currentCat.type}
            </b>
            <button
              className="btn-gold mt-2.5 w-full shadow-xs text-xs sm:text-sm font-bold min-h-[42px]"
              onClick={() => navigate(currentCat.path)}
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 2. WHY CHOOSE US & COMPARISON TABLE
// -------------------------------------------------------------
const WHY = [
  [HeartHandshake, 'Trusted Guidance', 'Unbiased expert advice to help you choose the right policy for your needs.'],
  [Wallet, 'Affordable Premiums', 'Wide range of plans that maximize your coverage while fitting your budget.'],
  [Clock, 'Fast Assistance', 'Swift turnaround time for policy quotes, renewals, and endorsement support.'],
  [FileCheck, '100% Hassle-Free', 'Simple digital process with minimal paperwork and instant policy issuance.'],
  [ClipboardList, 'Dedicated Claim Help', 'End-to-end claims assistance from initial reporting to settlement.'],
  [Lock, 'Secure & IRDAI Compliant', 'Your privacy and data are safe with 256-bit encryption and IRDAI standards.'],
];

const ROWS = [
  ['Third-Party Legal Liability', true, true],
  ['Own Damage Coverage (Accidents)', false, true],
  ['Theft & Burglary Protection', false, true],
  ['Natural Calamity (Flood, Fire, Storm)', false, true],
  ['Personal Accident Cover (Owner-Driver)', true, true],
  ['Zero Depreciation Add-on Option', false, true],
  ['24/7 Roadside Assistance', false, true],
];

export const WhyCompare = () => (
  <section className="wrap grid gap-10 py-12 lg:grid-cols-2 lg:gap-12">
    {/* Why Choose Us */}
    <div id="why" className="scroll-mt-24">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
        <Award size={13} className="text-[#F51F2B]" />
        <span>Our Core Advantage</span>
      </div>
      <h2 className="h2">
        Why Choose <span className="text-[#F51F2B]">THE BEST</span> Insurance Point?
      </h2>
      <p className="mt-2 text-sm sm:text-base text-[#53627A]">
        We make insurance transparent, accessible, and reliable with personalized guidance from start to finish.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {WHY.map(([Icon, title, desc]) => (
          <div
            key={title}
            className="flex items-start gap-3.5 rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-card hover:border-[#E5B544] transition-all"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#171717]">
              <Icon size={19} />
            </span>
            <div>
              <b className="block text-sm font-bold text-[#171717]">{title}</b>
              <p className="mt-1 text-xs text-[#53627A] leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Compare & Decide */}
    <div id="compare" className="card scroll-mt-24 border border-[#E5E7EB] p-4 sm:p-6 md:p-7 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[#171717]">Compare & Decide</h3>
            <p className="text-xs text-[#53627A] mt-0.5">
              Choose the cover level that gives you complete peace of mind.
            </p>
          </div>
          <span className="rounded-full bg-[#FAF2DE] px-2.5 py-1 text-[11px] font-bold text-[#171717] border border-[#E5B544]/50 shrink-0">
            Policy Matrix
          </span>
        </div>

        <div className="mt-4 w-full overflow-x-auto">
          <table className="w-full min-w-[280px] sm:min-w-0 text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-left text-[11px] sm:text-xs uppercase tracking-wider text-[#53627A]">
                <th className="py-2.5 px-1 sm:px-2">Key Features</th>
                <th className="py-2.5 px-1 sm:px-2 text-center font-bold text-[#53627A]">Third Party</th>
                <th className="rounded-t-xl bg-[#FAF2DE] py-2.5 px-1 sm:px-2 text-center font-bold text-[#171717] border-x border-[#E5B544]/40">
                  Comprehensive
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-xs">
              {ROWS.map(([feature, thirdParty, comprehensive]) => (
                <tr key={feature} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="py-2.5 px-1 sm:px-2 font-medium text-[#171717] leading-tight">{feature}</td>
                  <td className="py-2.5 px-1 sm:px-2 text-center">
                    {thirdParty ? (
                      <Check className="mx-auto text-[#171717]" size={16} />
                    ) : (
                      <X className="mx-auto text-[#A7ADB4]" size={16} />
                    )}
                  </td>
                  <td className="bg-[#FAF2DE]/40 py-2.5 px-1 sm:px-2 text-center border-x border-[#E5B544]/30 font-semibold">
                    {comprehensive ? (
                      <Check className="mx-auto text-[#F51F2B]" size={16} />
                    ) : (
                      <X className="mx-auto text-[#A7ADB4]" size={16} />
                    )}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-[#E5E7EB] bg-[#F7F8FA]">
                <td className="py-2.5 px-1 sm:px-2 font-bold text-[#171717]">Add-on Riders</td>
                <td className="py-2.5 px-1 sm:px-2 text-center text-[#53627A]">Limited</td>
                <td className="bg-[#FAF2DE] py-2.5 px-1 sm:px-2 text-center font-bold text-[#171717] border-x border-[#E5B544]/40">
                  Full Suite Available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 border-t border-[#E5E7EB] pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-[11px] text-[#53627A]">
          *Subject to policy terms, insurer guidelines, and vehicle age.
        </p>
        <Link to="/contact#quote" className="text-xs font-bold text-[#F51F2B] hover:underline whitespace-nowrap">
          Get Expert Comparison →
        </Link>
      </div>
    </div>
  </section>
);

// -------------------------------------------------------------
// 3. HOW INSURANCE WORKS
// -------------------------------------------------------------
const STEPS = [
  [MousePointerClick, 'Choose Insurance', 'Select car, bike, commercial or health & life insurance.'],
  [ClipboardList, 'Share Details', 'Submit basic vehicle or family details in under 2 minutes.'],
  [UserCheck, 'Expert Guidance', 'Our licensed advisor reviews best matching quotes for you.'],
  [ListChecks, 'Select Policy', 'Pick the insurer with the best premium, cashless network & cover.'],
  [Umbrella, 'Instant Protection', 'Receive your policy instantly via email & WhatsApp.'],
];

export const How = () => (
  <section className="wrap py-12 sm:py-16">
    <div className="mx-auto max-w-2xl text-center mb-10">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
        <Sparkles size={13} className="text-[#F51F2B]" />
        <span>Simple 5-Step Process</span>
      </div>
      <h2 className="h2">How Getting Insured Works</h2>
      <p className="mt-2 text-sm sm:text-base text-[#53627A]">
        No confusing paperwork. Just honest advice and quick digital policy issuance.
      </p>
    </div>

    <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map(([Icon, title, desc], i) => (
        <Reveal
          key={title}
          className={`relative ${
            i === 4 ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto lg:col-span-1 lg:max-w-none w-full' : ''
          }`}
        >
          <div className="card h-full border border-[#E5E7EB] bg-white p-5 text-center transition-all duration-200 hover:-translate-y-1 hover:border-[#E5B544]">
            {/* Step Number Badge */}
            <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF2DE] text-[#171717] border border-[#E5B544]/40">
              <Icon size={22} />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#171717] text-[11px] font-bold text-white shadow-xs">
                {i + 1}
              </span>
            </div>

            <b className="block text-sm font-bold text-[#171717]">{title}</b>
            <p className="mt-2 text-xs text-[#53627A] leading-relaxed">{desc}</p>
          </div>

          {/* Connecting Arrow for Desktop */}
          {i < 4 && (
            <div className="absolute -right-3 top-[102px] -translate-y-1/2 translate-x-1/2 hidden text-[#9CA3AF] lg:flex items-center justify-center z-10 pointer-events-none">
              <ArrowRight size={16} />
            </div>
          )}
        </Reveal>
      ))}
    </div>
  </section>
);

// -------------------------------------------------------------
// 4. STATS SECTION (White Theme, NO RED CARD)
// -------------------------------------------------------------
export const Stats = () => {
  return (
    <section className="wrap py-8 sm:py-12">
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-8 lg:p-10 shadow-card">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left / Stats Grid */}
          <div className="grid flex-1 grid-cols-2 gap-3 min-[400px]:gap-4 sm:grid-cols-5 sm:gap-4 min-w-0">
            {[
              { val: '25K+', label: 'Active Customers', sub: 'Across India', icon: Users },
              { val: '50+', label: 'Insurance Partners', sub: 'Leading Insurers', icon: ShieldCheck },
              { val: '15+', label: 'Years of Trust', sub: 'Proven Expertise', icon: Award },
              { val: '99.5%', label: 'Claims Settled', sub: 'Fast Clearance', icon: CheckCircle2 },
              { val: '24/7', label: 'Support Available', sub: 'Round The Clock', icon: PhoneCall },
            ].map(({ val, label, sub, icon: Icon }) => (
              <div
                key={label}
                className="min-w-0 flex flex-col items-center justify-center rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-3 sm:p-4 text-center transition-all duration-200 hover:border-[#E5B544] hover:bg-white last:col-span-2 sm:last:col-span-1"
              >
                <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#171717]">
                  <Icon size={18} />
                </span>
                <b className="font-display text-xl min-[360px]:text-2xl sm:text-3xl font-black text-[#171717] tracking-tight">
                  {val}
                </b>
                <span className="mt-1 text-xs font-bold text-[#171717]">{label}</span>
                <span className="text-[10px] text-[#53627A]">{sub}</span>
              </div>
            ))}
          </div>

          {/* Right / Consultation Box */}
          <div className="flex shrink-0 flex-col justify-between rounded-2xl border border-[#E5B544]/60 bg-[#FAF2DE] p-5 sm:p-6 lg:w-80 shadow-xs">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E5B544] text-[#171717] shadow-xs">
                <PhoneCall size={20} />
              </span>
              <div>
                <b className="block text-sm font-bold text-[#171717]">Need Help Deciding?</b>
                <span className="text-xs text-[#53627A]">Free, unbiased expert advice</span>
              </div>
            </div>
            <p className="text-xs text-[#53627A] leading-relaxed mb-4">
              Not sure which policy suits your budget? Speak directly to our certified insurance advisor.
            </p>
            <Link to="/contact#quote" className="btn-gold w-full justify-center text-xs sm:text-sm font-bold shadow-xs">
              <span>Talk to an Expert</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 5. TESTIMONIALS (7 slides of 3 reviews = 21 reviews total)
// -------------------------------------------------------------
export const Testimonials = () => {
  const [slide, setSlide] = useState(0);
  const totalSlides = 7; // Exactly 7 slides representing 21 reviews (3 reviews per slide)
  const visible = TESTIMONIALS.slice(slide * 3, slide * 3 + 3);

  return (
    <section className="wrap py-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center mb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
          <Star size={13} fill="#E5B544" className="text-[#E5B544]" />
          <span>Customer Feedback</span>
        </div>
        <h2 className="h2">What Our Customers Say</h2>
        <p className="mt-2 text-sm sm:text-base text-[#53627A]">
          Hear from individuals, families, and business owners who rely on THE BEST INSURANCE POINT.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Prev Button: Navigates slide by slide */}
        <button
          aria-label="Previous slide"
          onClick={() => setSlide((slide - 1 + totalSlides) % totalSlides)}
          className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#101C38] shadow-xs transition hover:border-[#E5B544] hover:bg-[#FAF2DE] hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Testimonials Grid (1 card on mobile, 2 on tablet, 3 on desktop) */}
        <div className="grid flex-1 gap-3.5 sm:gap-4 lg:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-w-0">
          {visible.map(([name, location, feedback], k) => (
            <motion.div
              key={name + '-' + slide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`card flex flex-col justify-between bg-white p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 min-w-0 ${
                k === 1
                  ? 'border border-[#E5B544] ring-1 ring-[#E5B544]/20 hidden md:flex'
                  : k === 2
                  ? 'border border-[#E5E7EB] hidden lg:flex'
                  : 'border border-[#E5E7EB] flex'
              }`}
            >
              <div>
                {/* 5 Stars in Radiant Gold */}
                <div className="flex gap-1 text-[#E5B544]">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-3.5 text-xs sm:text-sm text-[#171717] leading-relaxed italic min-h-[66px] sm:min-h-[72px]">
                  "{feedback}"
                </p>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-[#E5E7EB] pt-4">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#FAF2DE] font-bold text-xs sm:text-sm text-[#101C38] border border-[#E5B544]/40 shrink-0">
                  {name.trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <b className="block text-sm font-bold text-[#101C38] truncate">{name}</b>
                  <p className="text-xs text-[#53627A] truncate">
                    {location} • <span className="text-[#8C6D1F] font-medium">Sample Customer Review</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Next Button: Navigates slide by slide */}
        <button
          aria-label="Next slide"
          onClick={() => setSlide((slide + 1) % totalSlides)}
          className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-[#101C38] shadow-xs transition hover:border-[#E5B544] hover:bg-[#FAF2DE] hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Exactly 7 Pagination Dots (Each dot represents 1 slide of 3 reviews) */}
      <div className="mt-8 flex items-center justify-center gap-2 px-4">
        {Array.from({ length: totalSlides }).map((_, k) => (
          <button
            key={k}
            type="button"
            aria-label={`Go to slide ${k + 1} of ${totalSlides}`}
            onClick={() => setSlide(k)}
            className={`h-2 rounded-full transition-all duration-200 cursor-pointer ${
              k === slide ? 'w-7 bg-[#E5B544]' : 'w-2 bg-[#E5E7EB] hover:bg-[#A7ADB4]'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 6. OUR TRUSTED INSURANCE PARTNERS
// Requirements:
// - Exact heading: "Our Trusted Insurance Partners"
// - Exact supporting text: "We work with leading insurance providers to bring you reliable coverage and the right protection for your needs."
// - Exact 4 filters: All Partners | General & Motor | Life | Health
// - NO Top Insurers filter button!
// - NO counts beside labels (NO "(51)")!
// - Selected filter: Gold background (#E5B544) with dark text!
// - Original full-color partner logos with NO grayscale, NO opacity reduction!
// - 6-7 cols desktop, 3-4 cols tablet, 2 cols mobile.
// -------------------------------------------------------------
export const Partners = () => {
  const [filter, setFilter] = useState('All Partners');
  const [showAll, setShowAll] = useState(false);

  // Exact 4 filters as requested
  const filterTabs = ['All Partners', 'General & Motor', 'Life', 'Health'];

  const filteredLogos = PARTNER_LOGOS.filter((p) => {
    if (filter === 'All Partners') return true;
    if (filter === 'General & Motor') return p.category === 'General & Motor';
    if (filter === 'Life') return p.category === 'Life';
    if (filter === 'Health') return p.category === 'Health';
    return true;
  });

  // Display initial 21 on All Partners with show-more option, or full list when filtered/expanded
  const displayedLogos =
    showAll || filter !== 'All Partners' ? filteredLogos : filteredLogos.slice(0, 21);

  return (
    <section id="partners" className="wrap scroll-mt-24 py-12 sm:py-16">
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
          <ShieldCheck size={14} className="text-[#F51F2B]" />
          <span>Authorized Insurance Network</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#171717] tracking-tight">
          Our Trusted Insurance Partners
        </h2>
        <p className="mt-3 text-xs sm:text-sm lg:text-base text-[#53627A] max-w-2xl mx-auto leading-relaxed">
          We work with leading insurance providers to bring you reliable coverage and the right protection for your needs.
        </p>
      </div>

      {/* Exactly 4 Functional Filter Buttons: All Partners | General & Motor | Life | Health */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-8">
        {filterTabs.map((tab) => {
          const isSelected = filter === tab;
          return (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setShowAll(false);
              }}
              className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-[#E5B544] text-[#171717] shadow-xs ring-2 ring-[#E5B544]/40'
                  : 'bg-white border border-[#E5E7EB] text-[#53627A] hover:border-[#E5B544] hover:text-[#171717]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Clean Responsive Logo Grid (Centered when Health is selected, full grid for other tabs) */}
      <div
        className={`min-w-0 ${
          filter === 'Health'
            ? 'flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 max-w-6xl mx-auto'
            : 'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 sm:gap-4'
        }`}
      >
        {displayedLogos.map((partner) => (
          <div
            key={partner.id}
            title={partner.name}
            className={`group flex h-18 sm:h-22 items-center justify-center rounded-2xl border border-[#E5E7EB] bg-white p-2.5 sm:p-3.5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E5B544] hover:shadow-card min-w-0 ${
              filter === 'Health'
                ? 'w-[calc(50%-0.625rem)] sm:w-[calc(33.333%-0.75rem)] md:w-[calc(33.333%-0.75rem)] lg:flex-1 lg:max-w-[175px]'
                : ''
            }`}
          >
            {/* Logo in original full official brand colors, rich, saturated and clear */}
            <img
              src={partner.img}
              alt={partner.name}
              loading="lazy"
              className="max-h-9 sm:max-h-12 w-auto max-w-full object-contain opacity-100 filter contrast-[1.06] saturate-[1.12] transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Show More / View All Toggle (Preserves display of all 51 partners) */}
      {filter === 'All Partners' && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="btn-outline text-xs sm:text-sm font-bold inline-flex items-center gap-2"
          >
            <span>{showAll ? 'Show Fewer Partners' : 'View All Insurance Partners'}</span>
            {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-[#53627A]">
        All trademarks, logos, and brand names are the property of their respective owners. THE BEST INSURANCE POINT provides unbiased policy comparison and claims support.
      </p>
    </section>
  );
};

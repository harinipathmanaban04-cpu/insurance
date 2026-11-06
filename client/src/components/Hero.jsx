import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Car,
  Bike,
  Truck,
  Users,
  Shield,
  FileCheck,
  Headphones,
  ChevronDown,
} from 'lucide-react';
import { CATS } from '../data/data';
import familyConsultationImg from '../assets/family-consultation.jpg';
import { Img, Reveal } from './Common';

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const [regNo, setRegNo] = useState('');
  const [policyType, setPolicyType] = useState('Car Insurance');
  const navigate = useNavigate();

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      type: policyType,
      ...(regNo.trim() ? { reg: regNo.trim() } : {}),
    }).toString();
    navigate(`/contact?${query}#quote`);
  };

  return (
    <div className="relative bg-[#FFFCF5] w-full max-w-full overflow-hidden">
      {/* 1. Main Hero Area */}
      <section className="relative overflow-hidden isolate w-full pt-3 sm:pt-4 lg:pt-5 pb-10 sm:pb-12 lg:pb-14">
        {/* Soft Ambient Glows */}
        <div className="pointer-events-none absolute -left-16 top-0 h-[400px] w-[400px] rounded-full bg-[#FAF2DE]/70 blur-3xl -z-10" />
        <div className="pointer-events-none absolute right-10 top-20 h-[360px] w-[360px] rounded-full bg-[#FFF1F2]/50 blur-3xl -z-10" />

        {/* Desktop Right Image: Smooth Curved Golden Arch matching reference image */}
        <div className="hidden lg:block absolute top-2.5 sm:top-3.5 lg:top-4 bottom-8 sm:bottom-10 lg:bottom-12 left-[calc(50%+0.5rem)] xl:left-[calc(50%+1rem)] right-0 overflow-hidden rounded-tl-[110px] xl:rounded-tl-[130px] rounded-bl-[110px] xl:rounded-bl-[130px] rounded-r-none border-l-[3.5px] border-t-[3.5px] border-b-[3.5px] border-r-0 border-[#E5B544] shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-slate-100 z-10">
          <img
            src={familyConsultationImg}
            alt="Family consulting with professional insurance advisor"
            className="h-full w-full object-cover object-[center_top] xl:object-center filter contrast-[1.08] saturate-[1.2] brightness-[1.01]"
          />
        </div>

        <div className="wrap relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT COLUMN: Exactly matching reference image */}
            <div className="lg:col-span-6 xl:col-span-6 w-full min-w-0 max-w-xl lg:max-w-none">
              {/* Top Safety Badge */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold text-[#8C6D1F] border border-[#E5B544]/50 mb-3 sm:mb-3.5 shadow-2xs"
              >
                <Shield size={13} className="text-[#8C6D1F]" />
                <span>Your Safety, Our Priority</span>
              </motion.div>

              {/* Main Heading: Reduced text size matching Image 1 */}
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black tracking-tight text-[24px] min-[360px]:text-[28px] min-[400px]:text-[32px] sm:text-4xl lg:text-[40px] xl:text-[44px] leading-[1.14] break-words"
              >
                <span className="block text-[#101C38]">Protect Your Family.</span>
                <span className="block text-[#F51F2B] mt-0.5 sm:mt-1">Secure Every Tomorrow.</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="mt-3 sm:mt-3.5 text-xs min-[360px]:text-[13px] sm:text-sm lg:text-[14px] text-[#53627A] leading-relaxed w-full max-w-[480px] break-words"
              >
                From protecting your family's health to securing your vehicles and business, we make insurance simple with trusted partners, expert guidance and reliable support.
              </motion.p>

              {/* Instant Quotation Form - Exactly matching Image 1 */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-5 sm:mt-5.5 w-full max-w-[530px]"
              >
                <span className="block text-[10.5px] font-bold text-[#101C38] uppercase tracking-wider mb-2">
                  GET AN INSTANT QUOTATION
                </span>

                <form
                  onSubmit={handleQuoteSubmit}
                  className="w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-stretch overflow-hidden"
                >
                  {/* Field 1: Vehicle / Mobile */}
                  <div className="flex-1 min-w-0 px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center border-b sm:border-b-0 sm:border-r border-[#E5E7EB] min-h-[50px]">
                    <Car size={18} className="text-[#101C38]/60 mr-2.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label htmlFor="hero-vehicle-input" className="block text-[9px] font-bold uppercase tracking-wider text-[#53627A] leading-[1.15] select-none">
                        <span className="block whitespace-nowrap">VEHICLE NO /</span>
                        <span className="block whitespace-nowrap">MOBILE</span>
                      </label>
                      <input
                        id="hero-vehicle-input"
                        type="text"
                        placeholder="e.g. MH 02 CB 12"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        className="w-full min-w-0 text-xs sm:text-[13px] font-semibold text-[#101C38] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent pt-0.5"
                      />
                    </div>
                  </div>

                  {/* Field 2: Insurance Category Selector */}
                  <div className="flex-1 min-w-0 px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center border-b sm:border-b-0 min-h-[50px]">
                    <ShieldCheck size={18} className="text-[#101C38]/60 mr-2.5 shrink-0" />
                    <div className="min-w-0 flex-1 relative pr-4">
                      <label htmlFor="hero-category-select" className="block text-[9px] font-bold uppercase tracking-wider text-[#53627A] leading-[1.15] mb-0.5 select-none whitespace-nowrap">
                        CATEGORY
                      </label>
                      <select
                        id="hero-category-select"
                        value={policyType}
                        onChange={(e) => setPolicyType(e.target.value)}
                        className="w-full min-w-0 text-xs sm:text-[13px] font-bold text-[#101C38] focus:outline-none bg-transparent cursor-pointer truncate appearance-none pr-3"
                      >
                        <option value="Car Insurance">Car Insurance</option>
                        <option value="Bike Insurance">Bike Insurance</option>
                        <option value="Commercial Vehicle Insurance">Commercial Vehicle Insurance</option>
                        <option value="Health + Life Insurance">Health + Life Insurance</option>
                      </select>
                      <ChevronDown size={14} className="pointer-events-none absolute right-0 bottom-1 text-[#101C38]/70" />
                    </div>
                  </div>

                  {/* Red CTA Button: Flush with right, top, bottom matching Image 1 */}
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#F51F2B] hover:bg-[#D61420] text-white font-bold text-xs uppercase tracking-wider py-3 sm:py-0 px-5 sm:px-6 transition-colors whitespace-nowrap shrink-0 active:bg-[#C71219]"
                  >
                    <span>GET A QUOTE</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </motion.div>

              {/* Mobile Dedicated Family Insurance Image (< lg screens: Positioned below quotation form matching phone mockup) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="lg:hidden mt-6 w-full"
              >
                <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-card aspect-[16/10] sm:aspect-[16/9] md:aspect-[21/9] md:max-h-[360px]">
                  <img
                    src={familyConsultationImg}
                    alt="Indian family consulting with professional insurance advisor"
                    className="h-full w-full object-cover object-[center_top] sm:object-center filter contrast-[1.08] saturate-[1.2] brightness-[1.01]"
                  />
                </div>
              </motion.div>

              {/* Trust Indicators: 3 items */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 sm:mt-6 grid grid-cols-1 min-[480px]:grid-cols-3 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1 w-full max-w-[540px]"
              >
                {/* 1. Expert Advisors */}
                <Link
                  to="/contact"
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/80 transition-colors group min-w-0"
                >
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#F51F2B] transition-transform group-hover:scale-105">
                    <Users size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block text-xs sm:text-[13px] font-bold text-[#101C38] leading-tight truncate">
                      Expert Advisors
                    </b>
                    <span className="block text-[11px] text-[#53627A] mt-0.5 truncate">
                      24/7 Guidance
                    </span>
                  </div>
                </Link>

                {/* 2. 50+ IRDAI Partners */}
                <div className="flex items-center gap-2.5 p-1 rounded-xl min-w-0">
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#F51F2B]">
                    <ShieldCheck size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block text-xs sm:text-[13px] font-bold text-[#101C38] leading-tight truncate">
                      50+ IRDAI Partners
                    </b>
                    <span className="block text-[11px] text-[#53627A] mt-0.5 truncate">
                      Trusted Network
                    </span>
                  </div>
                </div>

                {/* 3. 100% Cashless Claims */}
                <div className="flex items-center gap-2.5 p-1 rounded-xl min-w-0">
                  <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF2DE] text-[#E5B544]">
                    <CheckCircle2 size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <b className="block text-xs sm:text-[13px] font-bold text-[#101C38] leading-tight truncate">
                      100% Cashless
                    </b>
                    <span className="block text-[11px] text-[#53627A] mt-0.5 truncate">
                      Hassle-free Process
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN SPACER: Reserves height on desktop */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 min-h-[440px] xl:min-h-[480px] pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 2. Floating Statistics Panel */}
      <div className="wrap relative z-30 -mt-6 sm:-mt-8 lg:-mt-10 pb-6">
        <div className="w-full rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-3 min-[360px]:p-4 sm:p-6 lg:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-0 lg:divide-x lg:divide-[#E5E7EB]">
            {/* Stat 1: 20,000+ Happy Customers */}
            <div className="min-w-0 flex items-center gap-2 sm:gap-4 p-1.5 sm:p-3 lg:p-0 lg:px-6">
              <span className="flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#F51F2B]">
                <Users size={18} className="sm:size-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <b className="font-display text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight block truncate">
                  20,000+
                </b>
                <span className="block text-[11px] sm:text-xs font-semibold text-[#53627A] mt-0.5 leading-snug truncate">
                  Happy Customers
                </span>
              </div>
            </div>

            {/* Stat 2: 50+ Insurance Partners */}
            <div className="min-w-0 flex items-center gap-2 sm:gap-4 p-1.5 sm:p-3 lg:p-0 lg:px-6">
              <span className="flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF2DE] text-[#E5B544]">
                <ShieldCheck size={18} className="sm:size-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <b className="font-display text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight block truncate">
                  50+
                </b>
                <span className="block text-[11px] sm:text-xs font-semibold text-[#53627A] mt-0.5 leading-snug truncate">
                  Insurance Partners
                </span>
              </div>
            </div>

            {/* Stat 3: 98% Claim Settlement Ratio */}
            <div className="min-w-0 flex items-center gap-2 sm:gap-4 p-1.5 sm:p-3 lg:p-0 lg:px-6">
              <span className="flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F8F5] text-[#10B981]">
                <FileCheck size={18} className="sm:size-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <b className="font-display text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight block truncate">
                  98%
                </b>
                <span className="block text-[11px] sm:text-xs font-semibold text-[#53627A] mt-0.5 leading-snug truncate">
                  Claim Ratio
                </span>
              </div>
            </div>

            {/* Stat 4: 24/7 Customer Support */}
            <div className="min-w-0 flex items-center gap-2 sm:gap-4 p-1.5 sm:p-3 lg:p-0 lg:px-6">
              <span className="flex h-9 w-9 min-[360px]:h-10 min-[360px]:w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                <Headphones size={18} className="sm:size-[22px]" />
              </span>
              <div className="min-w-0 flex-1">
                <b className="font-display text-base min-[360px]:text-lg sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight block truncate">
                  24/7
                </b>
                <span className="block text-[11px] sm:text-xs font-semibold text-[#53627A] mt-0.5 leading-snug truncate">
                  Customer Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4 Core Category Cards matching reference design exactly
const CORE_CARDS = [
  {
    id: 'car',
    title: 'Car Insurance',
    desc: 'Comprehensive protection for your car against accidents, theft and damages.',
    path: '/insurance/car',
    type: 'Car Insurance',
    icon: Car,
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=75',
    circleBg: 'bg-[#087F8C]',
    btnBg: 'bg-[#087F8C] hover:bg-[#066772]',
  },
  {
    id: 'bike',
    title: 'Bike Insurance',
    desc: 'Complete safety for your two-wheeler with affordable insurance plans.',
    path: '/insurance/bike',
    type: 'Bike Insurance',
    icon: Bike,
    img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=75',
    circleBg: 'bg-[#E8A317]',
    btnBg: 'bg-[#E8A317] hover:bg-[#cf8e0c]',
  },
  {
    id: 'commercial',
    title: 'Commercial Insurance',
    desc: 'Protection for your business vehicles and keep your business moving.',
    path: '/insurance/commercial',
    type: 'Commercial Insurance',
    icon: Truck,
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=75',
    circleBg: 'bg-[#386FA4]',
    btnBg: 'bg-[#386FA4] hover:bg-[#2d5c8a]',
  },
  {
    id: 'life-family',
    title: 'Health + Life Insurance',
    desc: "Comprehensive health hospitalization and family term protection in one plan.",
    path: '/insurance/life-family',
    type: 'Health + Life Insurance',
    icon: Users,
    img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=75',
    circleBg: 'bg-[#7E57C2]',
    btnBg: 'bg-[#7E57C2] hover:bg-[#6a44ab]',
  },
];

export const Cards = () => {
  return (
    <section id="services" className="wrap scroll-mt-24 py-12 sm:py-16">
      {/* 4 Insurance Category Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CORE_CARDS.map((c) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.id}>
              <div className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)]">
                {/* Card Top: Image with Centered Overlapping Circular Category Icon */}
                <div className="relative">
                  <div className="h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                    <Img
                      src={c.img}
                      alt={c.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Centered Floating Circular Category Icon on Image/Body Boundary */}
                  <div
                    className={`absolute -bottom-6 left-1/2 -translate-x-1/2 flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full border-[3.5px] border-white shadow-md text-white z-10 transition-transform duration-300 group-hover:scale-110 ${c.circleBg}`}
                  >
                    <Icon size={22} className="text-white" strokeWidth={2.2} />
                  </div>
                </div>

                {/* Card Body: Title, Description, and Actions */}
                <div className="flex flex-1 flex-col justify-between pt-9 pb-5 px-5 sm:px-6 text-center">
                  <div>
                    <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#171717] mb-2 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#53627A] leading-relaxed min-h-[44px]">
                      {c.desc}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center justify-between gap-3 pt-6 mt-auto">
                    <Link
                      to={c.path}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 ${c.btnBg}`}
                    >
                      <span>Explore Plans</span>
                      <ArrowRight size={13} />
                    </Link>
                    <Link
                      to={`/contact?type=${encodeURIComponent(c.type)}#quote`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#171717] hover:text-[#087F8C] transition-colors"
                    >
                      <span>Get Quote</span>
                      <ArrowRight size={13} className="text-[#386FA4]" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

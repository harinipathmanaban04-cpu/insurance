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
    <div className="relative bg-[#FFFCF5]">
      {/* 1. Main Hero Area (Reduced top gap to upward picture and align sentences cleanly) */}
      <section className="relative overflow-hidden pt-2.5 sm:pt-3.5 lg:pt-4 pb-10 sm:pb-12 lg:pb-14">
        {/* Soft Ambient Glows */}
        <div className="pointer-events-none absolute -left-16 top-0 h-[400px] w-[400px] rounded-full bg-[#FAF2DE]/70 blur-3xl -z-10" />
        <div className="pointer-events-none absolute right-10 top-20 h-[360px] w-[360px] rounded-full bg-[#FFF1F2]/50 blur-3xl -z-10" />

        <div className="wrap relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-8 xl:gap-12 items-center">
            {/* LEFT COLUMN: ~48% on desktop */}
            <div className="lg:col-span-6 xl:col-span-6 max-w-xl lg:max-w-none">
              {/* Top Safety Badge */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold text-[#8C6D1F] border border-[#E5B544]/40 mb-3 sm:mb-3.5 shadow-2xs"
              >
                <Shield size={13} className="text-[#8C6D1F]" />
                <span>Your Safety, Our Priority</span>
              </motion.div>

              {/* Main Heading: 2 lines matching reference image */}
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black tracking-tight flex flex-col text-[26px] min-[360px]:text-[29px] min-[400px]:text-[33px] sm:text-4xl lg:text-[42px] xl:text-[46px] 2xl:text-[50px] leading-[1.12]"
              >
                <span className="block text-[#101C38]">Protect Your Family.</span>
                <span className="block text-[#F51F2B] mt-0.5 sm:mt-1">Secure Every Tomorrow.</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="mt-3.5 sm:mt-4 text-xs min-[360px]:text-[13px] sm:text-sm lg:text-[15px] text-[#53627A] leading-relaxed max-w-[500px]"
              >
                From protecting your family's health to securing your vehicles and business, we make insurance simple with trusted partners, expert guidance and reliable support.
              </motion.p>

              {/* Instant Quotation Form */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-5 sm:mt-6 w-full max-w-[520px]"
              >
                <span className="block text-[11px] font-bold text-[#101C38] uppercase tracking-wider mb-2">
                  GET AN INSTANT QUOTATION
                </span>

                <form
                  onSubmit={handleQuoteSubmit}
                  className="rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-3 lg:p-0 flex flex-col lg:flex-row lg:items-stretch gap-2.5 lg:gap-0 overflow-hidden"
                >
                  {/* Field 1: Vehicle / Mobile */}
                  <div className="flex-1 px-3.5 py-2.5 lg:py-2.5 rounded-xl lg:rounded-none bg-[#F7F8FA] lg:bg-transparent border border-[#E5E7EB] lg:border-0 lg:border-r lg:border-[#E5E7EB] flex items-center">
                    <Car size={17} className="text-[#101C38]/60 mr-2.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label htmlFor="hero-vehicle-input" className="block text-[9px] font-bold uppercase tracking-wider text-[#53627A]">
                        Vehicle No / Mobile
                      </label>
                      <input
                        id="hero-vehicle-input"
                        type="text"
                        placeholder="e.g. MH 02 CB 1234"
                        value={regNo}
                        onChange={(e) => setRegNo(e.target.value)}
                        className="w-full text-xs sm:text-[13px] font-semibold text-[#101C38] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent pt-0.5"
                      />
                    </div>
                  </div>

                  {/* Field 2: Insurance Category Selector */}
                  <div className="px-3.5 py-2.5 lg:py-2.5 rounded-xl lg:rounded-none bg-[#F7F8FA] lg:bg-transparent border border-[#E5E7EB] lg:border-0 lg:border-r lg:border-[#E5E7EB] lg:min-w-[170px] flex items-center">
                    <ShieldCheck size={17} className="text-[#101C38]/60 mr-2.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <label htmlFor="hero-category-select" className="block text-[9px] font-bold uppercase tracking-wider text-[#53627A]">
                        Category
                      </label>
                      <select
                        id="hero-category-select"
                        value={policyType}
                        onChange={(e) => setPolicyType(e.target.value)}
                        className="w-full text-xs sm:text-[13px] font-semibold text-[#101C38] focus:outline-none bg-transparent pt-0.5 cursor-pointer"
                      >
                        <option value="Car Insurance">Car Insurance</option>
                        <option value="Bike Insurance">Bike Insurance</option>
                        <option value="Commercial Vehicle Insurance">Commercial Vehicle</option>
                        <option value="Life & Family Insurance">Life & Family</option>
                      </select>
                    </div>
                  </div>

                  {/* Red CTA Button */}
                  <button
                    type="submit"
                    className="w-full lg:w-auto inline-flex items-center justify-center gap-1.5 bg-[#F51F2B] hover:bg-[#D61420] text-white font-bold text-xs uppercase tracking-wider py-3.5 lg:py-0 px-6 rounded-xl lg:rounded-none transition-all shadow-sm active:translate-y-0.5 whitespace-nowrap shrink-0"
                  >
                    <span>GET A QUOTE</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </motion.div>

              {/* Mobile Dedicated Family Insurance Image (< lg screens: Positioned below quotation form matching reference phone mockup) */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="lg:hidden mt-6 w-full"
              >
                <div className="relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-card aspect-[16/10] sm:aspect-[16/9]">
                  <img
                    src={familyConsultationImg}
                    alt="Indian family consulting with professional insurance advisor"
                    className="h-full w-full object-cover object-[center_top] sm:object-center filter contrast-[1.08] saturate-[1.2] brightness-[1.01]"
                  />
                </div>
              </motion.div>

              {/* Trust Indicators: 3 items horizontally aligned on desktop, stacked cleanly on mobile */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1 max-w-[530px]"
              >
                {/* 1. Talk to an Expert */}
                <Link
                  to="/contact"
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-colors group"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#F51F2B] transition-transform group-hover:scale-105">
                    <Users size={18} />
                  </span>
                  <div className="min-w-0">
                    <b className="block text-xs sm:text-[13px] font-bold text-[#101C38] leading-tight truncate">
                      Talk to an Expert
                    </b>
                    <span className="block text-[11px] text-[#53627A] mt-0.5 truncate">
                      24/7 Support
                    </span>
                  </div>
                </Link>

                {/* 2. 50+ IRDAI Partners */}
                <div className="flex items-center gap-3 p-2 rounded-xl">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#F51F2B]">
                    <ShieldCheck size={18} />
                  </span>
                  <div className="min-w-0">
                    <b className="block text-xs sm:text-[13px] font-bold text-[#101C38] leading-tight truncate">
                      50+ IRDAI Partners
                    </b>
                    <span className="block text-[11px] text-[#53627A] mt-0.5 truncate">
                      Trusted Network
                    </span>
                  </div>
                </div>

                {/* 3. 100% Cashless Claims */}
                <div className="flex items-center gap-3 p-2 rounded-xl">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF2DE] text-[#E5B544]">
                    <CheckCircle2 size={18} />
                  </span>
                  <div className="min-w-0">
                    <b className="block text-xs sm:text-[13px] font-bold text-[#101C38] leading-tight truncate">
                      100% Cashless Claims
                    </b>
                    <span className="block text-[11px] text-[#53627A] mt-0.5 truncate">
                      Hassle-free Process
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: ~52% on desktop with curved left frame (Clean photo without overlapping sentence) */}
            <div className="hidden lg:block lg:col-span-6 xl:col-span-6 relative">
              {/* Curved Asymmetric Image Container matching reference */}
              <div className="relative h-[480px] xl:h-[520px] 2xl:h-[550px] w-full overflow-hidden rounded-tl-[80px] xl:rounded-tl-[120px] rounded-bl-[80px] xl:rounded-bl-[120px] rounded-r-3xl border-[3.5px] border-[#E5B544]/40 shadow-[0_16px_40px_rgba(0,0,0,0.08)] bg-slate-100">
                <img
                  src={familyConsultationImg}
                  alt="Indian family consulting with professional insurance advisor"
                  className="h-full w-full object-cover object-[center_15%] filter contrast-[1.08] saturate-[1.2] brightness-[1.01]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Floating Statistics Panel (Directly matching reference design) */}
      <div className="wrap relative z-30 -mt-6 sm:-mt-8 lg:-mt-10 pb-4">
        <div className="rounded-2xl sm:rounded-3xl border border-[#E5E7EB] bg-white p-5 sm:p-6 lg:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.06)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-[#E5E7EB]/80">
            {/* Stat 1: 20,000+ Happy Customers */}
            <div className="flex items-center gap-3.5 sm:gap-4 lg:px-6 pt-3 sm:pt-0">
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FFF1F2] text-[#F51F2B]">
                <Users size={20} className="sm:size-[22px]" />
              </span>
              <div>
                <b className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight">
                  20,000+
                </b>
                <span className="block text-xs font-semibold text-[#53627A] mt-0.5">
                  Happy Customers
                </span>
              </div>
            </div>

            {/* Stat 2: 50+ Insurance Partners */}
            <div className="flex items-center gap-3.5 sm:gap-4 lg:px-6 pt-3 sm:pt-0">
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#FAF2DE] text-[#E5B544]">
                <ShieldCheck size={20} className="sm:size-[22px]" />
              </span>
              <div>
                <b className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight">
                  50+
                </b>
                <span className="block text-xs font-semibold text-[#53627A] mt-0.5">
                  Insurance Partners
                </span>
              </div>
            </div>

            {/* Stat 3: 98% Claim Settlement Ratio */}
            <div className="flex items-center gap-3.5 sm:gap-4 lg:px-6 pt-3 sm:pt-0">
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F8F5] text-[#10B981]">
                <FileCheck size={20} className="sm:size-[22px]" />
              </span>
              <div>
                <b className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight">
                  98%
                </b>
                <span className="block text-xs font-semibold text-[#53627A] mt-0.5">
                  Claim Settlement Ratio
                </span>
              </div>
            </div>

            {/* Stat 4: 24/7 Customer Support */}
            <div className="flex items-center gap-3.5 sm:gap-4 lg:px-6 pt-3 sm:pt-0">
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6]">
                <Headphones size={20} className="sm:size-[22px]" />
              </span>
              <div>
                <b className="font-display text-xl sm:text-2xl lg:text-3xl font-black text-[#101C38] tracking-tight">
                  24/7
                </b>
                <span className="block text-xs font-semibold text-[#53627A] mt-0.5">
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
    title: 'Life & Family Insurance',
    desc: "Secure your family's future with life insurance and savings plans.",
    path: '/insurance/life-family',
    type: 'Health & Life Insurance',
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
                <div className="flex flex-1 flex-col justify-between pt-9 pb-5 px-4 sm:px-6 text-center">
                  <div>
                    <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#171717] mb-2 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#53627A] leading-relaxed min-h-[44px]">
                      {c.desc}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-6 mt-auto">
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';
import { CATS } from '../data/data';
import familyConsultationImg from '../assets/family-consultation.jpg';
import { Img, Reveal } from './Common';

export const Hero = () => {
  const shouldReduceMotion = useReducedMotion();
  const [regNo, setRegNo] = useState('');
  const [policyType, setPolicyType] = useState('Car Insurance');

  return (
    <section className="relative overflow-hidden bg-[#FFFDF5] border-b border-[#E5E7EB] min-h-[460px] sm:min-h-[490px] lg:min-h-[510px] xl:min-h-[530px] flex items-center">
      {/* 1. Background Image on Right: Proportional Height, Rich Vibrant Color, No Milky Overlay */}
      <div className="absolute inset-y-0 right-0 w-full lg:w-[48%] xl:w-[50%] 2xl:w-[48%] z-0 overflow-hidden">
        <img
          src={familyConsultationImg}
          alt="Family consulting with professional insurance advisor"
          className="h-full w-full object-cover object-[center_top] lg:object-center filter contrast-[1.08] saturate-[1.2] brightness-[1.01]"
        />
        {/* Very subtle, minimal edge transition - lightly reduced white color, crisp & vibrant photo */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-8 lg:w-12 bg-gradient-to-r from-[#FFFDF5]/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Soft Ambient Brand Atmosphere on Left */}
      <div className="pointer-events-none absolute -left-28 top-0 h-[450px] w-[450px] rounded-full bg-[#FAF2DE]/70 blur-3xl -z-10" />
      <div className="pointer-events-none absolute left-1/3 bottom-0 h-[350px] w-[350px] rounded-full bg-[#FFF1F2]/50 blur-3xl -z-10" />

      {/* 3. Mobile Backdrop Gradient (< lg screens, lightly reduced white to preserve image depth) */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#FFFDF5]/85 via-[#FFFDF5]/70 to-[#FFFDF5]/50 z-10 pointer-events-none" />

      {/* 4. Main Hero Content on Left: Moved slightly left to cover empty margin and space gracefully */}
      <div className="wrap relative z-20 py-7 sm:py-9 lg:py-11 w-full">
        <div className="max-w-xl lg:max-w-[490px] xl:max-w-[530px] lg:-ml-2 xl:-ml-4">
          {/* Main Heading: 2 Lines (Line 1: #171717, Line 2: #ED1C24) */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-extrabold tracking-tight flex flex-col gap-1"
          >
            <span className="block text-[#171717] leading-[1.2]">Protect Your Family.</span>
            <span className="block text-[#ED1C24] leading-[1.2]">Secure Every Tomorrow.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-3.5 sm:mt-4 text-xs sm:text-sm lg:text-[14.5px] text-[#5B6472] leading-relaxed max-w-[460px]"
          >
            From protecting your family's health to securing your vehicles and business, we make insurance simple with trusted partners, expert guidance and reliable support.
          </motion.p>

          {/* Quotation / Instant Lead Bar */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-5 sm:mt-6 max-w-[470px] xl:max-w-[490px]"
          >
            <span className="block text-[11px] font-bold text-[#171717] uppercase tracking-wider mb-2">
              Get an instant quotation
            </span>

            <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Field 1: Vehicle / Mobile */}
              <div className="flex-1 px-3.5 py-2.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-[#E5E7EB]">
                <label className="block text-[9.5px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Vehicle No / Mobile
                </label>
                <input
                  type="text"
                  placeholder="e.g. MH 02 CB 1234"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full text-xs font-semibold text-[#171717] placeholder:text-[#9CA3AF] focus:outline-none bg-transparent pt-0.5"
                />
              </div>

              {/* Field 2: Insurance Category Selector */}
              <div className="px-3.5 py-2.5 sm:py-2.5 border-b sm:border-b-0 sm:border-r border-[#E5E7EB] min-w-[130px] sm:min-w-[155px]">
                <label className="block text-[9.5px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Category
                </label>
                <select
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                  className="w-full text-xs font-semibold text-[#171717] focus:outline-none bg-transparent pt-0.5 cursor-pointer"
                >
                  <option value="Car Insurance">Car Insurance</option>
                  <option value="Bike Insurance">Bike Insurance</option>
                  <option value="Commercial Vehicle">Commercial Vehicle</option>
                  <option value="Health & Life Insurance">Health & Life</option>
                </select>
              </div>

              {/* Red CTA Button */}
              <Link
                to={`/contact?type=${encodeURIComponent(policyType)}#quote`}
                className="inline-flex items-center justify-center gap-1.5 bg-[#ED1C24] hover:bg-[#D0171E] text-white font-bold text-xs uppercase tracking-wider px-5 py-3 sm:py-0 transition-colors whitespace-nowrap active:bg-[#B91319]"
              >
                <span>GET A QUOTE</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>

          {/* Secondary Actions & Trust Indicators */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-5 flex flex-wrap items-center gap-3.5 sm:gap-5 pt-0.5"
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 font-bold text-xs text-[#171717] hover:text-[#ED1C24] transition-colors group"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF1F2] text-[#ED1C24] border border-[#ED1C24]/30 transition-transform group-hover:scale-105">
                <PhoneCall size={13} />
              </span>
              <span className="underline underline-offset-4">Talk to an Expert</span>
            </Link>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B6472]">
              <ShieldCheck size={14} className="text-[#ED1C24]" />
              <span>50+ IRDAI Partners</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B6472]">
              <CheckCircle2 size={14} className="text-[#B45309]" />
              <span>100% Cashless Claims</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
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
                <div className="flex flex-1 flex-col justify-between pt-9 pb-5 px-5 sm:px-6 text-center">
                  <div>
                    <h3 className="font-display text-lg sm:text-[19px] font-bold text-[#171717] mb-2 leading-snug">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#5B6472] leading-relaxed min-h-[44px]">
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

import { Link } from 'react-router-dom';
import { ShieldCheck, Users, Award, HeartHandshake, ArrowRight } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="wrap max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
            <ShieldCheck size={14} className="text-[#F51F2B]" />
            <span>About THE BEST INSURANCE POINT</span>
          </div>
          <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight">
            Protecting What Matters Most To You
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-[#53627A] max-w-2xl mx-auto leading-relaxed">
            Your World. Your People. Our Protection. We bring simplicity, honesty, and maximum value to motor, commercial, health, and life insurance across India.
          </p>
        </div>

        {/* Story Card */}
        <div className="card border border-[#E5E7EB] bg-white p-4 sm:p-8 md:p-10 shadow-card mb-8 sm:mb-10">
          <h2 className="font-display text-xl sm:text-2xl font-black text-[#171717] mb-3 sm:mb-4">
            Who We Are
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-[#53627A] leading-relaxed">
            At <b>THE BEST INSURANCE POINT</b>, we believe that buying insurance should not be complicated, confusing, or stressful. Founded with a vision to provide transparent and unbiased financial security, we partner with over 50 leading IRDAI-registered insurance providers in India to deliver competitive premiums and customized coverage.
          </p>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-[#53627A] leading-relaxed">
            Whether you need comprehensive vehicle protection for your family car, affordable two-wheeler insurance, fleet coverage for commercial vehicles, or complete health and life protection, our team of seasoned advisors is here to guide you every step of the way.
          </p>
        </div>

        {/* 4 Pillars */}
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-10 sm:mb-12">
          {[
            [HeartHandshake, '100% Unbiased Advice', 'We work for your best interest, comparing policies across multiple top insurers.'],
            [Award, 'Fast Claim Support', 'From documentation to surveyor coordination, we stand by your side until your claim is settled.'],
            [Users, '25,000+ Happy Clients', 'Trusted by individual motorists, families, transport operators, and corporate fleets.'],
            [ShieldCheck, 'IRDAI Compliant Insurers', 'All policies are underwritten exclusively by recognized, licensed Indian insurance companies.'],
          ].map(([Icon, title, desc]) => (
            <div
              key={title}
              className="card border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs hover:border-[#E5B544] transition-all"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF2DE] text-[#171717] mb-4">
                <Icon size={24} className="text-[#F51F2B]" />
              </span>
              <h3 className="font-display text-base font-bold text-[#171717]">{title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-[#53627A] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="rounded-3xl border border-[#E5B544]/60 bg-[#FAF2DE] p-6 sm:p-8 text-center shadow-xs">
          <h3 className="font-display text-xl sm:text-2xl font-black text-[#171717]">
            Ready to find the right insurance plan?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-[#53627A] max-w-lg mx-auto">
            Get personalized quotes in minutes with zero obligation and 100% free claim assistance.
          </p>
          <div className="mt-6 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center justify-center gap-3 sm:gap-4">
            <Link to="/contact#quote" className="btn-gold text-xs sm:text-sm font-bold shadow-xs justify-center">
              <span>Request Free Quote</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-outline text-xs sm:text-sm font-semibold justify-center">
              Contact Our Office
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Phone, Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import QuoteForm from '../components/QuoteForm';
import { PHONE, EMAIL, ADDRESS } from '../data/data';

export default function ContactUs() {
  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="wrap">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
            <Sparkles size={14} className="text-[#F51F2B]" />
            <span>We Are Here For You</span>
          </div>
          <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight">
            Get In Touch With Our Experts
          </h1>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#53627A] leading-relaxed">
            Have questions about a policy, renewal, or claim? Our dedicated advisors are ready to assist you.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Contact Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="card border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-xs hover:border-[#E5B544] transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#171717] mb-3">
                <Phone size={20} className="text-[#F51F2B]" />
              </span>
              <b className="block text-sm font-bold text-[#171717]">Phone & Helpline</b>
              <p className="text-xs text-[#53627A] mt-0.5">Mon - Sat from 9am to 8pm</p>
              <a
                href={`tel:${PHONE.replace(/\s+/g, '')}`}
                className="mt-3 inline-block font-display text-base font-bold text-[#171717] hover:text-[#F51F2B]"
              >
                {PHONE}
              </a>
            </div>

            <div className="card border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-xs hover:border-[#E5B544] transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#171717] mb-3">
                <Mail size={20} className="text-[#F51F2B]" />
              </span>
              <b className="block text-sm font-bold text-[#171717]">Email Inquiries</b>
              <p className="text-xs text-[#53627A] mt-0.5">We typically respond within 2 hours</p>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-3 inline-block font-display text-sm font-bold text-[#171717] hover:text-[#F51F2B] break-all"
              >
                {EMAIL}
              </a>
            </div>

            <div className="card border border-[#E5E7EB] bg-white p-4 sm:p-6 shadow-xs hover:border-[#E5B544] transition-all">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#171717] mb-3">
                <MapPin size={20} className="text-[#F51F2B]" />
              </span>
              <b className="block text-sm font-bold text-[#171717]">Registered Office</b>
              <p className="mt-2 text-xs sm:text-sm text-[#53627A] leading-relaxed">
                {ADDRESS}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F8FA] p-4 sm:p-5 text-xs text-[#53627A] flex items-start gap-2.5">
              <Clock size={16} className="shrink-0 text-[#A7ADB4] mt-0.5" />
              <span>
                <b>Operating Hours:</b> Monday through Saturday: 9:00 AM – 8:00 PM. Emergency claims intimation line is active 24/7.
              </span>
            </div>
          </div>

          {/* Right Column: Quote Form */}
          <div className="lg:col-span-2">
            <QuoteForm />
          </div>
        </div>
      </div>
    </div>
  );
}

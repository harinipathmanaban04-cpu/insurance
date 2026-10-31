import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';
import { CATS, PAGES, PHONE } from '../data/data';
import { Img, FAQ, Reveal } from '../components/Common';
import QuoteForm from '../components/QuoteForm';

export default function InsurancePage({ id }) {
  const c = CATS.find((x) => x.id === id);
  const p = PAGES[id];
  const Icon = c.icon;

  return (
    <>
      {/* Category Hero Section */}
      <section className="relative overflow-hidden bg-white py-12 sm:py-16 border-b border-[#E5E7EB]">
        <div className="wrap grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FAF2DE] px-3.5 py-1.5 text-xs font-bold text-[#171717] shadow-xs">
              <Icon size={15} className="text-[#E31B23]" />
              <span>{c.title} Solutions</span>
            </div>

            <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight leading-tight">
              {p.hero}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-[#5B6472] leading-relaxed">
              {p.lead}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={`/contact?type=${encodeURIComponent(c.type)}#quote`}
                className="btn-gold text-sm sm:text-base px-6 py-3 font-bold shadow-xs"
              >
                <span>Get a Free {c.title.replace(' Vehicle', '')} Quote</span>
                <ArrowRight size={17} />
              </Link>

              <a
                href={`tel:${PHONE.replace(/\s+/g, '')}`}
                className="btn-outline text-sm sm:text-base px-5 py-3 font-semibold"
              >
                <PhoneCall size={16} className="text-[#E31B23]" />
                <span>Call Advisor</span>
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs sm:text-sm text-[#5B6472]">
              <span className="flex items-center gap-1.5 font-semibold text-[#171717]">
                <CheckCircle2 size={16} className="text-[#E31B23]" />
                Instant Issuance
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#171717]">
                <CheckCircle2 size={16} className="text-[#E31B23]" />
                Cashless Garages
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#171717]">
                <CheckCircle2 size={16} className="text-[#E31B23]" />
                Zero Paperwork
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-card">
              <Img
                src={c.img}
                alt={c.title}
                className="h-72 sm:h-96 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature & Benefit Blocks */}
      {p.blocks.map((b, i) => (
        <section key={b.h} className={i % 2 ? 'bg-[#F7F8FA]' : 'bg-white'}>
          <div className="wrap py-14 sm:py-16">
            <div className="mx-auto max-w-2xl text-center mb-10">
              {b.label && (
                <span className="inline-block rounded-full bg-[#FAF2DE] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#DFB24A]/50 mb-2">
                  {b.label}
                </span>
              )}
              <h2 className="h2">{b.h}</h2>
              <p className="mt-2 text-sm text-[#5B6472]">
                Customizable options designed for maximum safety and savings.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {b.cards.map(([title, desc]) => (
                <Reveal key={title}>
                  <div className="card h-full border border-[#E5E7EB] bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-[#DFB24A]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#171717] mb-4">
                      <ShieldCheck size={22} className="text-[#E31B23]" />
                    </span>
                    <h3 className="font-display text-base font-bold text-[#171717]">{title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#5B6472] leading-relaxed">
                      {desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* FAQs & Instant Quote Form Section */}
      <section className="wrap grid gap-10 py-14 sm:py-16 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="mb-6">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#E31B23]">
              <span>Got Questions?</span>
            </span>
            <h2 className="h2 mt-1">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-[#5B6472]">
              Common questions about {c.title.toLowerCase()}, cover limits, and claims.
            </p>
          </div>
          <FAQ items={p.faqs} />
        </div>

        <div>
          <QuoteForm defaultType={c.type} />
        </div>
      </section>
    </>
  );
}

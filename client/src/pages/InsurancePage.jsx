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
      <section className="relative overflow-hidden bg-white py-9 sm:py-12 border-b border-[#E5E7EB]">
        <div className="wrap grid items-center gap-8 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-[#FAF2DE] px-3 py-1 text-xs font-bold text-[#101C38] shadow-xs">
              <Icon size={14} className="text-[#F51F2B]" />
              <span>{c.title} Solutions</span>
            </div>

            <h1 className="mt-3.5 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#101C38] tracking-tight leading-tight">
              {p.hero}
            </h1>

            <p className="mt-3 text-sm sm:text-[15px] text-[#53627A] leading-relaxed">
              {p.lead}
            </p>

            <div className="mt-6 flex flex-col min-[480px]:flex-row items-stretch min-[480px]:items-center gap-3">
              <Link
                to={`/contact?type=${encodeURIComponent(c.type)}#quote`}
                className="btn-gold text-xs sm:text-sm px-5 py-2.5 sm:py-3 font-bold shadow-xs justify-center text-center w-full min-[480px]:w-auto"
              >
                <span>Get a Free {c.title.replace(' Vehicle', '')} Quote</span>
                <ArrowRight size={15} />
              </Link>

              <a
                href={`tel:${PHONE.replace(/\s+/g, '')}`}
                className="btn-outline text-xs sm:text-sm px-4.5 py-2.5 sm:py-3 font-semibold justify-center text-center w-full min-[480px]:w-auto"
              >
                <PhoneCall size={15} className="text-[#F51F2B]" />
                <span>Call Advisor</span>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs sm:text-sm text-[#53627A]">
              <span className="flex items-center gap-1.5 font-semibold text-[#101C38]">
                <CheckCircle2 size={15} className="text-[#F51F2B]" />
                Instant Insurance
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#101C38]">
                <CheckCircle2 size={15} className="text-[#F51F2B]" />
                Cashless Garages
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#101C38]">
                <CheckCircle2 size={15} className="text-[#F51F2B]" />
                Zero Paperwork
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white p-2 shadow-card">
              <Img
                src={c.img}
                alt={c.title}
                className="h-56 sm:h-64 lg:h-[280px] w-full rounded-2xl object-cover"
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
                <span className="inline-block rounded-full bg-[#FAF2DE] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#101C38] border border-[#E5B544]/50 mb-2">
                  {b.label}
                </span>
              )}
              <h2 className="h2">{b.h}</h2>
              <p className="mt-2 text-sm text-[#53627A]">
                Customizable options designed for maximum safety and savings.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {b.cards.map(([title, desc]) => (
                <Reveal key={title}>
                  <div className="card h-full border border-[#E5E7EB] bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-[#E5B544]">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#101C38] mb-4">
                      <ShieldCheck size={22} className="text-[#F51F2B]" />
                    </span>
                    <h3 className="font-display text-base font-bold text-[#101C38]">{title}</h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#53627A] leading-relaxed">
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
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#F51F2B]">
              <span>Got Questions?</span>
            </span>
            <h2 className="h2 mt-1">Frequently Asked Questions</h2>
            <p className="mt-2 text-sm text-[#53627A]">
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

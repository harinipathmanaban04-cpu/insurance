import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, CheckCircle2, ArrowRight } from 'lucide-react';
import { FAQ } from '../components/Common';
import { PHONE } from '../data/data';

const steps = [
  {
    title: 'Inform Us or Your Insurer Immediately',
    desc: 'Report the incident as soon as possible via our helpline or your insurer’s toll-free number.',
  },
  {
    title: 'Collect Necessary Documents & Evidence',
    desc: 'Keep photos of the damage, vehicle RC, driving license, policy document, and police FIR (if applicable).',
  },
  {
    title: 'Submit the Claim Intimation',
    desc: 'Our dedicated claims desk assists you in filling out the intimation form without mistakes.',
  },
  {
    title: 'Surveyor Inspection & Workshop Approval',
    desc: 'The insurance surveyor assesses the damage at an authorized network cashless garage or hospital.',
  },
  {
    title: 'Cashless Settlement or Direct Reimbursement',
    desc: 'Your approved claim is settled directly with the network garage or reimbursed into your bank account.',
  },
];

const faqs = [
  [
    'Do you settle claims directly?',
    'Claims are legally settled and paid by the respective insurance provider. THE BEST INSURANCE COMPANY provides dedicated claims advocacy and step-by-step assistance to ensure your claim is processed quickly and fairly.',
  ],
  [
    'What is a cashless claim?',
    'With a cashless claim, you take your vehicle to a network garage (or visit a network hospital), and the insurer settles the approved repair bill directly with the garage, minus applicable deductibles.',
  ],
  [
    'How long does claim settlement typically take?',
    'For cashless motor repairs, surveyor approvals are typically completed in 24–48 hours. Reimbursement claims are usually settled within 7 to 15 working days after all documents are verified.',
  ],
  [
    'What documents are needed for vehicle accident claims?',
    'You will need your original claim form, copy of the insurance policy, vehicle Registration Certificate (RC), driver’s driving license, repair estimate from the workshop, and an FIR copy for major or third-party damage.',
  ],
];

export default function ClaimsAssistance() {
  return (
    <div className="py-12 sm:py-16 bg-white">
      <div className="wrap max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF2DE] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#171717] border border-[#E5B544]/50 mb-3">
            <ShieldCheck size={14} className="text-[#F51F2B]" />
            <span>24/7 Claim Support Desk</span>
          </div>
          <h1 className="font-display text-2xl min-[360px]:text-3xl sm:text-4xl lg:text-5xl font-black text-[#171717] tracking-tight">
            Stress-Free Claim Assistance
          </h1>
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-[#53627A] max-w-2xl mx-auto">
            When accidents or emergencies happen, you don't have to navigate insurance paperwork alone. We stay with you at every step.
          </p>
        </div>

        {/* Emergency Helpline Banner */}
        <div className="card border border-[#E5B544]/60 bg-[#FAF2DE] p-4 sm:p-6 md:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E5B544] text-[#171717] shadow-xs">
              <Phone size={22} className="text-[#171717]" />
            </span>
            <div>
              <b className="block text-sm sm:text-base font-bold text-[#171717]">
                Need Immediate Claim Assistance?
              </b>
              <span className="text-xs sm:text-sm text-[#53627A]">
                Call our direct claim helpline for fast intimation support.
              </span>
            </div>
          </div>
          <a
            href={`tel:${PHONE.replace(/\s+/g, '')}`}
            className="btn-gold text-xs sm:text-sm font-bold shadow-xs shrink-0 w-full sm:w-auto text-center justify-center"
          >
            <span>Call {PHONE}</span>
          </a>
        </div>

        {/* Steps List */}
        <div className="mb-14">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#171717] mb-6">
            5 Simple Steps to Settle Your Claim
          </h2>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="card flex items-start gap-3.5 sm:gap-4 border border-[#E5E7EB] bg-white p-4 sm:p-5 shadow-xs hover:border-[#E5B544] transition-all"
              >
                <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-[#171717] font-display text-xs sm:text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <b className="block text-sm sm:text-base font-bold text-[#171717]">
                    {s.title}
                  </b>
                  <p className="mt-1 text-xs sm:text-sm text-[#53627A] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div id="faq" className="scroll-mt-24 mb-12">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#171717] mb-6">
            Frequently Asked Claim Questions
          </h2>
          <FAQ items={faqs} />
        </div>

        {/* Footer Contact */}
        <div className="text-center border-t border-[#E5E7EB] pt-8">
          <p className="text-xs sm:text-sm text-[#53627A] mb-4">
            Have questions regarding an active claim or endorsement?
          </p>
          <Link to="/contact" className="btn-gold inline-flex items-center gap-2 font-bold text-xs sm:text-sm">
            <span>Contact Claims Desk</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

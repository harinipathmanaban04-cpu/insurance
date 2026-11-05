import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Car,
  Bike,
  Truck,
  HeartPulse,
  Users,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Printer,
  Sparkles,
  PhoneCall,
  Loader2,
  Lock,
} from 'lucide-react';
import { CATEGORIES } from './constants';
import CategoryFields from './CategoryFields';
import MobileOtpVerification from './MobileOtpVerification';
import { PHONE } from '../../data/data';

const ICONS = {
  car: Car,
  bike: Bike,
  commercial: Truck,
  'health-life': Users,
  health: HeartPulse,
  life: Users,
};

export default function InsuranceApplicationSystem({ initialCategory = 'car' }) {
  const [searchParams] = useSearchParams();

  // Normalize initial category from URL or prop
  const resolveCategory = (val) => {
    if (!val) return 'car';
    const s = val.toLowerCase();
    if (s.includes('bike') || s.includes('two')) return 'bike';
    if (s.includes('comm') || s.includes('truck')) return 'commercial';
    if (s.includes('health') || s.includes('life')) return 'health-life';
    return 'car';
  };

  const [category, setCategory] = useState(() =>
    resolveCategory(searchParams.get('type') || searchParams.get('cat') || initialCategory)
  );

  // Synchronize category if URL or prop changes
  useEffect(() => {
    const urlType = searchParams.get('type') || searchParams.get('cat');
    if (urlType) {
      setCategory(resolveCategory(urlType));
    } else if (initialCategory) {
      setCategory(resolveCategory(initialCategory));
    }
  }, [searchParams, initialCategory]);

  // Current wizard step: 1 (Category Details) -> 2 (Customer Info) -> 3 (OTP Verification) -> 4 (Success)
  const [step, setStep] = useState(1);

  // Common customer details (collected in Step 2)
  const [customer, setCustomer] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
  });

  // Category specific details (collected in Step 1)
  const [details, setDetails] = useState({});

  // Mobile verification state (handled in Step 3)
  const [verification, setVerification] = useState({
    verified: false,
    proof: null,
    verifiedMobile: '',
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle Category Switching
  const handleSelectCategory = (catId) => {
    if (step > 1 && !window.confirm('Switching categories will reset your application progress. Continue?')) {
      return;
    }
    setCategory(catId);
    setDetails({});
    setStep(1);
    setErrors({});
  };

  // Validate Step 1 (Category Specific Fields)
  const validateStep1 = () => {
    const errs = {};

    if (category === 'car' || category === 'bike' || category === 'commercial') {
      if (!details.regNumber || !details.regNumber.trim()) {
        errs.regNumber = 'Vehicle registration number is required (or enter "NEW").';
      }
      if (!details.manufacturer) {
        errs.manufacturer = 'Please select the manufacturer.';
      }
      if (!details.model || !details.model.trim()) {
        errs.model = 'Please select or enter the vehicle model.';
      }
      if (!details.mfgYear) {
        errs.mfgYear = 'Please select the manufacturing year.';
      }
    }

    if (category === 'commercial') {
      if (!details.vehicleCategory) {
        errs.vehicleCategory = 'Please select the commercial vehicle category.';
      }
      if (!details.gvwOrCapacity || !details.gvwOrCapacity.trim()) {
        errs.gvwOrCapacity = 'Gross Vehicle Weight (GVW) or seating capacity is required.';
      }
    }

    if (category === 'health-life' || category === 'health' || category === 'life') {
      if (!details.dob) {
        errs.dob = 'Primary insured date of birth is required.';
      }
      if (!details.cityPincode || !details.cityPincode.trim()) {
        errs.cityPincode = 'City & Pincode are required.';
      }
      if (!details.annualIncome) {
        errs.annualIncome = 'Please select your annual income range.';
      }
      if (!details.occupation) {
        errs.occupation = 'Please select your occupation type.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Step 2 (Common Customer Details)
  const validateStep2 = () => {
    const errs = {};

    if (!customer.name || !customer.name.trim()) {
      errs.name = 'Full name is required as per official ID.';
    }

    const cleanMobile = (customer.mobile || '').replace(/\D/g, '').slice(-10);
    if (!cleanMobile) {
      errs.mobile = 'Mobile number is required for OTP verification.';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (!customer.email || !customer.email.trim()) {
      errs.email = 'Email address is required for policy quotation delivery.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!customer.city || !customer.city.trim()) {
      errs.city = 'City / Location is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Update Customer details and clear field error on typing
  const updateCustomer = (field, val) => {
    setCustomer((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Advance to Next Step
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        // Pre-fill customer name in step 2 if entered in health/life
        if ((category === 'health' || category === 'life') && details.applicantName && !customer.name) {
          setCustomer((c) => ({ ...c, name: details.applicantName }));
        }
        setStep(2);
        setErrors({});
      }
    } else if (step === 2) {
      if (validateStep2()) {
        // If mobile changed, reset verification
        const cleanMobile = customer.mobile.replace(/\D/g, '').slice(-10);
        if (verification.verifiedMobile !== cleanMobile) {
          setVerification({ verified: false, proof: null, verifiedMobile: '' });
        }
        setStep(3);
        setErrors({});
      }
    }
  };

  // Final Submission to Serverless Endpoint
  const handleSubmitFinal = async () => {
    if (!verification.verified || !verification.proof) {
      setErrors({ otp: 'Please complete real mobile OTP verification before submitting.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/enquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          customer: {
            ...customer,
            mobile: customer.mobile.replace(/\D/g, '').slice(-10),
          },
          details,
          verificationProof: verification.proof,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult(data);
        setStep(4);
      } else {
        setErrors({ submit: data.error || 'Submission failed. Please try again or call our advisor.' });
      }
    } catch {
      setErrors({ submit: 'Unable to connect to submission server. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const ActiveIcon = ICONS[category] || Car;

  // Print Receipt handler
  const handlePrint = () => {
    window.print();
  };

  // Reset for Another Application
  const handleReset = () => {
    setStep(1);
    setCustomer({ name: '', mobile: '', email: '', city: '' });
    setDetails({});
    setVerification({ verified: false, proof: null, verifiedMobile: '' });
    setSubmissionResult(null);
    setErrors({});
  };

  return (
    <div id="quote" className="card border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-card max-w-4xl mx-auto">
      {/* Category Header Banner (Always visible except in Step 4) */}
      {step < 4 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2 pb-3 border-b border-[#E5E7EB]">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F51F2B]">
                <Sparkles size={13} />
                <span>Instant IRDAI Comparative Quotes</span>
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-[#101C38] tracking-tight mt-0.5">
                {activeCategoryObj.title} Application
              </h3>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAF2DE] text-[#101C38] border border-[#E5B544]/60">
              {activeCategoryObj.badge}
            </span>
          </div>
        </div>
      )}

      {/* Policybazaar-style Wizard Progress Bar */}
      {step < 4 && (
        <div className="mb-6 border-y border-[#E5E7EB] py-3.5">
          <div className="flex items-center justify-between max-w-xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 1
                    ? 'bg-[#E5B544] text-[#101C38] shadow-xs'
                    : step > 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > 1 ? <CheckCircle2 size={16} /> : '1'}
              </span>
              <span className={`text-xs font-bold ${step === 1 ? 'text-[#101C38]' : 'text-slate-500'}`}>
                {activeCategoryObj.id === 'health-life' ? 'Health + Life' : activeCategoryObj.title.split(' ')[0]} Details
              </span>
            </div>

            <div className={`h-0.5 flex-1 mx-3 ${step > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 2
                    ? 'bg-[#E5B544] text-[#101C38] shadow-xs'
                    : step > 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > 2 ? <CheckCircle2 size={16} /> : '2'}
              </span>
              <span className={`text-xs font-bold ${step === 2 ? 'text-[#101C38]' : 'text-slate-500'}`}>
                Customer Info
              </span>
            </div>

            <div className={`h-0.5 flex-1 mx-3 ${step > 2 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 3
                    ? 'bg-[#F51F2B] text-white shadow-xs animate-pulse'
                    : verification.verified
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {verification.verified ? <CheckCircle2 size={16} /> : <Lock size={13} />}
              </span>
              <span className={`text-xs font-bold ${step === 3 ? 'text-[#F51F2B]' : 'text-slate-500'}`}>
                Mobile OTP
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: CATEGORY SPECIFIC FIELDS */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-2.5 pb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF2DE] text-[#F51F2B]">
              <ActiveIcon size={16} />
            </span>
            <div>
              <h4 className="font-display text-sm sm:text-base font-bold text-[#101C38]">
                Step 1: Enter {activeCategoryObj.title} Specifications
              </h4>
              <p className="text-xs text-[#53627A]">
                Provide your details below to generate quotes with maximum No-Claim Bonus and discounts.
              </p>
            </div>
          </div>

          <CategoryFields
            category={category}
            details={details}
            onChange={(newDetails) => {
              setDetails(newDetails);
              if (Object.keys(errors).length > 0) {
                setErrors((prev) => {
                  const next = { ...prev };
                  Object.keys(newDetails).forEach((k) => {
                    if (newDetails[k] && next[k]) delete next[k];
                  });
                  return next;
                });
              }
            }}
            errors={errors}
          />

          <div className="flex items-center justify-end pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={handleNext}
              className="btn-gold !px-6 !py-3 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Continue to Customer Info</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: COMMON CUSTOMER DETAILS */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center gap-2.5 pb-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF2DE] text-[#F51F2B]">
              <Users size={16} />
            </span>
            <div>
              <h4 className="font-display text-sm sm:text-base font-bold text-[#101C38]">
                Step 2: Applicant Contact Information
              </h4>
              <p className="text-xs text-[#53627A]">
                Where should we send your policy quotes and insurance documentation?
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold text-[#101C38] mb-1">
                Full Name as per Official ID *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={customer.name}
                onChange={(e) => updateCustomer('name', e.target.value)}
                className={`inp ${errors.name ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.name && <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">{errors.name}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101C38] mb-1">
                Mobile Number (for SMS OTP) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 select-none">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={customer.mobile}
                  onChange={(e) => updateCustomer('mobile', e.target.value.replace(/\D/g, ''))}
                  className={`inp pl-11 tracking-wider font-semibold ${errors.mobile ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
                />
              </div>
              {errors.mobile && <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">{errors.mobile}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101C38] mb-1">
                Email Address (for Quotations & Policy PDF) *
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={customer.email}
                onChange={(e) => updateCustomer('email', e.target.value)}
                className={`inp ${errors.email ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.email && <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">{errors.email}</span>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#101C38] mb-1">
                City / Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Paramakudi, Madurai, Chennai"
                value={customer.city}
                onChange={(e) => updateCustomer('city', e.target.value)}
                className={`inp ${errors.city ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.city && <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">{errors.city}</span>}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#101C38]"
            >
              <ArrowLeft size={15} />
              <span>Back to Details</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="btn-gold !px-6 !py-3 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <span>Verify Mobile Number</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REAL MOBILE OTP VERIFICATION */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-in">
          <MobileOtpVerification
            mobile={customer.mobile}
            onMobileChange={(newMobile) => setCustomer((c) => ({ ...c, mobile: newMobile }))}
            isVerified={verification.verified}
            verifiedProof={verification.proof}
            onVerified={({ verified, proof, mobile }) => {
              setVerification({ verified, proof, verifiedMobile: mobile });
            }}
          />

          {/* Error Banner */}
          {errors.submit && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-[#F51F2B] font-semibold">
              {errors.submit}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#101C38]"
            >
              <ArrowLeft size={15} />
              <span>Back to Contact Info</span>
            </button>

            <button
              type="button"
              onClick={handleSubmitFinal}
              disabled={!verification.verified || isSubmitting}
              className={`btn-gold !px-7 !py-3 text-xs sm:text-sm font-bold flex items-center gap-2 ${
                !verification.verified ? 'opacity-50 cursor-not-allowed' : 'shadow-md'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#171717]" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Submit Verified Application</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: APPLICATION CONFIRMATION & RECEIPT */}
      {step === 4 && submissionResult && (
        <div className="space-y-6 text-center animate-fade-in py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-8 ring-emerald-100">
            <CheckCircle2 size={36} />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck size={14} />
              <span>Application Verified & Registered</span>
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#101C38] tracking-tight">
              Thank You, {customer.name}!
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#53627A] max-w-lg mx-auto">
              Your <b>{activeCategoryObj.title}</b> application has been successfully verified and sent to our certified insurance underwriting specialists.
            </p>
          </div>

          {/* Application Receipt Card */}
          <div className="rounded-2xl border-2 border-[#E5B544] bg-[#FAF2DE]/20 p-5 sm:p-6 text-left max-w-lg mx-auto shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5B544]/30 pb-3 mb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Unique Application ID
                </span>
                <b className="block font-display text-lg font-black text-[#101C38] tracking-wide">
                  {submissionResult.applicationId}
                </b>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                <CheckCircle2 size={12} />
                <span>Mobile Verified</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Applicant:</span>
                <b className="text-[#101C38]">{customer.name}</b>
              </div>
              <div>
                <span className="text-slate-500 block">Verified Mobile:</span>
                <b className="text-[#101C38]">+91 {customer.mobile}</b>
              </div>
              <div>
                <span className="text-slate-500 block">Category:</span>
                <b className="text-[#101C38]">{activeCategoryObj.title}</b>
              </div>
              <div>
                <span className="text-slate-500 block">City:</span>
                <b className="text-[#101C38]">{customer.city}</b>
              </div>
              {details.regNumber && (
                <div>
                  <span className="text-slate-500 block">Vehicle Reg No:</span>
                  <b className="text-[#101C38] uppercase">{details.regNumber}</b>
                </div>
              )}
              {details.model && (
                <div>
                  <span className="text-slate-500 block">Make & Model:</span>
                  <b className="text-[#101C38]">{details.manufacturer} {details.model}</b>
                </div>
              )}
              {details.sumInsured && (
                <div className="col-span-2">
                  <span className="text-slate-500 block">Sum Insured:</span>
                  <b className="text-[#101C38]">{details.sumInsured}</b>
                </div>
              )}
              {details.sumAssured && (
                <div className="col-span-2">
                  <span className="text-slate-500 block">Life Cover:</span>
                  <b className="text-[#101C38]">{details.sumAssured} ({details.policyDuration})</b>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E5B544]/30 flex items-center justify-between text-[11px] text-slate-500">
              <span>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="font-semibold text-emerald-700">Status: Under Review</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="max-w-md mx-auto rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-600 space-y-1.5">
            <b className="text-[#101C38] block mb-1">What Happens Next?</b>
            <p>1. Our underwriting team compares rates across 50+ IRDAI approved insurance partners.</p>
            <p>2. A dedicated advisor will call you at <b>+91 {customer.mobile}</b> within 2 hours with customized quotes.</p>
            <p>3. Instant policy issuance with cashless garage / hospital benefits.</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="btn-outline !py-2.5 !px-5 text-xs sm:text-sm font-bold flex items-center gap-2"
            >
              <Printer size={16} />
              <span>Print Application Receipt</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-gold !py-2.5 !px-5 text-xs sm:text-sm font-bold"
            >
              <span>Submit Another Application</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

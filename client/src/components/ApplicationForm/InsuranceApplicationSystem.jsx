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
  PhoneCall,
  Loader2,
  Lock,
  Edit2,
  AlertCircle,
} from 'lucide-react';
import { CATEGORIES } from './constants';
import CategoryFields from './CategoryFields';
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

  // Current wizard step: 1 (Specifications & Details) -> 2 (Contact Information & Submit) -> 3 (Confirmation)
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

  // Validate Step 2 (Customer Details)
  const validateStep2 = () => {
    const errs = {};

    if (!customer.name || !customer.name.trim() || customer.name.trim().length < 2) {
      errs.name = 'Full name is required as per official ID (at least 2 characters).';
    }

    const cleanMobile = (customer.mobile || '').replace(/\D/g, '').slice(-10);
    if (!cleanMobile) {
      errs.mobile = 'Mobile number is required to receive quotation details.';
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

  // Advance from Step 1 to Step 2
  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) {
        // Pre-fill customer city from health/life cityPincode if available
        if (details.cityPincode && !customer.city) {
          setCustomer((c) => ({ ...c, city: details.cityPincode.split('-')[0].trim() }));
        }
        setStep(2);
        setErrors({});
        // Scroll to form top smoothly
        const el = document.getElementById('quote');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Direct Submission from Step 2 without OTP
  const handleSubmitFinal = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const cleanMobile = customer.mobile.replace(/\D/g, '').slice(-10);
      const res = await fetch('/api/enquiries/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          name: customer.name.trim(),
          mobile: cleanMobile,
          email: customer.email.trim(),
          city: customer.city.trim(),
          customer: {
            ...customer,
            name: customer.name.trim(),
            mobile: cleanMobile,
            email: customer.email.trim(),
            city: customer.city.trim(),
          },
          details,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissionResult(data);
        setStep(3);
        const el = document.getElementById('quote');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        setErrors({ submit: data.error || data.message || 'Submission failed. Please try again or call our advisor.' });
      }
    } catch {
      setErrors({ submit: 'Unable to connect to submission server. Please try again or call our helpline.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === category) || CATEGORIES[0];
  const ActiveIcon = ICONS[category] || Car;

  // Reset for Another Application
  const handleReset = () => {
    setStep(1);
    setCustomer({ name: '', mobile: '', email: '', city: '' });
    setDetails({});
    setSubmissionResult(null);
    setErrors({});
  };

  return (
    <div id="quote" className="card border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-white p-3.5 min-[360px]:p-4 sm:p-6 md:p-7 shadow-card max-w-4xl mx-auto transition-all">
      {/* 1. Category Header (Visible in Steps 1 & 2) */}
      {step < 3 && (
        <div className="mb-5 sm:mb-6">
          {/* Header Title with Badge */}
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E5B544]/25">
            <h3 className="font-display text-lg min-[360px]:text-xl sm:text-2xl font-black text-[#101C38] tracking-tight">
              {activeCategoryObj.title} Application
            </h3>
            <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-[#FAF2DE] text-[#101C38] border border-[#E5B544]/50 shrink-0">
              {activeCategoryObj.badge}
            </span>
          </div>
        </div>
      )}

      {/* 2. Compact 2-Step Progress Indicator */}
      {step < 3 && (
        <div className="mb-5 sm:mb-6 rounded-xl bg-slate-50/80 border border-[#E5E7EB] px-3 sm:px-4 py-2.5 sm:py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => step > 1 && setStep(1)}
              className={`flex items-center gap-1.5 sm:gap-2 text-left min-w-0 transition-opacity ${
                step > 1 ? 'cursor-pointer opacity-70 hover:opacity-100' : 'cursor-default opacity-100'
              }`}
            >
              <span
                className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold ${
                  step === 1
                    ? 'bg-[#E5B544] text-[#101C38] ring-2 ring-[#E5B544]/30'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {step > 1 ? <CheckCircle2 size={13} /> : '1'}
              </span>
              <span className={`text-[11px] sm:text-xs font-bold truncate ${step === 1 ? 'text-[#101C38]' : 'text-slate-600'}`}>
                {category === 'health-life' ? 'Plan Coverage' : (
                  <>
                    <span className="hidden min-[380px]:inline">Vehicle </span>Details
                  </>
                )}
              </span>
            </button>

            {/* Connecting Divider */}
            <div className={`h-0.5 flex-1 mx-2 sm:mx-3 ${step > 1 ? 'bg-emerald-500' : 'bg-slate-200'}`} />

            {/* Step 2 Pill */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span
                className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-[11px] font-bold ${
                  step === 2
                    ? 'bg-[#E5B544] text-[#101C38] ring-2 ring-[#E5B544]/30'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                2
              </span>
              <span className={`text-[11px] sm:text-xs font-bold truncate ${step === 2 ? 'text-[#101C38]' : 'text-slate-400'}`}>
                <span className="hidden min-[380px]:inline">Contact & </span>Submit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 1: SPECIFICATIONS & COVERAGE DETAILS                      */}
      {/* ------------------------------------------------------------- */}
      {step === 1 && (
        <div className="space-y-4 sm:space-y-5 animate-fade-in">
          <CategoryFields
            category={category}
            details={details}
            onChange={(updater) => {
              setDetails((prev) => {
                const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
                if (Object.keys(errors).length > 0) {
                  setErrors((errPrev) => {
                    const nextErr = { ...errPrev };
                    Object.keys(next).forEach((k) => {
                      if (next[k] && nextErr[k]) delete nextErr[k];
                    });
                    return nextErr;
                  });
                }
                return next;
              });
            }}
            errors={errors}
          />

          <div className="flex items-center justify-end pt-3 sm:pt-4 border-t border-[#E5B544]/25">
            <button
              type="button"
              onClick={handleNext}
              className="btn-gold w-full sm:w-auto justify-center !px-6 !py-2.5 sm:!py-3 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs"
            >
              <span>Continue to Contact Details</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 2: CONTACT INFORMATION & DIRECT SUBMIT (NO OTP)          */}
      {/* ------------------------------------------------------------- */}
      {step === 2 && (
        <form onSubmit={handleSubmitFinal} className="space-y-4 sm:space-y-5 animate-fade-in">
          {/* Quick Summary Pill of Step 1 */}
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#FAF2DE]/50 border border-[#E5B544]/30 p-2.5 sm:p-3 sm:px-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#101C38] border border-[#E5B544]/40 shrink-0">
                <ActiveIcon size={14} className="text-[#F51F2B]" />
              </span>
              <div className="min-w-0 text-xs">
                <span className="font-bold text-[#101C38] block truncate">
                  {details.manufacturer
                    ? `${details.mfgYear || ''} ${details.manufacturer} ${details.model || ''}`.trim()
                    : activeCategoryObj.title}
                </span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {details.regNumber
                    ? `Reg: ${details.regNumber} • ${details.insuranceType || 'Comprehensive'}`
                    : details.sumInsured
                    ? `${details.sumInsured} • ${details.planType || 'Family Floater'}`
                    : 'Specifications configured in Step 1'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#101C38] hover:text-[#F51F2B] shrink-0 ml-1 py-1 px-2 rounded-md hover:bg-white transition-colors"
            >
              <Edit2 size={12} />
              <span>Edit</span>
            </button>
          </div>

          {/* Section: Applicant Contact Details */}
          <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-3.5 sm:p-5 transition-colors">
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#E5B544]/25 mb-3.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF2DE] text-[#101C38] shrink-0 border border-[#E5B544]/30">
                <Users size={14} className="text-[#F51F2B]" />
              </span>
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#101C38] leading-tight">
                  Applicant Contact & Delivery Information
                </h5>
                <p className="text-[11px] text-slate-500 truncate sm:whitespace-normal mt-0.5">
                  Where should our licensed advisors deliver your customized IRDAI policy quotes?
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <div className="flex items-center justify-between mb-1 min-h-[18px]">
                  <label className="text-xs sm:text-[13px] font-semibold text-[#101C38] block select-none">
                    Full Name as per Official ID <span className="text-[#F51F2B] font-bold">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customer.name}
                  onChange={(e) => updateCustomer('name', e.target.value)}
                  className={`inp ${errors.name ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-2 ring-[#F51F2B]/20' : ''}`}
                />
                {errors.name && (
                  <span className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#F51F2B]">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.name}</span>
                  </span>
                )}
              </div>

              {/* Standard Mobile Number Input (No OTP buttons/fields) */}
              <div>
                <div className="flex items-center justify-between mb-1 min-h-[18px]">
                  <label className="text-xs sm:text-[13px] font-semibold text-[#101C38] block select-none">
                    Mobile Number <span className="text-[#F51F2B] font-bold">*</span>
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none">
                    <span className="text-xs font-bold text-slate-400 select-none">+91</span>
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={customer.mobile}
                    onChange={(e) => updateCustomer('mobile', e.target.value.replace(/\D/g, ''))}
                    className={`inp pl-11 sm:pl-12 font-semibold tracking-wider ${
                      errors.mobile ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-2 ring-[#F51F2B]/20' : ''
                    }`}
                  />
                </div>
                {errors.mobile && (
                  <span className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#F51F2B]">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.mobile}</span>
                  </span>
                )}
              </div>

              {/* Email Address */}
              <div>
                <div className="flex items-center justify-between mb-1 min-h-[18px]">
                  <label className="text-xs sm:text-[13px] font-semibold text-[#101C38] block select-none">
                    Email Address <span className="text-[#F51F2B] font-bold">*</span>
                  </label>
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={customer.email}
                  onChange={(e) => updateCustomer('email', e.target.value)}
                  className={`inp ${errors.email ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-2 ring-[#F51F2B]/20' : ''}`}
                />
                {errors.email && (
                  <span className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#F51F2B]">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.email}</span>
                  </span>
                )}
              </div>

              {/* City / Location */}
              <div>
                <div className="flex items-center justify-between mb-1 min-h-[18px]">
                  <label className="text-xs sm:text-[13px] font-semibold text-[#101C38] block select-none">
                    City / Location <span className="text-[#F51F2B] font-bold">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Paramakudi, Ramanathapuram, Madurai"
                  value={customer.city}
                  onChange={(e) => updateCustomer('city', e.target.value)}
                  className={`inp ${errors.city ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-2 ring-[#F51F2B]/20' : ''}`}
                />
                {errors.city && (
                  <span className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs font-medium text-[#F51F2B]">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>{errors.city}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errors.submit && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-[#F51F2B] font-semibold flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#E5B544]/25">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#101C38] w-full sm:w-auto py-2.5 order-2 sm:order-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Specifications</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold !px-7 !py-2.5 sm:!py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#101C38]" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>

          {/* Privacy & Trust Guarantee */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1 text-center">
            <Lock size={12} className="shrink-0" />
            <span>100% Confidential • IRDAI Licensed Advisors • Zero Spam Guarantee</span>
          </div>
        </form>
      )}

      {/* ------------------------------------------------------------- */}
      {/* STEP 3: APPLICATION CONFIRMATION & RECEIPT                     */}
      {/* ------------------------------------------------------------- */}
      {step === 3 && submissionResult && (
        <div className="space-y-6 text-center animate-fade-in py-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-8 ring-emerald-50">
            <CheckCircle2 size={32} />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck size={13} />
              <span>Application Submitted Successfully</span>
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-black text-[#101C38] tracking-tight">
              Thank You, {customer.name}!
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#53627A] max-w-lg mx-auto">
              Your <b>{activeCategoryObj.title}</b> application has been registered and sent to our certified insurance underwriting specialists.
            </p>
          </div>

          {/* Application Receipt Card */}
          <div className="rounded-xl border border-[#E5B544] bg-[#FAF2DE]/20 p-3.5 sm:p-5 text-left max-w-lg mx-auto shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5B544]/30 pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Unique Application ID
                </span>
                <b className="block font-display text-base sm:text-lg font-black text-[#101C38] tracking-wide">
                  {submissionResult.applicationId}
                </b>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs shrink-0">
                <CheckCircle2 size={11} />
                <span>Registered</span>
              </span>
            </div>

            <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Applicant:</span>
                <b className="text-[#101C38] break-words">{customer.name}</b>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Mobile Number:</span>
                <b className="text-[#101C38]">+91 {customer.mobile}</b>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Category:</span>
                <b className="text-[#101C38]">{activeCategoryObj.title}</b>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">City / Location:</span>
                <b className="text-[#101C38] break-words">{customer.city}</b>
              </div>
              {details.regNumber && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Vehicle Reg No:</span>
                  <b className="text-[#101C38] uppercase break-words">{details.regNumber}</b>
                </div>
              )}
              {details.model && (
                <div>
                  <span className="text-slate-500 block text-[11px]">Make & Model:</span>
                  <b className="text-[#101C38] break-words">{details.manufacturer} {details.model}</b>
                </div>
              )}
              {details.sumInsured && (
                <div className="min-[380px]:col-span-2">
                  <span className="text-slate-500 block text-[11px]">Health Sum Insured:</span>
                  <b className="text-[#101C38]">{details.sumInsured}</b>
                </div>
              )}
              {details.sumAssured && (
                <div className="min-[380px]:col-span-2">
                  <span className="text-slate-500 block text-[11px]">Life Cover:</span>
                  <b className="text-[#101C38]">{details.sumAssured} ({details.policyDuration || 'Standard'})</b>
                </div>
              )}
            </div>

            <div className="mt-3.5 pt-2.5 border-t border-[#E5B544]/30 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
              <span>Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              <span className="font-semibold text-emerald-700">Status: Under Review</span>
            </div>
          </div>

          {/* What happens next */}
          <div className="max-w-lg mx-auto rounded-xl bg-slate-50 border border-slate-200 p-3.5 sm:p-4 text-left text-xs text-slate-600 space-y-1.5">
            <b className="text-[#101C38] block mb-1">What Happens Next?</b>
            <p>1. Our underwriting team compares rates across 50+ IRDAI approved insurance partners.</p>
            <p>2. A dedicated advisor will call you at <b>+91 {customer.mobile}</b> within 2 hours with customized quotes.</p>
            <p>3. Instant policy issuance with cashless garage / hospital benefits.</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleReset}
              className="btn-gold w-full sm:w-auto justify-center !py-2.5 sm:!py-3 !px-6 text-xs sm:text-sm font-bold cursor-pointer"
            >
              <span>Submit Another Application</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

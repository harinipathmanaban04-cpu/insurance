import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { api } from '../services/api';

const INSURANCE_TYPES = [
  'Car Insurance',
  'Bike Insurance',
  'Commercial Vehicle Insurance',
  'Health + Life Insurance',
];

export default function ContactEnquiryForm() {
  const [searchParams] = useSearchParams();

  // Pre-select category if passed in URL query
  const resolveInitialType = () => {
    const typeParam = searchParams.get('type') || searchParams.get('cat') || '';
    const match = INSURANCE_TYPES.find(
      (t) => t.toLowerCase() === typeParam.toLowerCase() || t.toLowerCase().includes(typeParam.toLowerCase())
    );
    return match || 'Car Insurance';
  };

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    city: '',
    insuranceType: resolveInitialType(),
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [serverError, setServerError] = useState('');

  // Update insurance type if URL params change
  useEffect(() => {
    const urlType = searchParams.get('type') || searchParams.get('cat');
    if (urlType) {
      const match = INSURANCE_TYPES.find((t) =>
        t.toLowerCase().includes(urlType.toLowerCase())
      );
      if (match) {
        setFormData((prev) => ({ ...prev, insuranceType: match }));
      }
    }
  }, [searchParams]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (serverError) setServerError('');
  };

  // Comprehensive Form Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters).';
    }

    const cleanMobile = formData.mobile.replace(/\D/g, '').slice(-10);
    if (!cleanMobile) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number (starts with 6-9).';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your city or location.';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter an enquiry subject.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      newErrors.message = 'Please describe your insurance requirements (at least 5 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.replace(/\D/g, '').slice(-10),
        email: formData.email.trim().toLowerCase(),
        city: formData.city.trim(),
        insuranceType: formData.insuranceType,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      };

      const res = await api.submitEnquiry(payload);

      if (res && res.success) {
        setSubmitSuccess({
          enquiryId: res.enquiryId || 'Registered',
          name: payload.name,
          email: payload.email,
          mobile: payload.mobile,
          insuranceType: payload.insuranceType,
        });

        // Clear the form after successful submission
        setFormData({
          name: '',
          mobile: '',
          email: '',
          city: '',
          insuranceType: 'Car Insurance',
          subject: '',
          message: '',
        });
        setErrors({});
      } else {
        setServerError(res?.error || 'Failed to submit your enquiry. Please try again or call our helpline.');
      }
    } catch (err) {
      setServerError(
        err.message || 'Network error occurred while submitting enquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitSuccess(null);
    setServerError('');
    setErrors({});
  };

  return (
    <div id="enquiry-form" className="card border border-[#E5E7EB] bg-white p-5 sm:p-8 shadow-card rounded-2xl">
      {/* Header */}
      <div className="border-b border-[#E5E7EB] pb-4 mb-6">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#F51F2B]">
          <Sparkles size={13} />
          <span>Quick Response Guarantee</span>
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-black text-[#101C38] tracking-tight mt-1">
          Insurance Enquiry Form
        </h2>
        <p className="text-xs sm:text-sm text-[#53627A] mt-1 leading-relaxed">
          Tell us about your insurance needs. Our certified advisors will compare plans across 50+ IRDAI insurers and get back to you with custom quotes.
        </p>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess ? (
        <div className="py-6 text-center space-y-4">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FAF2DE] text-[#047857]">
            <CheckCircle2 size={32} />
          </span>

          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#101C38]">
              Enquiry Submitted Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-[#53627A] mt-1 max-w-md mx-auto leading-relaxed">
              Thank you, <strong className="text-[#101C38]">{submitSuccess.name}</strong>. We have received your enquiry regarding <strong className="text-[#F51F2B]">{submitSuccess.insuranceType}</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-[#E5B544] bg-[#FAF2DE]/60 p-4 max-w-sm mx-auto text-left text-xs space-y-1.5">
            <div className="flex justify-between items-center pb-2 border-b border-[#E5B544]/40">
              <span className="text-slate-600 font-medium">Reference ID:</span>
              <strong className="text-[#101C38] font-mono tracking-wide">{submitSuccess.enquiryId}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Contact Mobile:</span>
              <span className="text-[#101C38] font-semibold">+91 {submitSuccess.mobile}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 font-medium">Confirmation Email:</span>
              <span className="text-[#101C38] truncate max-w-[180px]">{submitSuccess.email}</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="btn-gold !py-2.5 !px-6 text-xs sm:text-sm font-bold shadow-xs hover:shadow-sm"
            >
              <span>Submit Another Enquiry</span>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
          {/* Server Error Alert */}
          {serverError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#F51F2B]" />
              <div className="flex-1 leading-snug">{serverError}</div>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              <label htmlFor="enquiry-name" className="block text-xs font-bold text-[#101C38] mb-1">
                Full Name <span className="text-[#F51F2B]">*</span>
              </label>
              <input
                id="enquiry-name"
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={formData.name}
                onChange={handleChange('name')}
                disabled={isSubmitting}
                className={`inp ${errors.name ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.name && (
                <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label htmlFor="enquiry-mobile" className="block text-xs font-bold text-[#101C38] mb-1">
                Mobile Number <span className="text-[#F51F2B]">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[#53627A] select-none pointer-events-none">
                  +91
                </span>
                <input
                  id="enquiry-mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98401 23456"
                  value={formData.mobile}
                  onChange={handleChange('mobile')}
                  disabled={isSubmitting}
                  className={`inp pl-11 tracking-wider font-semibold ${
                    errors.mobile ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''
                  }`}
                />
              </div>
              {errors.mobile && (
                <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">
                  {errors.mobile}
                </span>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="enquiry-email" className="block text-xs font-bold text-[#101C38] mb-1">
                Email Address <span className="text-[#F51F2B]">*</span>
              </label>
              <input
                id="enquiry-email"
                type="email"
                placeholder="ramesh@example.com"
                value={formData.email}
                onChange={handleChange('email')}
                disabled={isSubmitting}
                className={`inp ${errors.email ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.email && (
                <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">
                  {errors.email}
                </span>
              )}
            </div>

            {/* City / Location */}
            <div>
              <label htmlFor="enquiry-city" className="block text-xs font-bold text-[#101C38] mb-1">
                City / Location <span className="text-[#F51F2B]">*</span>
              </label>
              <input
                id="enquiry-city"
                type="text"
                placeholder="e.g. Paramakudi, Madurai, Chennai"
                value={formData.city}
                onChange={handleChange('city')}
                disabled={isSubmitting}
                className={`inp ${errors.city ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.city && (
                <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">
                  {errors.city}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Insurance Requirements */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Insurance Type Dropdown */}
            <div>
              <label htmlFor="enquiry-type" className="block text-xs font-bold text-[#101C38] mb-1">
                Insurance Type <span className="text-[#F51F2B]">*</span>
              </label>
              <div className="relative">
                <select
                  id="enquiry-type"
                  value={formData.insuranceType}
                  onChange={handleChange('insuranceType')}
                  disabled={isSubmitting}
                  className="inp bg-white font-semibold text-[#101C38] appearance-none pr-8 cursor-pointer"
                >
                  {INSURANCE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="enquiry-subject" className="block text-xs font-bold text-[#101C38] mb-1">
                Subject <span className="text-[#F51F2B]">*</span>
              </label>
              <input
                id="enquiry-subject"
                type="text"
                placeholder="e.g. Comprehensive policy renewal quotation"
                value={formData.subject}
                onChange={handleChange('subject')}
                disabled={isSubmitting}
                className={`inp ${errors.subject ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
              {errors.subject && (
                <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">
                  {errors.subject}
                </span>
              )}
            </div>
          </div>

          {/* Section 3: Message / Describe Requirements */}
          <div>
            <label htmlFor="enquiry-message" className="block text-xs font-bold text-[#101C38] mb-1">
              Message / Describe Your Insurance Requirements <span className="text-[#F51F2B]">*</span>
            </label>
            <textarea
              id="enquiry-message"
              rows={4}
              placeholder="Provide vehicle details (make, model, year) or health family requirements so our advisors can calculate the best policy quotes for you..."
              value={formData.message}
              onChange={handleChange('message')}
              disabled={isSubmitting}
              className={`inp resize-none leading-relaxed ${
                errors.message ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''
              }`}
            />
            {errors.message && (
              <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">
                {errors.message}
              </span>
            )}
          </div>

          {/* Privacy Note & Submit Button */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-[#53627A]">
              <ShieldCheck size={14} className="text-[#047857] shrink-0" />
              <span>Zero-spam guarantee. Your contact information is never shared.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-red !py-3 !px-6 text-xs sm:text-sm font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-xs hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Enquiry</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

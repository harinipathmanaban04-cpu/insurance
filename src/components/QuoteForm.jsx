import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { CATS } from '../data/data';

export default function QuoteForm({ defaultType = '' }) {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    type: defaultType || searchParams.get('type') || '',
    city: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.type) newErrors.type = 'Please select an insurance type';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="card border border-[#E5E7EB] bg-white p-5 sm:p-8 text-center shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF2DE] text-[#F51F2B]">
          <CheckCircle2 size={36} />
        </span>
        <h3 className="mt-4 font-display text-2xl font-black text-[#171717]">
          Thank you, {formData.name}!
        </h3>
        <p className="mt-2 text-sm text-[#53627A] max-w-md mx-auto leading-relaxed">
          Your quote request for <b>{formData.type}</b> has been received. Our certified insurance specialist will contact you on <b>{formData.mobile}</b> shortly with customized quotes.
        </p>
        <button
          className="btn-gold mt-6 text-xs sm:text-sm font-bold"
          onClick={() => {
            setSubmitted(false);
            setFormData({ ...formData, notes: '' });
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  const FormField = ({ id, label, children }) => (
    <label className="block text-xs sm:text-sm font-bold text-[#171717]">
      {label}
      {children}
      {errors[id] && (
        <span role="alert" className="mt-1 block text-xs font-semibold text-[#F51F2B]">
          {errors[id]}
        </span>
      )}
    </label>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      id="quote"
      className="card border border-[#E5E7EB] bg-white p-4 sm:p-6 md:p-8 shadow-card grid gap-4 sm:grid-cols-2"
    >
      <div className="sm:col-span-2 border-b border-[#E5E7EB] pb-3">
        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#F51F2B]">
          <Sparkles size={13} />
          <span>No Spam Guarantee</span>
        </span>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#171717] mt-1">
          Request a Free Insurance Quote
        </h3>
        <p className="text-xs sm:text-sm text-[#53627A] mt-0.5">
          Get multiple insurer comparisons with transparent premiums and maximum discounts.
        </p>
      </div>

      <FormField id="name" label="Full Name *">
        <input
          className={`inp mt-1 ${errors.name ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
          placeholder="e.g. Ramesh Kumar"
          value={formData.name}
          onChange={handleChange('name')}
        />
      </FormField>

      <FormField id="mobile" label="Mobile Number *">
        <input
          className={`inp mt-1 ${errors.mobile ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
          placeholder="10-digit mobile number"
          inputMode="numeric"
          maxLength={10}
          value={formData.mobile}
          onChange={handleChange('mobile')}
        />
      </FormField>

      <FormField id="email" label="Email Address *">
        <input
          className={`inp mt-1 ${errors.email ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
          type="email"
          placeholder="name@example.com"
          value={formData.email}
          onChange={handleChange('email')}
        />
      </FormField>

      <FormField id="type" label="Insurance Type *">
        <select
          className={`inp mt-1 bg-white ${errors.type ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
          value={formData.type}
          onChange={handleChange('type')}
        >
          <option value="">Select Insurance Type…</option>
          {CATS.map((c) => (
            <option key={c.id} value={c.type}>
              {c.type}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="city" label="City / RTO Location *">
        <input
          className={`inp mt-1 ${errors.city ? 'border-[#F51F2B] focus:border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
          placeholder="e.g. Mumbai, Delhi, Bengaluru"
          value={formData.city}
          onChange={handleChange('city')}
        />
      </FormField>

      <div className="sm:col-span-2">
        <label className="block text-xs sm:text-sm font-bold text-[#171717]">
          Additional Requirements (Vehicle Model, Manufacturing Year, or Health Goals)
          <textarea
            rows={3}
            className="inp mt-1 resize-none"
            placeholder="e.g. Need comprehensive cover with zero depreciation for 2022 Hyundai Creta"
            value={formData.notes}
            onChange={handleChange('notes')}
          />
        </label>
      </div>

      <div className="sm:col-span-2 pt-2">
        <button
          type="submit"
          className="btn-gold w-full justify-center text-sm sm:text-base font-bold shadow-xs py-3"
        >
          <span>Get Free Quotes Now</span>
          <ArrowRight size={17} />
        </button>
        <p className="mt-2 text-center text-[11px] text-[#53627A]">
          By clicking submit, you agree to our terms. We never share your data with unauthorized third parties.
        </p>
      </div>
    </form>
  );
}

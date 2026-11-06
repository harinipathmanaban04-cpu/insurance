import {
  Car,
  Bike,
  Truck,
  HeartPulse,
  Users,
  Shield,
  ChevronDown,
  AlertCircle,
} from 'lucide-react';
import {
  CAR_MANUFACTURERS,
  POPULAR_CAR_MODELS,
  BIKE_MANUFACTURERS,
  POPULAR_BIKE_MODELS,
  COMMERCIAL_CATEGORIES,
  COMMERCIAL_MANUFACTURERS,
  POPULAR_COMMERCIAL_MODELS,
  HEALTH_SUM_INSURED,
  LIFE_SUM_ASSURED,
  LIFE_INCOME_RANGES,
  YEARS,
  TAMIL_NADU_RTO_SUGGESTIONS,
} from './constants';

// Reusable, bulletproof Select Field component
function SelectField({
  id,
  label,
  value = '',
  onChange,
  options = [],
  placeholder = 'Select option...',
  required = false,
  error,
  className = '',
  disabled = false,
}) {
  const isSelected = Boolean(value);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-1.5 min-h-[18px]">
        <label htmlFor={id} className="text-xs sm:text-[13px] font-semibold text-[#101C38] cursor-pointer select-none">
          {label} {required && <span className="text-[#F51F2B] font-bold">*</span>}
        </label>
      </div>

      <div className="relative">
        <select
          id={id}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-[44px] rounded-lg border bg-white pl-3.5 pr-10 text-sm appearance-none cursor-pointer focus:outline-none transition-colors duration-150 disabled:bg-slate-50 disabled:cursor-not-allowed ${
            isSelected ? 'text-[#101C38] font-medium' : 'text-slate-400 font-normal text-[13px] sm:text-sm'
          } ${
            error
              ? 'border-[#F51F2B] focus:border-[#F51F2B] focus:ring-2 focus:ring-[#F51F2B]/20'
              : isSelected
              ? 'border-[#E5B544]/70 hover:border-[#CF9F30] focus:border-[#E5B544] focus:ring-2 focus:ring-[#E5B544]/25'
              : 'border-slate-300 hover:border-[#CF9F30] focus:border-[#E5B544] focus:ring-2 focus:ring-[#E5B544]/25'
          }`}
        >
          <option value="" disabled className="text-slate-400 font-normal bg-white">
            {placeholder}
          </option>
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={optVal} value={optVal} className="text-[#101C38] font-normal bg-white py-1">
                {optLabel}
              </option>
            );
          })}
        </select>

        {/* Clear, accessible dropdown indicator arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
          <ChevronDown size={16} strokeWidth={2.2} />
        </div>
      </div>

      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium text-[#F51F2B]">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}

// Reusable, compact Input Field component matching SelectField styling
function InputField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  error,
  className = '',
  list,
  uppercase = false,
  maxLength,
  disabled = false,
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-1.5 min-h-[18px]">
        <label htmlFor={id} className="text-xs sm:text-[13px] font-semibold text-[#101C38] cursor-pointer select-none">
          {label} {required && <span className="text-[#F51F2B] font-bold">*</span>}
        </label>
      </div>

      <input
        id={id}
        type={type}
        list={list}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
        className={`w-full h-[44px] rounded-lg border bg-white px-3.5 text-sm text-[#101C38] font-medium placeholder:text-slate-400 placeholder:font-normal placeholder:text-[13px] sm:placeholder:text-sm focus:outline-none transition-colors duration-150 disabled:bg-slate-50 disabled:cursor-not-allowed ${
          uppercase ? 'uppercase font-semibold tracking-wider' : ''
        } ${
          error
            ? 'border-[#F51F2B] focus:border-[#F51F2B] focus:ring-2 focus:ring-[#F51F2B]/20'
            : value
            ? 'border-[#E5B544]/70 hover:border-[#CF9F30] focus:border-[#E5B544] focus:ring-2 focus:ring-[#E5B544]/25'
            : 'border-slate-300 hover:border-[#CF9F30] focus:border-[#E5B544] focus:ring-2 focus:ring-[#E5B544]/25'
        }`}
      />

      {error && (
        <span className="mt-1.5 flex items-center gap-1 text-[11.5px] font-medium text-[#F51F2B]">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}

// Section Header with subtle icon and badge
function SectionHeader({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center gap-2 pb-2.5 border-b border-[#E5B544]/25 mb-4 pt-1">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF2DE] text-[#101C38] shrink-0 border border-[#E5B544]/40">
        <Icon size={14} className="text-[#F51F2B]" />
      </span>
      <div className="min-w-0">
        <h5 className="text-xs font-bold uppercase tracking-wider text-[#101C38]">{title}</h5>
        {subtitle && <p className="text-[11px] text-slate-500 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function CategoryFields({ category, details, onChange, errors = {} }) {
  // Atomic functional update helper
  const update = (field, val) => {
    onChange((prev) => ({ ...prev, [field]: val }));
  };

  const updateMultiple = (fieldsObj) => {
    onChange((prev) => ({ ...prev, ...fieldsObj }));
  };

  // -------------------------------------------------------------
  // 1. BIKE INSURANCE FORM
  // -------------------------------------------------------------
  if (category === 'bike') {
    const popularModels = POPULAR_BIKE_MODELS[details.manufacturer] || [];
    const isOtherModelSelected = details.model === 'Other Model' || (details.customModel && !popularModels.includes(details.model));

    return (
      <div className="space-y-6">
        {/* Section A: Bike Specifications */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Two-Wheeler Specifications"
            subtitle="Vehicle registration, manufacturer, model, fuel and manufacturing year"
            icon={Bike}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <InputField
              id="bike-regNumber"
              label="Registration Number"
              required={true}
              error={errors.regNumber}
              placeholder="e.g. TN 65 AB 5678 (or enter NEW)"
              value={details.regNumber}
              uppercase={true}
              onChange={(val) => update('regNumber', val)}
            />

            <SelectField
              id="bike-manufacturer"
              label="Bike Manufacturer"
              required={true}
              error={errors.manufacturer}
              placeholder="Select Manufacturer..."
              value={details.manufacturer}
              options={BIKE_MANUFACTURERS}
              onChange={(val) => {
                updateMultiple({
                  manufacturer: val,
                  model: '',
                  customModel: '',
                });
              }}
            />

            {/* Dynamic Model Dropdown / Custom Model Input */}
            {popularModels.length > 0 ? (
              <div className="flex flex-col space-y-2">
                <SelectField
                  id="bike-model"
                  label="Bike Model"
                  required={true}
                  error={errors.model}
                  placeholder="Select Model..."
                  value={isOtherModelSelected ? 'Other Model' : details.model}
                  options={[...popularModels, 'Other Model']}
                  onChange={(val) => {
                    if (val === 'Other Model') {
                      updateMultiple({ model: 'Other Model', customModel: '' });
                    } else {
                      updateMultiple({ model: val, customModel: '' });
                    }
                  }}
                />
                {isOtherModelSelected && (
                  <InputField
                    id="bike-customModel"
                    label="Specify Other Model Name"
                    required={true}
                    error={errors.model}
                    placeholder="e.g. Karizma, Xtreme 160R"
                    value={details.customModel || ''}
                    onChange={(val) => updateMultiple({ customModel: val, model: val })}
                  />
                )}
              </div>
            ) : (
              <InputField
                id="bike-model-text"
                label="Bike Model"
                required={true}
                error={errors.model}
                placeholder="e.g. Splendor Plus, Classic 350, Activa"
                value={details.model}
                onChange={(val) => update('model', val)}
              />
            )}

            <SelectField
              id="bike-fuelType"
              label="Fuel Type"
              placeholder="Select Fuel Type..."
              value={details.fuelType || ''}
              options={['Petrol', 'Electric (EV)']}
              onChange={(val) => update('fuelType', val)}
            />

            <SelectField
              id="bike-engineCapacity"
              label="Engine Capacity (CC)"
              placeholder="Select Engine Capacity..."
              value={details.engineCapacity || ''}
              options={[
                'Under 100cc (e.g. TVS XL100)',
                '100cc - 150cc (e.g. Splendor, Activa, Shine)',
                '150cc - 250cc (e.g. Pulsar 150, FZ, Apache)',
                '250cc - 350cc (e.g. Classic 350, Hunter 350)',
                'Above 350cc (Superbikes / 400cc+)',
                'Electric 2-Wheeler (EV)',
              ]}
              onChange={(val) => update('engineCapacity', val)}
            />

            <SelectField
              id="bike-mfgYear"
              label="Manufacturing Year"
              required={true}
              error={errors.mfgYear}
              placeholder="Select Year..."
              value={details.mfgYear}
              options={YEARS}
              onChange={(val) => update('mfgYear', val)}
            />

            <div className="sm:col-span-2">
              <InputField
                id="bike-rtoLocation"
                label="RTO Registration Location"
                list="rto-list"
                placeholder="e.g. TN-65 Ramanathapuram, TN-01 Chennai Central"
                value={details.rtoLocation}
                onChange={(val) => update('rtoLocation', val)}
              />
            </div>
          </div>
        </div>

        {/* Section B: Policy & Coverage Details */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Coverage & Policy Details"
            subtitle="Plan preference and previous policy expiration details"
            icon={Shield}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <SelectField
              id="bike-insuranceType"
              label="Preferred Insurance Type"
              placeholder="Select Insurance Type..."
              value={details.insuranceType || ''}
              options={[
                { value: 'Comprehensive 1-Year Plan', label: 'Comprehensive (Own Damage + Third-Party)' },
                { value: 'Multi-Year Comprehensive (2 or 3 Years)', label: 'Multi-Year Comprehensive (2 or 3 Years)' },
                { value: 'Third-Party Only Cover', label: 'Third-Party Cover Only' },
                { value: 'Standalone Own Damage (OD)', label: 'Standalone Own Damage (OD)' },
              ]}
              onChange={(val) => update('insuranceType', val)}
            />

            <SelectField
              id="bike-policyStatus"
              label="Existing Policy Status"
              placeholder="Select Current Policy Status..."
              value={details.policyStatus || ''}
              options={[
                'Active (Standard Renewal)',
                'Expired within 90 days (NCB Valid)',
                'Expired more than 90 days',
                'Brand New Bike',
              ]}
              onChange={(val) => update('policyStatus', val)}
            />

            <div className="sm:col-span-2">
              <InputField
                id="bike-expiryDate"
                type="date"
                label="Registration Date / Policy Expiry Date"
                value={details.expiryDate}
                onChange={(val) => update('expiryDate', val)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. CAR INSURANCE FORM
  // -------------------------------------------------------------
  if (category === 'car') {
    const popularModels = POPULAR_CAR_MODELS[details.manufacturer] || [];
    const isOtherModelSelected = details.model === 'Other Model' || (details.customModel && !popularModels.includes(details.model));

    return (
      <div className="space-y-6">
        {/* Section A: Car Specifications */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Four-Wheeler Specifications"
            subtitle="Vehicle registration, brand, model, fuel type and manufacturing year"
            icon={Car}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <InputField
              id="car-regNumber"
              label="Vehicle Registration Number"
              required={true}
              error={errors.regNumber}
              placeholder="e.g. TN 01 AB 1234 (or enter NEW)"
              value={details.regNumber}
              uppercase={true}
              onChange={(val) => update('regNumber', val)}
            />

            <SelectField
              id="car-manufacturer"
              label="Car Manufacturer"
              required={true}
              error={errors.manufacturer}
              placeholder="Select Manufacturer..."
              value={details.manufacturer}
              options={CAR_MANUFACTURERS}
              onChange={(val) => {
                updateMultiple({
                  manufacturer: val,
                  model: '',
                  customModel: '',
                });
              }}
            />

            {/* Dynamic Model Dropdown / Custom Model Input */}
            {popularModels.length > 0 ? (
              <div className="flex flex-col space-y-2">
                <SelectField
                  id="car-model"
                  label="Car Model"
                  required={true}
                  error={errors.model}
                  placeholder="Select Model..."
                  value={isOtherModelSelected ? 'Other Model' : details.model}
                  options={[...popularModels, 'Other Model']}
                  onChange={(val) => {
                    if (val === 'Other Model') {
                      updateMultiple({ model: 'Other Model', customModel: '' });
                    } else {
                      updateMultiple({ model: val, customModel: '' });
                    }
                  }}
                />
                {isOtherModelSelected && (
                  <InputField
                    id="car-customModel"
                    label="Specify Other Model Name"
                    required={true}
                    error={errors.model}
                    placeholder="e.g. Ioniq 5, Jimny, Meridian"
                    value={details.customModel || ''}
                    onChange={(val) => updateMultiple({ customModel: val, model: val })}
                  />
                )}
              </div>
            ) : (
              <InputField
                id="car-model-text"
                label="Car Model"
                required={true}
                error={errors.model}
                placeholder="e.g. Creta, Swift, Nexon, Seltos"
                value={details.model}
                onChange={(val) => update('model', val)}
              />
            )}

            <InputField
              id="car-variant"
              label="Car Variant / Trim"
              placeholder="e.g. SX(O) 1.5, VXI, Creative, ZXI+"
              value={details.variant}
              onChange={(val) => update('variant', val)}
            />

            <SelectField
              id="car-fuelType"
              label="Fuel Type"
              placeholder="Select Fuel Type..."
              value={details.fuelType || ''}
              options={[
                'Petrol',
                'Diesel',
                'CNG / Hybrid CNG',
                'Electric (EV)',
                'Strong Hybrid',
              ]}
              onChange={(val) => update('fuelType', val)}
            />

            <SelectField
              id="car-mfgYear"
              label="Manufacturing Year"
              required={true}
              error={errors.mfgYear}
              placeholder="Select Year..."
              value={details.mfgYear}
              options={YEARS}
              onChange={(val) => update('mfgYear', val)}
            />

            <div className="sm:col-span-2">
              <InputField
                id="car-rtoLocation"
                label="RTO Registration Location"
                list="rto-list"
                placeholder="e.g. TN-01 Chennai Central, TN-58 Madurai, TN-65 Ramanathapuram"
                value={details.rtoLocation}
                onChange={(val) => update('rtoLocation', val)}
              />
            </div>
          </div>
        </div>

        {/* Section B: Policy & Coverage Details */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Coverage & Policy Details"
            subtitle="Coverage type, previous claims and No-Claim Bonus savings"
            icon={Shield}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <SelectField
              id="car-insuranceType"
              label="Preferred Insurance Type"
              placeholder="Select Insurance Plan..."
              value={details.insuranceType || ''}
              options={[
                { value: 'Comprehensive + Zero Depreciation', label: 'Comprehensive + Zero Depreciation (Recommended)' },
                { value: 'Standard Comprehensive Cover', label: 'Standard Comprehensive Cover' },
                { value: 'Third-Party Cover Only', label: 'Third-Party Cover Only' },
                { value: 'Standalone Own Damage (OD)', label: 'Standalone Own Damage (OD)' },
              ]}
              onChange={(val) => update('insuranceType', val)}
            />

            <SelectField
              id="car-policyStatus"
              label="Existing Policy Status"
              placeholder="Select Current Policy Status..."
              value={details.policyStatus || ''}
              options={[
                'Active - Expiring soon',
                'Expired within 90 days (NCB Valid)',
                'Expired more than 90 days',
                'Brand New Car (No existing policy)',
              ]}
              onChange={(val) => update('policyStatus', val)}
            />

            <InputField
              id="car-expiryDate"
              type="date"
              label="Registration Date / Policy Expiry"
              value={details.expiryDate}
              onChange={(val) => update('expiryDate', val)}
            />

            <SelectField
              id="car-previousClaims"
              label="Previous Claims & No-Claim Bonus (NCB)"
              placeholder="Select Previous NCB / Claims..."
              value={details.previousClaims || ''}
              options={[
                'No Claims - 0% NCB (New / 1st year)',
                'No Claims - 20% NCB (1 Year Claim-Free)',
                'No Claims - 25% NCB (2 Years Claim-Free)',
                'No Claims - 35% NCB (3 Years Claim-Free)',
                'No Claims - 45% NCB (4 Years Claim-Free)',
                'No Claims - 50% NCB (Maximum Discount)',
                'Claim made in previous year (0% NCB)',
              ]}
              onChange={(val) => update('previousClaims', val)}
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. COMMERCIAL VEHICLE INSURANCE FORM
  // -------------------------------------------------------------
  if (category === 'commercial') {
    const popularCommercialModels = POPULAR_COMMERCIAL_MODELS[details.manufacturer] || [];
    const isOtherModelSelected = details.model === 'Other Model' || (details.customModel && !popularCommercialModels.includes(details.model));

    return (
      <div className="space-y-6">
        {/* Section A: Commercial Vehicle Specifications */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Commercial Vehicle Specifications"
            subtitle="Vehicle category, manufacturer, payload capacity and commercial permit"
            icon={Truck}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <InputField
              id="comm-regNumber"
              label="Registration Number"
              required={true}
              error={errors.regNumber}
              placeholder="e.g. TN 58 AX 9012 (or enter NEW)"
              value={details.regNumber}
              uppercase={true}
              onChange={(val) => update('regNumber', val)}
            />

            <SelectField
              id="comm-vehicleCategory"
              label="Commercial Vehicle Category"
              required={true}
              error={errors.vehicleCategory}
              placeholder="Select Category..."
              value={details.vehicleCategory}
              options={COMMERCIAL_CATEGORIES}
              onChange={(val) => update('vehicleCategory', val)}
            />

            <SelectField
              id="comm-manufacturer"
              label="Manufacturer"
              required={true}
              error={errors.manufacturer}
              placeholder="Select Manufacturer..."
              value={details.manufacturer}
              options={COMMERCIAL_MANUFACTURERS}
              onChange={(val) => {
                updateMultiple({
                  manufacturer: val,
                  model: '',
                  customModel: '',
                });
              }}
            />

            {/* Dynamic Model Dropdown / Custom Model Input */}
            {popularCommercialModels.length > 0 ? (
              <div className="flex flex-col space-y-2">
                <SelectField
                  id="comm-model"
                  label="Vehicle Model"
                  required={true}
                  error={errors.model}
                  placeholder="Select Model..."
                  value={isOtherModelSelected ? 'Other Model' : details.model}
                  options={[...popularCommercialModels, 'Other Model']}
                  onChange={(val) => {
                    if (val === 'Other Model') {
                      updateMultiple({ model: 'Other Model', customModel: '' });
                    } else {
                      updateMultiple({ model: val, customModel: '' });
                    }
                  }}
                />
                {isOtherModelSelected && (
                  <InputField
                    id="comm-customModel"
                    label="Specify Other Model Name"
                    required={true}
                    error={errors.model}
                    placeholder="e.g. LPT 407, Signa 4825"
                    value={details.customModel || ''}
                    onChange={(val) => updateMultiple({ customModel: val, model: val })}
                  />
                )}
              </div>
            ) : (
              <InputField
                id="comm-model-text"
                label="Vehicle Model"
                required={true}
                error={errors.model}
                placeholder="e.g. Tata Ace, Bolero Maxi Truck, Eicher Pro 2049"
                value={details.model}
                onChange={(val) => update('model', val)}
              />
            )}

            <SelectField
              id="comm-fuelType"
              label="Fuel Type"
              placeholder="Select Fuel Type..."
              value={details.fuelType || ''}
              options={['Diesel', 'CNG', 'Electric (EV)', 'Petrol']}
              onChange={(val) => update('fuelType', val)}
            />

            <SelectField
              id="comm-mfgYear"
              label="Manufacturing Year"
              required={true}
              error={errors.mfgYear}
              placeholder="Select Year..."
              value={details.mfgYear}
              options={YEARS}
              onChange={(val) => update('mfgYear', val)}
            />

            <InputField
              id="comm-gvwOrCapacity"
              label="GVW / Seating Capacity"
              required={true}
              error={errors.gvwOrCapacity}
              placeholder="e.g. 11,990 kg GVW or 32 Seats"
              value={details.gvwOrCapacity}
              onChange={(val) => update('gvwOrCapacity', val)}
            />

            <SelectField
              id="comm-vehicleUsage"
              label="Commercial Vehicle Usage"
              placeholder="Select Commercial Usage..."
              value={details.vehicleUsage || ''}
              options={[
                'Public Carrier (State / National Permit)',
                'Private Carrier (Own Business Goods Transport)',
                'Passenger Taxi / App Cab (Commercial)',
                'Contract Carriage / Staff Transport',
                'School / Educational Institution Bus',
                'Agricultural / Farm Use',
              ]}
              onChange={(val) => update('vehicleUsage', val)}
            />

            <div className="sm:col-span-2">
              <InputField
                id="comm-rtoLocation"
                label="RTO Registration Location"
                list="rto-list"
                placeholder="e.g. TN-58 Madurai South, TN-63 Sivaganga, TN-65 Ramanathapuram"
                value={details.rtoLocation}
                onChange={(val) => update('rtoLocation', val)}
              />
            </div>
          </div>
        </div>

        {/* Section B: Existing Policy & Registration Details */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Existing Policy Information"
            subtitle="Previous insurer and policy expiration details"
            icon={Shield}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <InputField
              id="comm-existingInsurance"
              label="Existing Insurance & Insurer Name"
              placeholder="e.g. National Insurance, New India, Cholamandalam MS"
              value={details.existingInsurance}
              onChange={(val) => update('existingInsurance', val)}
            />

            <InputField
              id="comm-expiryDate"
              type="date"
              label="Registration Date / Policy Expiry"
              value={details.expiryDate}
              onChange={(val) => update('expiryDate', val)}
            />
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. LIFE & HEALTH INSURANCE FORM
  // -------------------------------------------------------------
  if (category === 'health-life' || category === 'health' || category === 'life') {
    return (
      <div className="space-y-6">
        {/* Section 1: Health Insurance Details */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Health Insurance & Hospitalization Details"
            subtitle="Cashless medical coverage, family floater options and hospital network"
            icon={HeartPulse}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <SelectField
              id="health-planType"
              label="Health Plan Type"
              placeholder="Select Health Plan Type..."
              value={details.planType || ''}
              options={[
                'Family Floater (Self + Spouse + Children)',
                'Individual Cover (Single Person)',
                'Parents / Senior Citizen Plan',
                'Critical Illness + Personal Accident',
              ]}
              onChange={(val) => update('planType', val)}
            />

            <SelectField
              id="health-familyCount"
              label="Total Insured Family Members"
              placeholder="Select Number of Members..."
              value={details.familyCount || ''}
              options={[
                '1 Member (Self Only)',
                '2 Members (Self + Spouse)',
                '3 Members (Self + Spouse + 1 Child)',
                '4 Members (Self + Spouse + 2 Children)',
                '5+ Members (Including Parents)',
              ]}
              onChange={(val) => update('familyCount', val)}
            />

            <SelectField
              id="health-sumInsured"
              label="Required Health Sum Insured"
              placeholder="Select Health Sum Insured..."
              value={details.sumInsured || ''}
              options={HEALTH_SUM_INSURED}
              onChange={(val) => update('sumInsured', val)}
            />

            <InputField
              id="health-cityPincode"
              label="City & Pincode"
              required={true}
              error={errors.cityPincode}
              placeholder="e.g. Paramakudi - 623707, Madurai"
              value={details.cityPincode}
              onChange={(val) => update('cityPincode', val)}
            />

            <div className="sm:col-span-2">
              <InputField
                id="health-membersAges"
                label="Age of Each Member to be Covered"
                placeholder="e.g. Self: 36, Spouse: 33, Child 1: 8, Child 2: 4"
                value={details.membersAges}
                onChange={(val) => update('membersAges', val)}
              />
            </div>

            <div className="sm:col-span-2">
              <InputField
                id="health-existingConditions"
                label="Existing Medical Conditions / Health Declaration"
                placeholder="e.g. None (Clean declaration) OR BP, Diabetes, etc."
                value={details.existingConditions}
                onChange={(val) => update('existingConditions', val)}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Life Insurance & Financial Protection */}
        <div className="rounded-xl border border-[#E5E7EB] hover:border-[#E5B544]/40 bg-[#FDFCFB] p-4 sm:p-5 transition-colors">
          <SectionHeader
            title="Life & Term Protection Details"
            subtitle="Pure financial security and milestone income replacement"
            icon={Users}
          />

          <div className="grid gap-3.5 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <InputField
              id="life-dob"
              type="date"
              label="Primary Insured Date of Birth (DOB)"
              required={true}
              error={errors.dob}
              value={details.dob}
              onChange={(val) => update('dob', val)}
            />

            <SelectField
              id="life-gender"
              label="Gender"
              placeholder="Select Gender..."
              value={details.gender || ''}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female (Special Lower Premium Rate)' },
                { value: 'Other', label: 'Other' },
              ]}
              onChange={(val) => update('gender', val)}
            />

            <SelectField
              id="life-annualIncome"
              label="Annual Income Range"
              required={true}
              error={errors.annualIncome}
              placeholder="Select Annual Income..."
              value={details.annualIncome || ''}
              options={LIFE_INCOME_RANGES}
              onChange={(val) => update('annualIncome', val)}
            />

            <SelectField
              id="life-occupation"
              label="Occupation Type"
              required={true}
              error={errors.occupation}
              placeholder="Select Occupation..."
              value={details.occupation || ''}
              options={[
                'Salaried (Private / Govt)',
                'Self-Employed / Business Owner',
                'Professional (Doctor, CA, Lawyer, Engineer)',
                'Agriculturist / Farmer',
                'Homemaker',
                'Student / Other',
              ]}
              onChange={(val) => update('occupation', val)}
            />

            <SelectField
              id="life-sumAssured"
              label="Required Life Coverage (Sum Assured)"
              placeholder="Select Life Coverage..."
              value={details.sumAssured || ''}
              options={LIFE_SUM_ASSURED}
              onChange={(val) => update('sumAssured', val)}
            />

            <SelectField
              id="life-policyDuration"
              label="Policy Duration / Coverage Till Age"
              placeholder="Select Coverage Duration..."
              value={details.policyDuration || ''}
              options={[
                'Till 60 Years (Retirement Age)',
                'Till 65 Years',
                'Till 70 Years (Most Popular)',
                'Till 75 Years',
                'Till 85 Years (Extended Cover)',
                'Whole Life (Till Age 99 / 100)',
              ]}
              onChange={(val) => update('policyDuration', val)}
            />

            <div className="sm:col-span-2">
              <SelectField
                id="life-tobacco"
                label="Do You Consume Tobacco or Nicotine?"
                placeholder="Select Tobacco Consumption..."
                value={details.tobacco || ''}
                options={[
                  'No (Non-Smoker - Maximum Discount)',
                  'Yes (Smoker / Tobacco products)',
                ]}
                onChange={(val) => update('tobacco', val)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

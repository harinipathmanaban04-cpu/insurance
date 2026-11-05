import { HeartPulse, Users } from 'lucide-react';
import {
  CAR_MANUFACTURERS,
  POPULAR_CAR_MODELS,
  BIKE_MANUFACTURERS,
  POPULAR_BIKE_MODELS,
  COMMERCIAL_CATEGORIES,
  COMMERCIAL_MANUFACTURERS,
  HEALTH_SUM_INSURED,
  LIFE_SUM_ASSURED,
  LIFE_INCOME_RANGES,
  YEARS,
  TAMIL_NADU_RTO_SUGGESTIONS,
} from './constants';

// FormField defined at module level with a stable identity so inputs never remount on keystroke
function FormField({ label, required = true, error, children, helpText }) {
  return (
    <label className="block text-xs font-bold text-[#101C38]">
      <div className="flex items-center justify-between mb-1">
        <span>
          {label} {required && <span className="text-[#F51F2B]">*</span>}
        </span>
        {helpText && <span className="text-[10.5px] font-normal text-slate-500">{helpText}</span>}
      </div>
      {children}
      {error && <span className="mt-1 block text-xs font-semibold text-[#F51F2B]">{error}</span>}
    </label>
  );
}

export default function CategoryFields({ category, details, onChange, errors = {} }) {
  const update = (field, val) => {
    onChange({ ...details, [field]: val });
  };

  // 1. CAR INSURANCE FIELDS
  if (category === 'car') {
    const models = POPULAR_CAR_MODELS[details.manufacturer] || [];

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Vehicle Registration Number" error={errors.regNumber}>
          <input
            type="text"
            placeholder="e.g. TN 01 AB 1234"
            value={details.regNumber || ''}
            onChange={(e) => update('regNumber', e.target.value.toUpperCase())}
            className={`inp uppercase font-semibold tracking-wider ${errors.regNumber ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
          />
        </FormField>

        <FormField label="Car Manufacturer" error={errors.manufacturer}>
          <select
            value={details.manufacturer || ''}
            onChange={(e) => {
              update('manufacturer', e.target.value);
              update('model', '');
            }}
            className={`inp bg-white ${errors.manufacturer ? 'border-[#F51F2B]' : ''}`}
          >
            <option value="">Select Manufacturer...</option>
            {CAR_MANUFACTURERS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Car Model" error={errors.model}>
          {models.length > 0 ? (
            <select
              value={details.model || ''}
              onChange={(e) => update('model', e.target.value)}
              className={`inp bg-white ${errors.model ? 'border-[#F51F2B]' : ''}`}
            >
              <option value="">Select Model...</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="Other">Other Model</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder="e.g. Creta, Swift, Nexon"
              value={details.model || ''}
              onChange={(e) => update('model', e.target.value)}
              className={`inp ${errors.model ? 'border-[#F51F2B]' : ''}`}
            />
          )}
        </FormField>

        <FormField label="Car Variant" error={errors.variant}>
          <input
            type="text"
            placeholder="e.g. SX(O) 1.5, VXI, Creative"
            value={details.variant || ''}
            onChange={(e) => update('variant', e.target.value)}
            className="inp"
          />
        </FormField>

        <FormField label="Fuel Type" error={errors.fuelType}>
          <select
            value={details.fuelType || ''}
            onChange={(e) => update('fuelType', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Fuel Type...</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG / LPG">CNG / Hybrid CNG</option>
            <option value="Electric (EV)">Electric (EV)</option>
            <option value="Strong Hybrid">Strong Hybrid</option>
          </select>
        </FormField>

        <FormField label="Manufacturing Year" error={errors.mfgYear}>
          <select
            value={details.mfgYear || ''}
            onChange={(e) => update('mfgYear', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Year...</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </FormField>

        <FormField label="RTO Location" error={errors.rtoLocation}>
          <input
            type="text"
            list="rto-list"
            placeholder="e.g. TN-01 Chennai Central, TN-58 Madurai"
            value={details.rtoLocation || ''}
            onChange={(e) => update('rtoLocation', e.target.value)}
            className="inp"
          />
          <datalist id="rto-list">
            {TAMIL_NADU_RTO_SUGGESTIONS.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </FormField>

        <FormField label="Insurance Type" error={errors.insuranceType}>
          <select
            value={details.insuranceType || 'Comprehensive + Zero Depreciation'}
            onChange={(e) => update('insuranceType', e.target.value)}
            className="inp bg-white"
          >
            <option value="Comprehensive + Zero Depreciation">Comprehensive + Zero Depreciation (Recommended)</option>
            <option value="Standard Comprehensive Cover">Standard Comprehensive Cover</option>
            <option value="Third-Party Cover Only">Third-Party Cover Only</option>
            <option value="Standalone Own Damage (OD)">Standalone Own Damage (OD)</option>
          </select>
        </FormField>

        <FormField label="Existing Policy Status" error={errors.policyStatus}>
          <select
            value={details.policyStatus || ''}
            onChange={(e) => update('policyStatus', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Current Status...</option>
            <option value="Active - Expiring soon">Active - Expiring soon</option>
            <option value="Expired within 90 days">Expired within 90 days (NCB Valid)</option>
            <option value="Expired more than 90 days">Expired more than 90 days</option>
            <option value="Brand New Car">Brand New Car (No existing policy)</option>
          </select>
        </FormField>

        <FormField label="Policy Expiry Date (if applicable)" required={false}>
          <input
            type="date"
            value={details.expiryDate || ''}
            onChange={(e) => update('expiryDate', e.target.value)}
            className="inp"
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Previous Claims & No-Claim Bonus (NCB)" required={false}>
            <select
              value={details.previousClaims || 'No Claims - 20% NCB'}
              onChange={(e) => update('previousClaims', e.target.value)}
              className="inp bg-white"
            >
              <option value="No Claims - 0% NCB (New / 1st year)">No Claims - 0% NCB (New car or 1st year)</option>
              <option value="No Claims - 20% NCB">No Claims - 20% NCB (1 Claim-Free Year)</option>
              <option value="No Claims - 25% NCB">No Claims - 25% NCB (2 Claim-Free Years)</option>
              <option value="No Claims - 35% NCB">No Claims - 35% NCB (3 Claim-Free Years)</option>
              <option value="No Claims - 45% NCB">No Claims - 45% NCB (4 Claim-Free Years)</option>
              <option value="No Claims - 50% NCB">No Claims - 50% NCB (Maximum Discount)</option>
              <option value="Claim made in previous year (0% NCB)">Claim made in previous year (0% NCB)</option>
            </select>
          </FormField>
        </div>
      </div>
    );
  }

  // 2. BIKE INSURANCE FIELDS
  if (category === 'bike') {
    const models = POPULAR_BIKE_MODELS[details.manufacturer] || [];

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Vehicle Registration Number" error={errors.regNumber}>
          <input
            type="text"
            placeholder="e.g. TN 65 AB 5678"
            value={details.regNumber || ''}
            onChange={(e) => update('regNumber', e.target.value.toUpperCase())}
            className={`inp uppercase font-semibold tracking-wider ${errors.regNumber ? 'border-[#F51F2B]' : ''}`}
          />
        </FormField>

        <FormField label="Bike Manufacturer" error={errors.manufacturer}>
          <select
            value={details.manufacturer || ''}
            onChange={(e) => {
              update('manufacturer', e.target.value);
              update('model', '');
            }}
            className="inp bg-white"
          >
            <option value="">Select Manufacturer...</option>
            {BIKE_MANUFACTURERS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Bike Model" error={errors.model}>
          {models.length > 0 ? (
            <select
              value={details.model || ''}
              onChange={(e) => update('model', e.target.value)}
              className="inp bg-white"
            >
              <option value="">Select Model...</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="Other">Other Model</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder="e.g. Splendor Plus, Classic 350, Activa"
              value={details.model || ''}
              onChange={(e) => update('model', e.target.value)}
              className="inp"
            />
          )}
        </FormField>

        <FormField label="Engine Capacity (CC)" error={errors.engineCapacity}>
          <select
            value={details.engineCapacity || '100cc - 150cc'}
            onChange={(e) => update('engineCapacity', e.target.value)}
            className="inp bg-white"
          >
            <option value="Under 100cc">Under 100cc (e.g. TVS XL100)</option>
            <option value="100cc - 150cc">100cc - 150cc (e.g. Splendor, Activa, Shine)</option>
            <option value="150cc - 250cc">150cc - 250cc (e.g. Pulsar 150, FZ, Apache)</option>
            <option value="250cc - 350cc">250cc - 350cc (e.g. Classic 350, Hunter 350)</option>
            <option value="Above 350cc">Above 350cc (Superbikes / 400cc+)</option>
            <option value="Electric 2-Wheeler">Electric 2-Wheeler (EV)</option>
          </select>
        </FormField>

        <FormField label="Manufacturing Year" error={errors.mfgYear}>
          <select
            value={details.mfgYear || ''}
            onChange={(e) => update('mfgYear', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Year...</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </FormField>

        <FormField label="RTO Location" error={errors.rtoLocation}>
          <input
            type="text"
            list="rto-list"
            placeholder="e.g. TN-65 Ramanathapuram, TN-01 Chennai"
            value={details.rtoLocation || ''}
            onChange={(e) => update('rtoLocation', e.target.value)}
            className="inp"
          />
        </FormField>

        <FormField label="Insurance Type" error={errors.insuranceType}>
          <select
            value={details.insuranceType || 'Comprehensive 1-Year Plan'}
            onChange={(e) => update('insuranceType', e.target.value)}
            className="inp bg-white"
          >
            <option value="Comprehensive 1-Year Plan">Comprehensive (Own Damage + Third-Party)</option>
            <option value="Multi-Year Comprehensive (2 or 3 Years)">Multi-Year Comprehensive (2 or 3 Years)</option>
            <option value="Third-Party Only Cover">Third-Party Cover Only</option>
            <option value="Standalone Own Damage (OD)">Standalone Own Damage</option>
          </select>
        </FormField>

        <FormField label="Existing Policy Status" error={errors.policyStatus}>
          <select
            value={details.policyStatus || ''}
            onChange={(e) => update('policyStatus', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Status...</option>
            <option value="Active">Active (Renewal)</option>
            <option value="Expired within 90 days">Expired within 90 days</option>
            <option value="Expired more than 90 days">Expired &gt; 90 days</option>
            <option value="Brand New Bike">Brand New Bike</option>
          </select>
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Policy Expiry Date (if applicable)" required={false}>
            <input
              type="date"
              value={details.expiryDate || ''}
              onChange={(e) => update('expiryDate', e.target.value)}
              className="inp"
            />
          </FormField>
        </div>
      </div>
    );
  }

  // 3. COMMERCIAL VEHICLE INSURANCE FIELDS
  if (category === 'commercial') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Vehicle Registration Number" error={errors.regNumber}>
          <input
            type="text"
            placeholder="e.g. TN 58 AX 9012"
            value={details.regNumber || ''}
            onChange={(e) => update('regNumber', e.target.value.toUpperCase())}
            className={`inp uppercase font-semibold tracking-wider ${errors.regNumber ? 'border-[#F51F2B]' : ''}`}
          />
        </FormField>

        <FormField label="Vehicle Commercial Category" error={errors.vehicleCategory}>
          <select
            value={details.vehicleCategory || ''}
            onChange={(e) => update('vehicleCategory', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Category...</option>
            {COMMERCIAL_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Manufacturer" error={errors.manufacturer}>
          <select
            value={details.manufacturer || ''}
            onChange={(e) => update('manufacturer', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Manufacturer...</option>
            {COMMERCIAL_MANUFACTURERS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Vehicle Model" error={errors.model}>
          <input
            type="text"
            placeholder="e.g. Tata Ace, Bolero Maxi Truck, Eicher Pro 2049"
            value={details.model || ''}
            onChange={(e) => update('model', e.target.value)}
            className="inp"
          />
        </FormField>

        <FormField label="Manufacturing Year" error={errors.mfgYear}>
          <select
            value={details.mfgYear || ''}
            onChange={(e) => update('mfgYear', e.target.value)}
            className="inp bg-white"
          >
            <option value="">Select Year...</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Gross Vehicle Weight (GVW) / Seating Capacity" error={errors.gvwOrCapacity}>
          <input
            type="text"
            placeholder="e.g. 11,990 kg GVW or 32 Seats"
            value={details.gvwOrCapacity || ''}
            onChange={(e) => update('gvwOrCapacity', e.target.value)}
            className="inp"
          />
        </FormField>

        <FormField label="Vehicle Commercial Usage" error={errors.vehicleUsage}>
          <select
            value={details.vehicleUsage || 'Public Carrier (State / National Permit)'}
            onChange={(e) => update('vehicleUsage', e.target.value)}
            className="inp bg-white"
          >
            <option value="Public Carrier (State / National Permit)">Public Carrier (State / National Permit)</option>
            <option value="Private Carrier (Own Business Goods Transport)">Private Carrier (Own Business Goods)</option>
            <option value="Passenger Taxi / App Cab (Commercial)">Passenger Taxi / App Cab</option>
            <option value="Contract Carriage / Staff Transport">Contract Carriage / Staff Transport</option>
            <option value="School / Educational Institution Bus">School / Institution Bus</option>
            <option value="Agricultural / Farm Use">Agricultural / Farm Use</option>
          </select>
        </FormField>

        <FormField label="RTO Location" error={errors.rtoLocation}>
          <input
            type="text"
            list="rto-list"
            placeholder="e.g. TN-58 Madurai South, TN-63 Sivaganga"
            value={details.rtoLocation || ''}
            onChange={(e) => update('rtoLocation', e.target.value)}
            className="inp"
          />
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Existing Insurance & Insurer Information" required={false}>
            <input
              type="text"
              placeholder="e.g. National Insurance - Policy #421098, Expired 10 days ago"
              value={details.existingInsurance || ''}
              onChange={(e) => update('existingInsurance', e.target.value)}
              className="inp"
            />
          </FormField>
        </div>
      </div>
    );
  }

  // 4. COMBINED HEALTH + LIFE INSURANCE APPLICATION FORM
  if (category === 'health-life' || category === 'health' || category === 'life') {
    return (
      <div className="space-y-5">
        {/* Section A: Health Insurance Coverage */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAF8F5]/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#E5E7EB]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF1F2] text-[#F51F2B]">
              <HeartPulse size={16} />
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#101C38]">Health Protection & Hospitalization</h4>
              <p className="text-[11px] text-[#53627A]">Coverage for medical treatments, hospitalization & critical illness</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Health Plan Type" error={errors.planType}>
              <select
                value={details.planType || 'Family Floater (Self + Spouse + Children)'}
                onChange={(e) => update('planType', e.target.value)}
                className="inp bg-white"
              >
                <option value="Family Floater (Self + Spouse + Children)">Family Floater (Self + Spouse + Children)</option>
                <option value="Individual Cover (Single Person)">Individual Cover (Single Person)</option>
                <option value="Parents / Senior Citizen Plan">Parents / Senior Citizen Plan</option>
                <option value="Critical Illness + Personal Accident">Critical Illness + Personal Accident</option>
              </select>
            </FormField>

            <FormField label="Total Insured Family Members" error={errors.familyCount}>
              <select
                value={details.familyCount || '4 Members (Self + Spouse + 2 Children)'}
                onChange={(e) => update('familyCount', e.target.value)}
                className="inp bg-white"
              >
                <option value="1 Member (Self Only)">1 Member (Self Only)</option>
                <option value="2 Members (Self + Spouse)">2 Members (Self + Spouse)</option>
                <option value="3 Members (Self + Spouse + 1 Child)">3 Members (Self + Spouse + 1 Child)</option>
                <option value="4 Members (Self + Spouse + 2 Children)">4 Members (Self + Spouse + 2 Children)</option>
                <option value="5+ Members (Including Parents)">5+ Members (Including Parents)</option>
              </select>
            </FormField>

            <FormField label="Required Health Sum Insured" error={errors.sumInsured}>
              <select
                value={details.sumInsured || '₹10 Lakhs (Most Popular Family Cover)'}
                onChange={(e) => update('sumInsured', e.target.value)}
                className="inp bg-white font-semibold text-[#101C38]"
              >
                {HEALTH_SUM_INSURED.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>

            <FormField label="City & Pincode" error={errors.cityPincode}>
              <input
                type="text"
                placeholder="e.g. Paramakudi - 623707, Madurai"
                value={details.cityPincode || ''}
                onChange={(e) => update('cityPincode', e.target.value)}
                className={`inp ${errors.cityPincode ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Age of Each Member to be Covered" helpText="e.g. Self: 36, Spouse: 33, Child: 7">
                <input
                  type="text"
                  placeholder="e.g. Self: 36, Spouse: 33, Child 1: 8, Child 2: 4"
                  value={details.membersAges || ''}
                  onChange={(e) => update('membersAges', e.target.value)}
                  className="inp"
                />
              </FormField>
            </div>

            <div className="sm:col-span-2">
              <FormField label="Existing Medical Conditions / Health Declaration" required={false}>
                <input
                  type="text"
                  placeholder="e.g. None (Clean declaration) OR Diabetes, BP, porting existing policy"
                  value={details.existingConditions || ''}
                  onChange={(e) => update('existingConditions', e.target.value)}
                  className="inp"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Section B: Life & Term Financial Protection */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-[#FAF8F5]/80 p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-[#E5E7EB]">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FAF2DE] text-[#8C6D1F]">
              <Users size={16} />
            </span>
            <div>
              <h4 className="text-sm font-bold text-[#101C38]">Life & Term Financial Protection</h4>
              <p className="text-[11px] text-[#53627A]">High-cover term insurance to secure your family's future financial independence</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Primary Insured Date of Birth" error={errors.dob}>
              <input
                type="date"
                value={details.dob || ''}
                onChange={(e) => update('dob', e.target.value)}
                className={`inp ${errors.dob ? 'border-[#F51F2B] ring-1 ring-[#F51F2B]' : ''}`}
              />
            </FormField>

            <FormField label="Gender" error={errors.gender}>
              <select
                value={details.gender || 'Male'}
                onChange={(e) => update('gender', e.target.value)}
                className="inp bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female (Special Female Lower Premium Rate)</option>
                <option value="Other">Other</option>
              </select>
            </FormField>

            <FormField label="Annual Income Range" error={errors.annualIncome}>
              <select
                value={details.annualIncome || '₹5 Lakhs - ₹10 Lakhs'}
                onChange={(e) => update('annualIncome', e.target.value)}
                className={`inp bg-white ${errors.annualIncome ? 'border-[#F51F2B]' : ''}`}
              >
                {LIFE_INCOME_RANGES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Occupation Type" error={errors.occupation}>
              <select
                value={details.occupation || 'Salaried (Private / Govt)'}
                onChange={(e) => update('occupation', e.target.value)}
                className={`inp bg-white ${errors.occupation ? 'border-[#F51F2B]' : ''}`}
              >
                <option value="Salaried (Private / Govt)">Salaried (Private / Government)</option>
                <option value="Self-Employed / Business Owner">Self-Employed / Business Owner</option>
                <option value="Professional (Doctor, CA, Lawyer, Engineer)">Professional (Doctor, CA, Lawyer)</option>
                <option value="Agriculturist / Farmer">Agriculturist / Farmer</option>
                <option value="Homemaker">Homemaker</option>
                <option value="Student / Other">Student / Other</option>
              </select>
            </FormField>

            <FormField label="Required Life Coverage (Sum Assured)" error={errors.sumAssured}>
              <select
                value={details.sumAssured || '₹1 Crore (Recommended for ₹5-10L Income)'}
                onChange={(e) => update('sumAssured', e.target.value)}
                className="inp bg-white font-semibold text-[#101C38]"
              >
                {LIFE_SUM_ASSURED.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Policy Duration / Coverage Till Age" error={errors.policyDuration}>
              <select
                value={details.policyDuration || 'Till 70 Years'}
                onChange={(e) => update('policyDuration', e.target.value)}
                className="inp bg-white"
              >
                <option value="Till 60 Years (Retirement Age)">Till 60 Years (Retirement Age)</option>
                <option value="Till 65 Years">Till 65 Years</option>
                <option value="Till 70 Years">Till 70 Years (Most Popular)</option>
                <option value="Till 75 Years">Till 75 Years</option>
                <option value="Till 85 Years">Till 85 Years (Extended Cover)</option>
                <option value="Whole Life (Till Age 99 / 100)">Whole Life (Till Age 99 / 100)</option>
              </select>
            </FormField>

            <div className="sm:col-span-2">
              <FormField label="Do You Consume Tobacco or Nicotine?" error={errors.tobacco}>
                <select
                  value={details.tobacco || 'No (Non-Smoker - Maximum Discount)'}
                  onChange={(e) => update('tobacco', e.target.value)}
                  className="inp bg-white"
                >
                  <option value="No (Non-Smoker - Maximum Discount)">No (Non-Smoker - Upto 20% Discount)</option>
                  <option value="Yes (Smoker / Tobacco products)">Yes (Smoker / Tobacco products)</option>
                </select>
              </FormField>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

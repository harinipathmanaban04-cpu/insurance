import { validateVerificationProof } from '../_lib/token.js';
import { saveEnquiry } from '../_lib/store.js';

const CATEGORY_LABELS = {
  car: 'Car Insurance',
  bike: 'Bike Insurance',
  commercial: 'Commercial Vehicle Insurance',
  'health-life': 'Health + Life Insurance',
  'health+life': 'Health + Life Insurance',
  health_life: 'Health + Life Insurance',
  health: 'Health Insurance',
  life: 'Life Insurance',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { category, customer = {}, details = {}, verificationProof } = body;

    const cleanMobile = (customer.mobile || '').toString().trim().replace(/\D/g, '').slice(-10);

    // 1. Strict Server-Side Mobile Verification Enforcement
    const isProofValid = validateVerificationProof(verificationProof, cleanMobile);
    if (!isProofValid) {
      return res.status(403).json({
        success: false,
        error: 'Mobile number verification is required before final submission. Please complete OTP verification.',
      });
    }

    // 2. Validate Customer Details
    if (!customer.name || !customer.name.trim()) {
      return res.status(400).json({ success: false, error: 'Customer full name is required.' });
    }
    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ success: false, error: 'A valid 10-digit mobile number is required.' });
    }
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!customer.city || !customer.city.trim()) {
      return res.status(400).json({ success: false, error: 'City / location is required.' });
    }

    // 3. Validate Category
    const catKey = (category || 'car').toLowerCase();
    const categoryLabel = CATEGORY_LABELS[catKey] || 'General Insurance';

    // 4. Generate Unique Application ID (e.g. BIP-CAR-M8K4-9210)
    const code = catKey.slice(0, 4).toUpperCase();
    const timeHash = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `BIP-${code}-${timeHash}-${rand}`;

    // 5. Build Application Record
    const applicationRecord = {
      applicationId,
      category: catKey,
      categoryLabel,
      customer: {
        name: customer.name.trim(),
        mobile: cleanMobile,
        email: customer.email.trim(),
        city: customer.city.trim(),
      },
      details: { ...details },
      verifiedMobile: true,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date().toISOString(),
          note: `Online application submitted with verified mobile +91 ${cleanMobile}`,
        },
      ],
    };

    // 6. Save Record
    saveEnquiry(applicationRecord);

    // 7. Optional forward to Web3Forms / admin email (non-blocking)
    const web3Key = process.env.VITE_WEB3FORMS_ACCESS_KEY || process.env.WEB3FORMS_ACCESS_KEY;
    if (web3Key) {
      try {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `New ${categoryLabel} Application [${applicationId}] - THE BEST INSURANCE POINT`,
            from_name: 'THE BEST INSURANCE POINT Portal',
            email: customer.email.trim(),
            message: `New verified application received:\nApplication ID: ${applicationId}\nCategory: ${categoryLabel}\nCustomer: ${customer.name}\nMobile (Verified): ${cleanMobile}\nCity: ${customer.city}\n\nDetails:\n${JSON.stringify(details, null, 2)}`,
            botcheck: false,
          }),
        }).catch(() => {});
      } catch {}
    }

    return res.status(200).json({
      success: true,
      applicationId,
      category: catKey,
      categoryLabel,
      customer: applicationRecord.customer,
      createdAt: applicationRecord.createdAt,
      status: applicationRecord.status,
      message: 'Insurance application submitted and registered successfully.',
    });
  } catch (err) {
    console.error('[api/enquiries/submit exception]', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process application. Please try again or call our helpline.',
    });
  }
}

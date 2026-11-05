import { validateVerificationProof } from '../services/tokenService.js';
import { sendApplicationAdminNotification, sendCustomerConfirmationEmail } from '../services/emailService.js';
import { getApplicationModel } from '../models/Application.js';
import { getCustomerModel } from '../models/Customer.js';
import { CATEGORY_LABELS } from '../config/constants.js';
import { isDbConnected } from '../config/db.js';

// In-memory fallback repository
let inMemoryApplications = [
  {
    applicationId: 'BIP-CAR-TN01-4821',
    category: 'car',
    categoryLabel: 'Car Insurance',
    customer: {
      name: 'Karthik Subramanian',
      mobile: '9840123456',
      email: 'karthik.sub@gmail.com',
      city: 'Chennai',
    },
    details: {
      regNumber: 'TN 01 BK 4210',
      manufacturer: 'Hyundai',
      model: 'Creta',
      variant: 'SX(O) 1.5 Diesel',
      fuelType: 'Diesel',
      mfgYear: '2023',
      rtoLocation: 'Chennai Central (TN-01)',
      policyStatus: 'Active - Expiring in 15 days',
      insuranceType: 'Comprehensive + Zero Depreciation',
    },
    verifiedMobile: true,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), note: 'Application submitted online' },
    ],
  },
  {
    applicationId: 'BIP-BIKE-TN65-9104',
    category: 'bike',
    categoryLabel: 'Bike Insurance',
    customer: {
      name: 'Vigneshwaran M',
      mobile: '9789123456',
      email: 'vignesh.m@gmail.com',
      city: 'Ramanathapuram',
    },
    details: {
      regNumber: 'TN 65 AB 7891',
      manufacturer: 'Royal Enfield',
      model: 'Classic 350',
      engineCapacity: '150-350cc',
      mfgYear: '2022',
      rtoLocation: 'Ramanathapuram (TN-65)',
      insuranceType: 'Comprehensive Plan',
    },
    verifiedMobile: true,
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600 * 1000 * 14).toISOString(), note: 'Application submitted online' },
      { status: 'Contacted', timestamp: new Date(Date.now() - 3600 * 1000 * 10).toISOString(), note: 'Quotations shared via WhatsApp & Call' },
    ],
  },
];

export async function submitApplication(req, res, next) {
  try {
    const { category, customer = {}, details = {}, verificationProof } = req.body || {};
    const cleanMobile = (customer.mobile || '').toString().trim().replace(/\D/g, '').slice(-10);

    // 1. Strict Server-Side Mobile Verification Enforcement
    const isProofValid = validateVerificationProof(verificationProof, cleanMobile);
    if (!isProofValid) {
      return res.status(403).json({
        success: false,
        error: 'Mobile number verification is required before submission. Please verify your OTP.',
      });
    }

    // 2. Validate Customer Fields
    if (!customer.name || !customer.name.trim()) {
      return res.status(400).json({ success: false, error: 'Customer full name is required.' });
    }
    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({ success: false, error: 'A valid 10-digit Indian mobile number is required.' });
    }
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!customer.city || !customer.city.trim()) {
      return res.status(400).json({ success: false, error: 'City / location is required.' });
    }

    const catKey = (category || 'car').toLowerCase();
    const categoryLabel = CATEGORY_LABELS[catKey] || 'General Insurance';

    // 3. Generate Unique Application ID (e.g. BIP-CAR-M8K4-9210)
    const code = catKey.slice(0, 4).toUpperCase();
    const timeHash = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `BIP-${code}-${timeHash}-${rand}`;

    const newRecord = {
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

    // 4. Save to Database or Memory
    if (isDbConnected()) {
      try {
        const ApplicationModel = await getApplicationModel();
        const CustomerModel = await getCustomerModel();

        if (CustomerModel) {
          await CustomerModel.findOneAndUpdate(
            { mobile: cleanMobile },
            {
              name: customer.name.trim(),
              email: customer.email.trim(),
              city: customer.city.trim(),
              isMobileVerified: true,
            },
            { upsert: true, new: true }
          );
        }

        if (ApplicationModel) {
          await ApplicationModel.create(newRecord);
        }
      } catch (dbErr) {
        console.warn('[Application Controller] DB save error, using in-memory backup:', dbErr.message);
        inMemoryApplications.unshift(newRecord);
      }
    } else {
      inMemoryApplications.unshift(newRecord);
    }

    // 5. Send Brevo Transactional Emails (non-blocking)
    Promise.allSettled([
      sendApplicationAdminNotification(newRecord),
      sendCustomerConfirmationEmail(newRecord),
    ]).catch((err) => {
      console.warn('[Email Notification Warning]', err);
    });

    return res.status(200).json({
      success: true,
      applicationId,
      category: catKey,
      categoryLabel,
      customer: newRecord.customer,
      createdAt: newRecord.createdAt,
      status: newRecord.status,
      message: 'Insurance application submitted and registered successfully.',
    });
  } catch (err) {
    next(err);
  }
}

export async function listApplications(req, res, next) {
  try {
    const { category, status, search } = req.query || {};

    let list = [];
    if (isDbConnected()) {
      try {
        const ApplicationModel = await getApplicationModel();
        if (ApplicationModel) {
          const filter = {};
          if (category && category !== 'all') filter.category = category;
          if (status && status !== 'all') filter.status = new RegExp(`^${status}$`, 'i');
          if (search && search.trim()) {
            const regex = new RegExp(search.trim(), 'i');
            filter.$or = [
              { applicationId: regex },
              { 'customer.name': regex },
              { 'customer.mobile': regex },
              { 'details.regNumber': regex },
            ];
          }
          list = await ApplicationModel.find(filter).sort({ createdAt: -1 }).lean();
        }
      } catch (err) {
        console.warn('[Application Controller] DB read failed, using memory:', err.message);
        list = [...inMemoryApplications];
      }
    } else {
      list = [...inMemoryApplications];
      if (category && category !== 'all') list = list.filter((e) => e.category === category);
      if (status && status !== 'all') list = list.filter((e) => e.status.toLowerCase() === status.toLowerCase());
      if (search && search.trim()) {
        const s = search.trim().toLowerCase();
        list = list.filter(
          (e) =>
            e.applicationId.toLowerCase().includes(s) ||
            e.customer.name.toLowerCase().includes(s) ||
            e.customer.mobile.includes(s) ||
            (e.details?.regNumber && e.details.regNumber.toLowerCase().includes(s))
        );
      }
    }

    const all = isDbConnected() ? list : inMemoryApplications;
    const stats = {
      total: all.length,
      pending: all.filter((e) => e.status?.toLowerCase() === 'pending').length,
      contacted: all.filter((e) => e.status?.toLowerCase() === 'contacted').length,
      underReview: all.filter((e) => e.status?.toLowerCase() === 'under review').length,
      completed: all.filter((e) => e.status?.toLowerCase() === 'completed').length,
      verifiedRate: '100%',
    };

    return res.status(200).json({
      success: true,
      stats,
      count: list.length,
      enquiries: list,
      applications: list,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, note } = req.body || {};

    if (!status) {
      return res.status(400).json({ success: false, error: 'Status is required.' });
    }

    let updated = null;
    const historyItem = {
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status}`,
    };

    if (isDbConnected()) {
      try {
        const ApplicationModel = await getApplicationModel();
        if (ApplicationModel) {
          updated = await ApplicationModel.findOneAndUpdate(
            { applicationId: id },
            {
              $set: { status },
              $push: { statusHistory: { $each: [historyItem], $position: 0 } },
            },
            { new: true }
          ).lean();
        }
      } catch {}
    }

    if (!updated) {
      const memItem = inMemoryApplications.find((e) => e.applicationId === id);
      if (memItem) {
        memItem.status = status;
        memItem.statusHistory = memItem.statusHistory || [];
        memItem.statusHistory.unshift(historyItem);
        updated = memItem;
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: `Application ${id} not found.` });
    }

    return res.status(200).json({
      success: true,
      enquiry: updated,
      application: updated,
      message: `Status updated to ${status}.`,
    });
  } catch (err) {
    next(err);
  }
}

export default {
  submitApplication,
  listApplications,
  updateApplicationStatus,
};

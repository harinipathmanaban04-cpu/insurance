import { getEnquiryModel } from '../models/Enquiry.js';
import { isDbConnected } from '../config/db.js';
import {
  sendEnquiryAdminNotification,
  sendEnquiryCustomerAcknowledgement,
} from '../services/emailService.js';

// In-memory fallback repository when MongoDB is not connected
let inMemoryEnquiries = [];

/**
 * Handle new insurance enquiry submission from the Contact page
 */
export async function submitEnquiry(req, res, next) {
  try {
    const {
      name: rawName,
      mobile: rawMobile,
      email: rawEmail,
      city: rawCity,
      insuranceType: rawType,
      subject: rawSubject,
      message: rawMessage,
    } = req.body || {};

    const name = (rawName || '').toString().trim();
    const cleanMobile = (rawMobile || '').toString().trim().replace(/\D/g, '').slice(-10);
    const email = (rawEmail || '').toString().trim().toLowerCase();
    const city = (rawCity || '').toString().trim();
    const insuranceType = (rawType || 'General Insurance').toString().trim();
    const subject = (rawSubject || '').toString().trim();
    const message = (rawMessage || '').toString().trim();

    // 1. Validation
    if (!name || name.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your full name (minimum 2 characters).',
      });
    }

    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      });
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'Please enter your city or location.',
      });
    }

    if (!subject) {
      return res.status(400).json({
        success: false,
        error: 'Please enter an enquiry subject.',
      });
    }

    if (!message || message.length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Please describe your insurance requirements (minimum 5 characters).',
      });
    }

    // 2. Generate unique Enquiry ID
    const timeHash = Date.now().toString(36).slice(-4).toUpperCase();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const enquiryId = `BIP-ENQ-${timeHash}-${rand}`;

    const newEnquiry = {
      enquiryId,
      name,
      mobile: cleanMobile,
      email,
      city,
      insuranceType,
      category: insuranceType.toLowerCase().includes('car')
        ? 'car'
        : insuranceType.toLowerCase().includes('bike')
        ? 'bike'
        : insuranceType.toLowerCase().includes('comm')
        ? 'commercial'
        : 'health-life',
      subject,
      message,
      status: 'Pending',
      source: 'Contact Page Insurance Enquiry',
      type: insuranceType,
      createdAt: new Date().toISOString(),
    };

    // 3. Save to MongoDB or in-memory fallback
    if (isDbConnected()) {
      try {
        const EnquiryModel = await getEnquiryModel();
        if (EnquiryModel) {
          await EnquiryModel.create(newEnquiry);
        }
      } catch (dbErr) {
        console.warn('[Enquiry Controller] DB Save Warning:', dbErr.message);
        inMemoryEnquiries.unshift(newEnquiry);
      }
    } else {
      inMemoryEnquiries.unshift(newEnquiry);
    }

    // 4. Send Brevo email notifications asynchronously
    sendEnquiryAdminNotification(newEnquiry).catch((err) => {
      console.warn('[Enquiry Admin Notification Error]', err.message);
    });

    sendEnquiryCustomerAcknowledgement(newEnquiry).catch((err) => {
      console.warn('[Enquiry Customer Acknowledgement Error]', err.message);
    });

    return res.status(200).json({
      success: true,
      enquiryId,
      enquiry: {
        enquiryId,
        name,
        email,
        mobile: cleanMobile,
        insuranceType,
        status: 'Pending',
        createdAt: newEnquiry.createdAt,
      },
      message: 'Your insurance enquiry has been registered successfully. Our insurance advisor will contact you within 2 working hours.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * List enquiries for admin dashboard
 */
export async function listEnquiries(req, res, next) {
  try {
    if (isDbConnected()) {
      const EnquiryModel = await getEnquiryModel();
      if (EnquiryModel) {
        const list = await EnquiryModel.find().sort({ createdAt: -1 }).limit(100).lean();
        return res.status(200).json({ success: true, count: list.length, enquiries: list });
      }
    }
    return res.status(200).json({
      success: true,
      count: inMemoryEnquiries.length,
      enquiries: inMemoryEnquiries,
    });
  } catch (err) {
    next(err);
  }
}

export default {
  submitEnquiry,
  listEnquiries,
};

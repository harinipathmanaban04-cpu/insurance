import { sendCallbackAdminNotification } from '../services/emailService.js';
import { getEnquiryModel } from '../models/Enquiry.js';
import { isDbConnected } from '../config/db.js';

export async function submitCallback(req, res, next) {
  try {
    const { email: rawEmail, name, message } = req.body || {};
    const email = (rawEmail || '').toString().trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.',
      });
    }

    if (isDbConnected()) {
      try {
        const EnquiryModel = await getEnquiryModel();
        if (EnquiryModel) {
          await EnquiryModel.create({
            email,
            type: 'Footer Request Callback',
            message: message || `Callback requested by ${email}`,
            status: 'Pending',
          });
        }
      } catch (err) {
        console.warn('[Callback Controller] DB save error:', err.message);
      }
    }

    // Send Brevo notification to admin email
    sendCallbackAdminNotification({ email, message }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: 'Callback request registered successfully. Our advisor will contact you shortly.',
    });
  } catch (err) {
    next(err);
  }
}

export default {
  submitCallback,
};

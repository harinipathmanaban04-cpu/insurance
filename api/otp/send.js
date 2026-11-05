import crypto from 'crypto';
import { createOtpSession } from '../_lib/token.js';
import { sendRealSmsOtp } from '../_lib/sms.js';

// In-memory rate limiting map: mobile -> { lastSent, count, windowStart }
const rateLimitMap = new Map();

export default async function handler(req, res) {
  // Set CORS headers
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
    const rawMobile = (body.mobile || '').toString().trim();
    const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);

    // Validate 10-digit Indian Mobile Number
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      });
    }

    // Rate Limiting check
    const now = Date.now();
    const rateData = rateLimitMap.get(cleanMobile) || { count: 0, lastSent: 0, windowStart: now };

    // Reset window every 15 minutes
    if (now - rateData.windowStart > 15 * 60 * 1000) {
      rateData.count = 0;
      rateData.windowStart = now;
    }

    // Cooldown check (minimum 35 seconds between sends)
    if (now - rateData.lastSent < 35 * 1000) {
      const waitSec = Math.ceil((35 * 1000 - (now - rateData.lastSent)) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${waitSec} seconds before requesting a new OTP.`,
        cooldownRemaining: waitSec,
      });
    }

    // Max 5 OTPs per 15-minute window
    if (rateData.count >= 5) {
      return res.status(429).json({
        success: false,
        error: 'Too many OTP requests for this mobile number. Please try again after 15 minutes or contact support.',
      });
    }

    // Generate cryptographically secure 6-digit numeric OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Dispatch SMS through real SMS Gateway
    const smsResult = await sendRealSmsOtp({ mobile: cleanMobile, otp });
    if (!smsResult.success) {
      return res.status(502).json({
        success: false,
        error: smsResult.error || 'Unable to deliver SMS OTP right now. Please try again or call us.',
      });
    }

    // Update rate limit state
    rateData.count += 1;
    rateData.lastSent = now;
    rateLimitMap.set(cleanMobile, rateData);

    // Create secure cryptographic session token (HMAC-SHA256)
    const { token, expiresAt } = createOtpSession({
      mobile: cleanMobile,
      otp,
      sessionId: smsResult.sessionId || null,
    });

    const maskedMobile = `+91 ${cleanMobile.slice(0, 2)}••••••${cleanMobile.slice(8)}`;

    return res.status(200).json({
      success: true,
      token,
      expiresAt,
      expiresInSeconds: 300, // 5 minutes
      cooldownSeconds: 45,
      maskedMobile,
      message: `OTP sent successfully to ${maskedMobile}. Valid for 5 minutes.`,
    });
  } catch (err) {
    console.error('[api/otp/send exception]', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while generating OTP. Please try again.',
    });
  }
}

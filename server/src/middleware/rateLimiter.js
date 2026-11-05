import { OTP_CONFIG } from '../config/constants.js';

const ipStore = new Map();
const mobileStore = new Map();

/**
 * Clean up expired rate limiting entries
 */
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipStore.entries()) {
    if (now - record.windowStart > OTP_CONFIG.RATE_LIMIT_WINDOW_MS) {
      ipStore.delete(key);
    }
  }
  for (const [key, record] of mobileStore.entries()) {
    if (now - record.windowStart > OTP_CONFIG.RATE_LIMIT_WINDOW_MS) {
      mobileStore.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (cleanupInterval.unref) cleanupInterval.unref();

export function otpRateLimiter(req, res, next) {
  const rawMobile = (req.body?.mobile || '').toString().trim();
  const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);
  const clientIp = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

  const now = Date.now();

  // 1. Mobile-based limiter
  if (cleanMobile) {
    const mRecord = mobileStore.get(cleanMobile) || { count: 0, lastSent: 0, windowStart: now };
    if (now - mRecord.windowStart > OTP_CONFIG.RATE_LIMIT_WINDOW_MS) {
      mRecord.count = 0;
      mRecord.windowStart = now;
    }

    // Cooldown check (minimum 40s between OTP dispatches)
    const elapsed = now - mRecord.lastSent;
    if (elapsed < OTP_CONFIG.COOLDOWN_SECONDS * 1000) {
      const remainingSec = Math.ceil((OTP_CONFIG.COOLDOWN_SECONDS * 1000 - elapsed) / 1000);
      return res.status(429).json({
        success: false,
        error: `Please wait ${remainingSec} seconds before requesting a new OTP.`,
        cooldownRemaining: remainingSec,
      });
    }

    if (mRecord.count >= OTP_CONFIG.RATE_LIMIT_MAX_PER_WINDOW) {
      return res.status(429).json({
        success: false,
        error: 'Too many OTP requests for this mobile number. Please try again after 15 minutes.',
      });
    }

    req._mobileRateRecord = mRecord;
  }

  // 2. IP-based limiter (max 20 requests per 15 minutes)
  const ipRecord = ipStore.get(clientIp) || { count: 0, windowStart: now };
  if (now - ipRecord.windowStart > OTP_CONFIG.RATE_LIMIT_WINDOW_MS) {
    ipRecord.count = 0;
    ipRecord.windowStart = now;
  }
  if (ipRecord.count >= 20) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests from your network. Please try again later.',
    });
  }

  ipRecord.count += 1;
  ipStore.set(clientIp, ipRecord);

  next();
}

export function recordOtpSent(mobile) {
  const cleanMobile = (mobile || '').toString().trim().replace(/\D/g, '').slice(-10);
  if (!cleanMobile) return;
  const now = Date.now();
  const record = mobileStore.get(cleanMobile) || { count: 0, lastSent: 0, windowStart: now };
  record.count += 1;
  record.lastSent = now;
  mobileStore.set(cleanMobile, record);
}

const enquiryStore = new Map();

export function enquiryRateLimiter(req, res, next) {
  const clientIp = req.headers?.['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
  const email = (req.body?.email || '').toString().trim().toLowerCase();
  const now = Date.now();
  const key = `${clientIp}_${email}`;

  const record = enquiryStore.get(key) || { count: 0, windowStart: now };
  if (now - record.windowStart > 15 * 60 * 1000) {
    record.count = 0;
    record.windowStart = now;
  }

  if (record.count >= 10) {
    return res.status(429).json({
      success: false,
      error: 'You have submitted multiple enquiries recently. Please wait a few minutes or call our helpline directly.',
    });
  }

  record.count += 1;
  enquiryStore.set(key, record);
  next();
}

export default {
  otpRateLimiter,
  recordOtpSent,
  enquiryRateLimiter,
};

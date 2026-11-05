import crypto from 'crypto';
import { parseAndVerifyToken, hashOtp, decrementAttempts, createVerificationProof } from '../_lib/token.js';
import { verifyWith2Factor } from '../_lib/sms.js';

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
    const { token, mobile: rawMobile, otp: rawOtp } = body;

    const cleanMobile = (rawMobile || '').toString().trim().replace(/\D/g, '').slice(-10);
    const cleanOtp = (rawOtp || '').toString().trim();

    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 6-digit numeric OTP code.',
      });
    }

    // Verify session token authenticity and expiration
    const tokenResult = parseAndVerifyToken(token);
    if (!tokenResult.valid) {
      return res.status(400).json({
        success: false,
        expired: tokenResult.expired || false,
        error: tokenResult.error || 'Verification session is invalid or expired. Please request a new OTP.',
      });
    }

    const { payload } = tokenResult;

    // Check if mobile matches session
    if (payload.mobile !== cleanMobile) {
      return res.status(400).json({
        success: false,
        error: 'The mobile number does not match the active OTP session.',
      });
    }

    // Check attempts
    if (payload.attemptsLeft <= 0) {
      return res.status(403).json({
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.',
      });
    }

    let isMatch = false;

    // If 2Factor session was used, check via 2Factor verify API first
    if (payload.sessionId) {
      const twoFactorMatch = await verifyWith2Factor(payload.sessionId, cleanOtp);
      if (twoFactorMatch === true) isMatch = true;
    }

    // Standard HMAC hash verification
    if (!isMatch) {
      const computedHash = hashOtp(cleanOtp, payload.salt);
      isMatch = crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(payload.hashedOtp, 'hex')
      );
    }

    if (isMatch) {
      // Create cryptographically signed proof token to authorise final application submission
      const verificationProof = createVerificationProof(cleanMobile);
      return res.status(200).json({
        success: true,
        verified: true,
        mobile: cleanMobile,
        verificationProof,
        message: 'Mobile number verified successfully!',
      });
    }

    // Decrement remaining attempts
    const updatedToken = decrementAttempts(payload);
    const remaining = payload.attemptsLeft;

    return res.status(400).json({
      success: false,
      verified: false,
      updatedToken,
      attemptsLeft: remaining,
      error: remaining > 0
        ? `Incorrect OTP. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`
        : 'Incorrect OTP. Maximum attempts reached. Please request a new OTP.',
    });
  } catch (err) {
    console.error('[api/otp/verify exception]', err);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during verification. Please try again.',
    });
  }
}

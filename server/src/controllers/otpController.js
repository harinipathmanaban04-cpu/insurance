import crypto from 'crypto';
import { createOtpSession, parseAndVerifyToken, hashOtp, decrementAttempts, createVerificationProof } from '../services/tokenService.js';
import { sendRealSmsOtp, verifyWith2Factor } from '../services/smsService.js';
import { recordOtpSent } from '../middleware/rateLimiter.js';
import { getOtpVerificationModel } from '../models/OtpVerification.js';
import { isDbConnected } from '../config/db.js';

export async function sendOtp(req, res, next) {
  try {
    const rawMobile = (req.body?.mobile || '').toString().trim();
    const cleanMobile = rawMobile.replace(/\D/g, '').slice(-10);

    if (!cleanMobile || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.',
      });
    }

    // Generate secure 6-digit OTP
    const otp = crypto.randomInt(100000, 1000000).toString();

    // Send real SMS
    const smsResult = await sendRealSmsOtp({ mobile: cleanMobile, otp });
    if (!smsResult.success) {
      return res.status(502).json({
        success: false,
        error: smsResult.error || 'Failed to dispatch SMS OTP. Please check your network or try again.',
      });
    }

    // Record rate limiting
    recordOtpSent(cleanMobile);

    // Create signed token
    const session = createOtpSession({
      mobile: cleanMobile,
      otp,
      sessionId: smsResult.sessionId || null,
    });

    // Optionally save in MongoDB if connected
    if (isDbConnected()) {
      try {
        const OtpModel = await getOtpVerificationModel();
        if (OtpModel) {
          await OtpModel.create({
            mobile: cleanMobile,
            hashedOtp: session.hashedOtp,
            salt: session.salt,
            expiresAt: new Date(session.expiresAt),
            sessionId: smsResult.sessionId || null,
          });
        }
      } catch (dbErr) {
        console.warn('[OTP Controller] Non-fatal DB record error:', dbErr.message);
      }
    }

    const maskedMobile = `+91 ${cleanMobile.slice(0, 2)}••••••${cleanMobile.slice(8)}`;

    return res.status(200).json({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      expiresInSeconds: 300,
      cooldownSeconds: 45,
      maskedMobile,
      message: `OTP sent successfully to ${maskedMobile}. Valid for 5 minutes.`,
    });
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const { token, mobile: rawMobile, otp: rawOtp } = req.body || {};
    const cleanMobile = (rawMobile || '').toString().trim().replace(/\D/g, '').slice(-10);
    const cleanOtp = (rawOtp || '').toString().trim();

    if (!cleanOtp || cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 6-digit numeric OTP code.',
      });
    }

    // Validate token HMAC
    const tokenResult = parseAndVerifyToken(token);
    if (!tokenResult.valid) {
      return res.status(400).json({
        success: false,
        expired: tokenResult.expired || false,
        error: tokenResult.error || 'Session token is invalid or expired. Please request a new OTP.',
      });
    }

    const { payload } = tokenResult;

    if (payload.mobile !== cleanMobile) {
      return res.status(400).json({
        success: false,
        error: 'Mobile number does not match the active OTP session.',
      });
    }

    if (payload.attemptsLeft <= 0) {
      return res.status(403).json({
        success: false,
        error: 'Maximum verification attempts exceeded. Please request a new OTP.',
      });
    }

    let isMatch = false;

    // Check 2Factor gateway if active session exists
    if (payload.sessionId) {
      const twoFactorMatch = await verifyWith2Factor(payload.sessionId, cleanOtp);
      if (twoFactorMatch === true) isMatch = true;
    }

    // Compare with HMAC hash in constant time
    if (!isMatch) {
      const computedHash = hashOtp(cleanOtp, payload.salt);
      isMatch = crypto.timingSafeEqual(
        Buffer.from(computedHash, 'hex'),
        Buffer.from(payload.hashedOtp, 'hex')
      );
    }

    if (isMatch) {
      const verificationProof = createVerificationProof(cleanMobile);

      if (isDbConnected()) {
        try {
          const OtpModel = await getOtpVerificationModel();
          if (OtpModel) {
            await OtpModel.updateMany({ mobile: cleanMobile }, { verified: true });
          }
        } catch {}
      }

      return res.status(200).json({
        success: true,
        verified: true,
        mobile: cleanMobile,
        verificationProof,
        message: 'Mobile number verified successfully!',
      });
    }

    // Mismatch - decrement attempts
    const updatedToken = decrementAttempts(payload);
    const remaining = payload.attemptsLeft;

    return res.status(400).json({
      success: false,
      verified: false,
      updatedToken,
      attemptsLeft: remaining,
      error:
        remaining > 0
          ? `Incorrect OTP. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`
          : 'Incorrect OTP. Maximum attempts reached. Please request a new OTP.',
    });
  } catch (err) {
    next(err);
  }
}

export default {
  sendOtp,
  verifyOtp,
};

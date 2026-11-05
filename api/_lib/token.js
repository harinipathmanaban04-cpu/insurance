import crypto from 'crypto';

// Secret used for HMAC-SHA256 signatures. In production, configure OTP_SECRET in environment variables.
const SECRET = process.env.OTP_SECRET || 'bip_secure_insurance_otp_secret_2026_x87b';
const TOKEN_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes strictly as required
const PROOF_EXPIRY_MS = 15 * 60 * 1000; // 15 minutes to complete form submission after verification

/**
 * Hash an OTP using SHA-256 with server salt
 */
export function hashOtp(otp, salt) {
  return crypto.createHmac('sha256', SECRET).update(`${salt}:${otp}`).digest('hex');
}

/**
 * Creates a signed verification session token containing mobile and hashed OTP
 */
export function createOtpSession({ mobile, otp, sessionId = null }) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedOtp = hashOtp(otp, salt);
  const expiresAt = Date.now() + TOKEN_EXPIRY_MS;

  const payload = {
    mobile,
    salt,
    hashedOtp,
    expiresAt,
    attemptsLeft: 3,
    sessionId, // used if 2Factor or external gateway session is present
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64url');

  return {
    token: `${payloadStr}.${signature}`,
    expiresAt,
  };
}

/**
 * Decodes and validates a session token
 */
export function parseAndVerifyToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) {
    return { valid: false, error: 'Invalid or missing verification session token.' };
  }

  const [payloadStr, signature] = token.split('.');
  const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64url');

  if (signature !== expectedSig) {
    return { valid: false, error: 'Session signature verification failed (tampered token).' };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, expired: true, error: 'OTP has expired after 5 minutes. Please request a new OTP.' };
    }
    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Malformed session token payload.' };
  }
}

/**
 * Updates attempts in an existing token
 */
export function decrementAttempts(payload) {
  payload.attemptsLeft = Math.max(0, (payload.attemptsLeft || 3) - 1);
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

/**
 * Creates a cryptographically signed proof token once OTP verification succeeds.
 * Submitted with the final application so the backend knows the mobile number was genuinely verified.
 */
export function createVerificationProof(mobile) {
  const payload = {
    mobile,
    verified: true,
    verifiedAt: Date.now(),
    expiresAt: Date.now() + PROOF_EXPIRY_MS,
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

/**
 * Validates a mobile verification proof token during final form submission
 */
export function validateVerificationProof(proof, expectedMobile) {
  if (!proof || typeof proof !== 'string' || !proof.includes('.')) {
    return false;
  }
  const [payloadStr, signature] = proof.split('.');
  const expectedSig = crypto.createHmac('sha256', SECRET).update(payloadStr).digest('base64url');
  if (signature !== expectedSig) return false;

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) return false;
    if (!payload.verified) return false;
    if (payload.mobile !== expectedMobile) return false;
    return true;
  } catch {
    return false;
  }
}

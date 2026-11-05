/**
 * Real SMS Gateway Adapter for Indian Mobile OTP Delivery.
 * Supports:
 * - 2Factor.in (TWOFACTOR_API_KEY)
 * - MSG91 (MSG91_AUTH_KEY + MSG91_TEMPLATE_ID)
 * - Fast2SMS (FAST2SMS_API_KEY)
 * - Custom HTTP SMS Webhook (SMS_GATEWAY_URL)
 */

export async function sendRealSmsOtp({ mobile, otp }) {
  const twoFactorKey = process.env.TWOFACTOR_API_KEY;
  const msg91Key = process.env.MSG91_AUTH_KEY;
  const msg91Template = process.env.MSG91_TEMPLATE_ID;
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;
  const customGateway = process.env.SMS_GATEWAY_URL;

  // 1. 2Factor.in Provider
  if (twoFactorKey) {
    try {
      const template = process.env.TWOFACTOR_TEMPLATE_NAME || '';
      const url = template
        ? `https://2factor.in/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/+91${encodeURIComponent(mobile)}/${encodeURIComponent(otp)}/${encodeURIComponent(template)}`
        : `https://2factor.in/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/+91${encodeURIComponent(mobile)}/${encodeURIComponent(otp)}`;

      const res = await fetch(url, { method: 'GET' });
      const data = await res.json().catch(() => ({}));
      if (data.Status === 'Success') {
        return {
          success: true,
          provider: '2factor',
          sessionId: data.Details,
          message: 'OTP delivered via 2Factor SMS gateway.',
        };
      }
      console.error('[2Factor Error]', data);
      return { success: false, error: data.Details || 'Failed to dispatch SMS via 2Factor.' };
    } catch (err) {
      console.error('[2Factor Network Exception]', err);
      return { success: false, error: 'SMS Gateway connection failure.' };
    }
  }

  // 2. MSG91 Provider
  if (msg91Key) {
    try {
      const templateId = msg91Template || '';
      const url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=91${encodeURIComponent(mobile)}&authkey=${encodeURIComponent(msg91Key)}&otp=${encodeURIComponent(otp)}`;
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json().catch(() => ({}));
      if (data.type === 'success' || data.status === 'success') {
        return {
          success: true,
          provider: 'msg91',
          message: 'OTP delivered via MSG91 SMS gateway.',
        };
      }
      console.error('[MSG91 Error]', data);
      return { success: false, error: data.message || 'Failed to dispatch SMS via MSG91.' };
    } catch (err) {
      console.error('[MSG91 Network Exception]', err);
      return { success: false, error: 'MSG91 connection failure.' };
    }
  }

  // 3. Fast2SMS Provider
  if (fast2SmsKey) {
    try {
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2SmsKey)}&variables_values=${encodeURIComponent(otp)}&route=otp&numbers=${encodeURIComponent(mobile)}`;
      const res = await fetch(url, { method: 'GET' });
      const data = await res.json().catch(() => ({}));
      if (data.return === true) {
        return {
          success: true,
          provider: 'fast2sms',
          message: 'OTP delivered via Fast2SMS gateway.',
        };
      }
      console.error('[Fast2SMS Error]', data);
      return { success: false, error: data.message?.[0] || 'Fast2SMS dispatch failed.' };
    } catch (err) {
      console.error('[Fast2SMS Network Exception]', err);
      return { success: false, error: 'Fast2SMS connection failure.' };
    }
  }

  // 4. Custom SMS Gateway URL (if configured)
  if (customGateway) {
    try {
      const formattedUrl = customGateway
        .replace('{mobile}', mobile)
        .replace('{otp}', otp);
      const res = await fetch(formattedUrl);
      return { success: res.ok, provider: 'custom', message: 'OTP dispatched via custom gateway.' };
    } catch (err) {
      return { success: false, error: 'Custom gateway failure.' };
    }
  }

  // 5. Development / Testing Mode (When no SMS API key is configured in env)
  // Secure: OTP is printed only to server terminal, NEVER returned in API response JSON!
  console.log(`\n======================================================`);
  console.log(`[SMS GATEWAY - DEVELOPMENT MODE]`);
  console.log(`Recipient: +91 ${mobile}`);
  console.log(`Secure 6-digit OTP: ${otp}`);
  console.log(`Status: Simulated SMS dispatch (Set TWOFACTOR_API_KEY in Vercel to activate real SMS)`);
  console.log(`======================================================\n`);

  return {
    success: true,
    provider: 'development',
    message: 'SMS sent to mobile number (development mode active).',
  };
}

/**
 * Optional 2Factor direct verification if session exists
 */
export async function verifyWith2Factor(sessionId, otp) {
  const twoFactorKey = process.env.TWOFACTOR_API_KEY;
  if (!twoFactorKey || !sessionId) return null;

  try {
    const url = `https://2factor.in/API/V1/${encodeURIComponent(twoFactorKey)}/SMS/VERIFY/${encodeURIComponent(sessionId)}/${encodeURIComponent(otp)}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (data.Status === 'Success' && data.Details === 'OTP Matched') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

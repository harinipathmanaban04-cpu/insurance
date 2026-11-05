import { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Phone, CheckCircle2, AlertCircle, RefreshCw, Loader2, Edit2 } from 'lucide-react';

export default function MobileOtpVerification({
  mobile,
  onMobileChange,
  onVerified,
  isVerified,
  verifiedProof,
}) {
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [sessionToken, setSessionToken] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [expirySec, setExpirySec] = useState(300); // 5 minutes
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [tempMobile, setTempMobile] = useState(mobile || '');

  const inputRefs = useRef([]);

  // Countdown timer for resend cooldown and 5-min expiry
  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((c) => Math.max(0, c - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    let timer = null;
    if (sessionToken && expirySec > 0 && !isVerified) {
      timer = setInterval(() => {
        setExpirySec((sec) => {
          if (sec <= 1) {
            setErrorMsg('OTP has expired after 5 minutes. Please request a new OTP.');
            return 0;
          }
          return sec - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionToken, expirySec, isVerified]);

  // Trigger Send OTP
  const handleSendOtp = async (targetMobile = mobile) => {
    const cleanMobile = (targetMobile || '').toString().trim().replace(/\D/g, '').slice(-10);
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSending(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: cleanMobile }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSessionToken(data.token);
        setCooldown(data.cooldownSeconds || 45);
        setExpirySec(data.expiresInSeconds || 300);
        setAttemptsLeft(3);
        setOtpValues(['', '', '', '', '', '']);
        setInfoMsg(data.message || `OTP sent to ${data.maskedMobile}`);
        setIsEditingMobile(false);

        // Auto-focus first input box
        setTimeout(() => {
          if (inputRefs.current[0]) inputRefs.current[0].focus();
        }, 150);
      } else {
        setErrorMsg(data.error || 'Failed to send OTP. Please try again.');
        if (data.cooldownRemaining) setCooldown(data.cooldownRemaining);
      }
    } catch {
      setErrorMsg('Network error connecting to OTP verification server. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  // Handle individual digit input
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...otpValues];
    updated[index] = digit;
    setOtpValues(updated);

    if (errorMsg) setErrorMsg('');

    // Auto-focus next input
    if (digit && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-trigger verification when 6 digits are entered
    const fullOtp = updated.join('');
    if (fullOtp.length === 6 && !updated.includes('')) {
      handleVerifyOtp(fullOtp);
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste support (splits 6 digits across boxes)
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const updated = [...otpValues];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setOtpValues(updated);

    if (pasted.length === 6) {
      handleVerifyOtp(pasted);
    } else {
      const nextIdx = Math.min(pasted.length, 5);
      if (inputRefs.current[nextIdx]) inputRefs.current[nextIdx].focus();
    }
  };

  // Trigger Backend Verify OTP
  const handleVerifyOtp = async (otpToVerify = otpValues.join('')) => {
    if (isVerifying || isVerified) return;
    if (!sessionToken) {
      setErrorMsg('Please request an OTP first.');
      return;
    }
    if (otpToVerify.length !== 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: sessionToken,
          mobile: mobile.replace(/\D/g, '').slice(-10),
          otp: otpToVerify,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.verified) {
        setInfoMsg('Mobile number verified successfully!');
        if (onVerified) {
          onVerified({
            verified: true,
            proof: data.verificationProof,
            mobile: data.mobile,
          });
        }
      } else {
        if (data.updatedToken) setSessionToken(data.updatedToken);
        if (typeof data.attemptsLeft === 'number') setAttemptsLeft(data.attemptsLeft);
        setErrorMsg(data.error || 'Invalid OTP code. Please check and re-enter.');
      }
    } catch {
      setErrorMsg('Failed to verify OTP due to a network issue. Please retry.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Format MM:SS for expiry
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render Already Verified State
  if (isVerified) {
    return (
      <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/60 p-4 sm:p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <b className="font-display text-sm sm:text-base font-bold text-emerald-950">
                  +91 {mobile}
                </b>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-xs">
                  <ShieldCheck size={12} />
                  <span>Verified</span>
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                Mobile number verified via secure SMS OTP. You can now submit your application.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-gradient-to-b from-white to-[#FDFBF7] p-5 sm:p-6 shadow-card">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#E5E7EB] pb-4">
        <div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#F51F2B]">
            <ShieldCheck size={13} />
            <span>Government IRDAI Compliance</span>
          </span>
          <h4 className="font-display text-base sm:text-lg font-bold text-[#101C38] mt-0.5">
            Real Mobile OTP Verification
          </h4>
          <p className="text-xs text-[#53627A] mt-0.5">
            We will send a 6-digit verification code to your Indian mobile number.
          </p>
        </div>
        <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-[#FAF2DE] text-[#F51F2B] shrink-0">
          <Phone size={18} />
        </div>
      </div>

      {/* Mobile Number Display / Edit */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white border border-[#E5E7EB] p-3 shadow-xs">
        {isEditingMobile ? (
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <span className="text-xs font-bold text-[#101C38]">+91</span>
            <input
              type="tel"
              maxLength={10}
              value={tempMobile}
              onChange={(e) => setTempMobile(e.target.value.replace(/\D/g, ''))}
              placeholder="10-digit mobile"
              className="inp text-xs py-1.5 flex-1"
            />
            <button
              type="button"
              onClick={() => {
                if (/^[6-9]\d{9}$/.test(tempMobile)) {
                  onMobileChange(tempMobile);
                  setIsEditingMobile(false);
                  handleSendOtp(tempMobile);
                } else {
                  setErrorMsg('Please enter a valid 10-digit mobile number.');
                }
              }}
              className="btn-gold !text-xs !py-1.5 !px-3 shrink-0"
            >
              Update & Send
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-[#E5B544]" />
              <span className="text-xs text-[#53627A]">Mobile Number:</span>
              <b className="font-display text-sm font-bold text-[#101C38] tracking-wide">
                +91 {mobile || 'Not provided'}
              </b>
            </div>
            {!sessionToken ? (
              <button
                type="button"
                onClick={() => handleSendOtp(mobile)}
                disabled={isSending || !/^[6-9]\d{9}$/.test(mobile)}
                className="btn-gold !text-xs !py-1.5 !px-3.5 shrink-0 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSending ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[#171717]" />
                    <span>Sending SMS...</span>
                  </>
                ) : (
                  <span>Send OTP via SMS</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsEditingMobile(true);
                  setTempMobile(mobile);
                }}
                className="inline-flex items-center gap-1 text-xs text-[#53627A] hover:text-[#F51F2B] font-semibold transition-colors"
              >
                <Edit2 size={12} />
                <span>Change Number</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* 6-Digit OTP Inputs */}
      {sessionToken && (
        <div className="mt-5 space-y-4">
          <div className="text-center sm:text-left">
            <label className="block text-xs font-bold text-[#101C38]">
              Enter 6-Digit SMS Verification Code
            </label>
            <span className="text-[11px] text-[#53627A]">
              Check your SMS inbox for the one-time code.
            </span>
          </div>

          {/* 6 Input Boxes */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5" onPaste={handlePaste}>
            {otpValues.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                disabled={isVerifying}
                className={`h-12 w-10 sm:h-13 sm:w-12 rounded-xl text-center font-display text-lg sm:text-xl font-bold transition-all shadow-xs outline-none ${
                  digit
                    ? 'border-2 border-[#E5B544] bg-[#FAF2DE]/50 text-[#101C38]'
                    : 'border border-[#E5E7EB] bg-white text-[#101C38] focus:border-[#F51F2B] focus:ring-2 focus:ring-[#F51F2B]/20'
                } ${errorMsg ? 'border-[#F51F2B] bg-red-50/40' : ''}`}
              />
            ))}
          </div>

          {/* Timers & Attempts Information */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#53627A] pt-1 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#101C38]">
                ⏱ Valid for: <span className="text-[#F51F2B]">{formatTime(expirySec)}</span>
              </span>
              <span>•</span>
              <span className="text-[11px] text-slate-500">
                {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left
              </span>
            </div>

            <div>
              {cooldown > 0 ? (
                <span className="text-xs font-medium text-slate-400">
                  Resend OTP in <b>{cooldown}s</b>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendOtp(mobile)}
                  disabled={isSending}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#F51F2B] hover:underline"
                >
                  <RefreshCw size={12} className={isSending ? 'animate-spin' : ''} />
                  <span>Resend SMS OTP</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleVerifyOtp()}
              disabled={isVerifying || otpValues.join('').length !== 6}
              className="btn-gold w-full justify-center text-xs sm:text-sm font-bold shadow-xs py-2.5 disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin text-[#171717]" />
                  <span>Verifying Code with Server...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  <span>Verify Mobile Number</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info & Error Badges */}
      {infoMsg && (
        <div className="mt-3 rounded-xl bg-[#FAF2DE] border border-[#E5B544]/60 p-2.5 text-xs text-[#101C38] flex items-center gap-2">
          <CheckCircle2 size={15} className="text-[#E5B544] shrink-0" />
          <span>{infoMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mt-3 rounded-xl bg-red-50 border border-red-200 p-2.5 text-xs text-[#F51F2B] flex items-center gap-2">
          <AlertCircle size={15} className="text-[#F51F2B] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

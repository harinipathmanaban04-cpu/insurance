let OtpVerificationModel = null;

export async function getOtpVerificationModel() {
  if (OtpVerificationModel) return OtpVerificationModel;

  try {
    const mongoose = (await import('mongoose')).default;
    if (mongoose.models.OtpVerification) {
      OtpVerificationModel = mongoose.models.OtpVerification;
      return OtpVerificationModel;
    }

    const otpSchema = new mongoose.Schema(
      {
        mobile: {
          type: String,
          required: true,
          index: true,
        },
        hashedOtp: {
          type: String,
          required: true,
        },
        salt: {
          type: String,
          required: true,
        },
        attemptsLeft: {
          type: Number,
          default: 3,
        },
        expiresAt: {
          type: Date,
          required: true,
          index: { expires: 0 }, // MongoDB automatic TTL cleanup after expiration
        },
        verified: {
          type: Boolean,
          default: false,
        },
        sessionId: {
          type: String,
          default: null,
        },
      },
      {
        timestamps: true,
      }
    );

    OtpVerificationModel = mongoose.model('OtpVerification', otpSchema);
    return OtpVerificationModel;
  } catch (err) {
    return null;
  }
}

export default getOtpVerificationModel;

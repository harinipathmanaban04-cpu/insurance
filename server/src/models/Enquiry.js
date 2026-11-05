let EnquiryModel = null;

export async function getEnquiryModel() {
  if (EnquiryModel) return EnquiryModel;

  try {
    const mongoose = (await import('mongoose')).default;
    if (mongoose.models.Enquiry) {
      EnquiryModel = mongoose.models.Enquiry;
      return EnquiryModel;
    }

    const enquirySchema = new mongoose.Schema(
      {
        enquiryId: {
          type: String,
          unique: true,
          sparse: true,
          index: true,
        },
        name: {
          type: String,
          trim: true,
          default: '',
        },
        mobile: {
          type: String,
          trim: true,
          index: true,
          default: '',
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          trim: true,
          lowercase: true,
          index: true,
        },
        city: {
          type: String,
          trim: true,
          default: '',
        },
        insuranceType: {
          type: String,
          trim: true,
          default: 'General Insurance',
        },
        category: {
          type: String,
          trim: true,
          default: 'general',
        },
        subject: {
          type: String,
          trim: true,
          default: 'Insurance Enquiry',
        },
        message: {
          type: String,
          default: '',
        },
        status: {
          type: String,
          enum: ['Pending', 'Contacted', 'Resolved'],
          default: 'Pending',
          index: true,
        },
        source: {
          type: String,
          default: 'Contact Page Insurance Enquiry',
        },
        type: {
          type: String,
          default: 'Contact Page Insurance Enquiry',
        },
      },
      {
        timestamps: true,
      }
    );

    EnquiryModel = mongoose.model('Enquiry', enquirySchema);
    return EnquiryModel;
  } catch (err) {
    return null;
  }
}

export default getEnquiryModel;

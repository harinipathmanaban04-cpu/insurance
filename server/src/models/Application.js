import { CATEGORY_LABELS } from '../config/constants.js';

let ApplicationModel = null;

export async function getApplicationModel() {
  if (ApplicationModel) return ApplicationModel;

  try {
    const mongoose = (await import('mongoose')).default;
    if (mongoose.models.Application) {
      ApplicationModel = mongoose.models.Application;
      return ApplicationModel;
    }

    const applicationSchema = new mongoose.Schema(
      {
        applicationId: {
          type: String,
          required: true,
          unique: true,
          index: true,
        },
        category: {
          type: String,
          required: true,
          enum: ['car', 'bike', 'commercial', 'health', 'life', 'health-life', 'health_life', 'health+life'],
          index: true,
        },
        categoryLabel: {
          type: String,
          default: function () {
            return CATEGORY_LABELS[this.category] || 'Insurance';
          },
        },
        customer: {
          name: { type: String, required: true },
          mobile: { type: String, required: true, index: true },
          email: { type: String, required: true },
          city: { type: String, required: true },
        },
        details: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        verifiedMobile: {
          type: Boolean,
          default: true,
        },
        status: {
          type: String,
          enum: ['Pending', 'Under Review', 'Contacted', 'Completed', 'Rejected'],
          default: 'Pending',
          index: true,
        },
        statusHistory: [
          {
            status: { type: String, required: true },
            timestamp: { type: Date, default: Date.now },
            note: { type: String, default: '' },
          },
        ],
        source: {
          type: String,
          default: 'Website Online Application',
        },
      },
      {
        timestamps: true,
      }
    );

    ApplicationModel = mongoose.model('Application', applicationSchema);
    return ApplicationModel;
  } catch (err) {
    return null;
  }
}

export default getApplicationModel;

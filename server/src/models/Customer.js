let CustomerModel = null;

export async function getCustomerModel() {
  if (CustomerModel) return CustomerModel;

  try {
    const mongoose = (await import('mongoose')).default;
    if (mongoose.models.Customer) {
      CustomerModel = mongoose.models.Customer;
      return CustomerModel;
    }

    const customerSchema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, 'Customer name is required'],
          trim: true,
        },
        mobile: {
          type: String,
          required: [true, 'Mobile number is required'],
          trim: true,
          match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'],
          index: true,
        },
        email: {
          type: String,
          required: [true, 'Email address is required'],
          trim: true,
          lowercase: true,
          match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
        },
        city: {
          type: String,
          required: [true, 'City/Location is required'],
          trim: true,
        },
        isMobileVerified: {
          type: Boolean,
          default: false,
        },
      },
      {
        timestamps: true,
      }
    );

    CustomerModel = mongoose.model('Customer', customerSchema);
    return CustomerModel;
  } catch (err) {
    return null;
  }
}

export default getCustomerModel;

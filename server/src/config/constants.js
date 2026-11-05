export const INSURANCE_CATEGORIES = {
  CAR: 'car',
  BIKE: 'bike',
  COMMERCIAL: 'commercial',
  HEALTH_LIFE: 'health-life',
  HEALTH: 'health',
  LIFE: 'life',
};

export const CATEGORY_LABELS = {
  car: 'Car Insurance',
  bike: 'Bike Insurance',
  commercial: 'Commercial Vehicle Insurance',
  'health-life': 'Health + Life Insurance',
  'health+life': 'Health + Life Insurance',
  health_life: 'Health + Life Insurance',
  health: 'Health Insurance',
  life: 'Life Insurance',
};

export const APPLICATION_STATUS = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  CONTACTED: 'Contacted',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
};

export const OTP_CONFIG = {
  EXPIRY_MINUTES: 5,
  EXPIRY_MS: 5 * 60 * 1000,
  COOLDOWN_SECONDS: 45,
  MAX_ATTEMPTS: 3,
  RATE_LIMIT_MAX_PER_WINDOW: 5,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
};

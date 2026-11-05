import fs from 'fs';
import path from 'path';

// Seed sample enquiries for initial dashboard inspection
const INITIAL_ENQUIRIES = [
  {
    applicationId: 'BIP-CAR-TN01-4821',
    category: 'car',
    categoryLabel: 'Car Insurance',
    customer: {
      name: 'Karthik Subramanian',
      mobile: '9840123456',
      email: 'karthik.sub@gmail.com',
      city: 'Chennai',
    },
    details: {
      regNumber: 'TN 01 BK 4210',
      manufacturer: 'Hyundai',
      model: 'Creta',
      variant: 'SX(O) 1.5 Diesel',
      fuelType: 'Diesel',
      mfgYear: '2023',
      rtoLocation: 'Chennai Central (TN-01)',
      policyStatus: 'Active - Expiring in 15 days',
      expiryDate: '2026-11-20',
      previousClaims: 'No (NCB 35%)',
      insuranceType: 'Comprehensive + Zero Depreciation',
    },
    verifiedMobile: true,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), note: 'Application submitted online' },
    ],
  },
  {
    applicationId: 'BIP-BIKE-TN65-9104',
    category: 'bike',
    categoryLabel: 'Bike Insurance',
    customer: {
      name: 'Vigneshwaran M',
      mobile: '9789123456',
      email: 'vignesh.m@gmail.com',
      city: 'Ramanathapuram',
    },
    details: {
      regNumber: 'TN 65 AB 7891',
      manufacturer: 'Royal Enfield',
      model: 'Classic 350',
      engineCapacity: '150-350cc',
      mfgYear: '2022',
      rtoLocation: 'Ramanathapuram (TN-65)',
      policyStatus: 'Active',
      expiryDate: '2026-12-05',
      insuranceType: 'Comprehensive Plan',
    },
    verifiedMobile: true,
    status: 'Contacted',
    createdAt: new Date(Date.now() - 3600 * 1000 * 14).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600 * 1000 * 14).toISOString(), note: 'Application submitted online' },
      { status: 'Contacted', timestamp: new Date(Date.now() - 3600 * 1000 * 10).toISOString(), note: 'Shared quotations from Digit and HDFC ERGO' },
    ],
  },
  {
    applicationId: 'BIP-COMM-TN58-3012',
    category: 'commercial',
    categoryLabel: 'Commercial Vehicle Insurance',
    customer: {
      name: 'Murugan Transports',
      mobile: '9443123456',
      email: 'muruganlogistics@gmail.com',
      city: 'Madurai',
    },
    details: {
      regNumber: 'TN 58 AX 9012',
      vehicleCategory: 'Goods Carrier (Truck)',
      manufacturer: 'Tata Motors',
      model: 'Tata 1109 LPT',
      mfgYear: '2021',
      gvwOrCapacity: '11,990 kg GVW',
      vehicleUsage: 'Public Carrier (State Permit)',
      rtoLocation: 'Madurai South (TN-58)',
      existingInsurance: 'National Insurance - Expired 10 days ago',
    },
    verifiedMobile: true,
    status: 'Under Review',
    createdAt: new Date(Date.now() - 3600 * 1000 * 28).toISOString(),
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 3600 * 1000 * 28).toISOString(), note: 'Commercial fleet enquiry received' },
      { status: 'Under Review', timestamp: new Date(Date.now() - 3600 * 1000 * 20).toISOString(), note: 'Inspecting RC and previous policy copy' },
    ],
  },
  {
    applicationId: 'BIP-HLTH-PMK-7741',
    category: 'health',
    categoryLabel: 'Health Insurance',
    customer: {
      name: 'Dr. Saravanan K',
      mobile: '9600123456',
      email: 'dr.saravanan@gmail.com',
      city: 'Paramakudi',
    },
    details: {
      planType: 'Family Floater (2 Adults + 2 Children)',
      applicantName: 'Dr. Saravanan K',
      dob: '1988-06-14',
      familyCount: '4 members',
      membersAges: 'Self: 38, Spouse: 35, Child 1: 9, Child 2: 5',
      cityPincode: 'Paramakudi, 623707',
      sumInsured: '₹25 Lakhs Super Top-up / Base',
      existingConditions: 'None (Clean medical declaration)',
    },
    verifiedMobile: true,
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
    statusHistory: [
      { status: 'Completed', timestamp: new Date(Date.now() - 3600 * 1000 * 30).toISOString(), note: 'Care Supreme policy issued successfully' },
    ],
  },
];

// In-memory store (active in Node process and serverless lifecycle)
let memoryStore = [...INITIAL_ENQUIRIES];

export function getEnquiries({ category, status, search } = {}) {
  let list = [...memoryStore];

  if (category && category !== 'all') {
    list = list.filter((e) => e.category === category);
  }
  if (status && status !== 'all') {
    list = list.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }
  if (search && search.trim()) {
    const s = search.trim().toLowerCase();
    list = list.filter((e) =>
      e.applicationId.toLowerCase().includes(s) ||
      e.customer.name.toLowerCase().includes(s) ||
      e.customer.mobile.includes(s) ||
      (e.details.regNumber && e.details.regNumber.toLowerCase().includes(s))
    );
  }

  // Sort latest first
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function saveEnquiry(enquiry) {
  memoryStore.unshift(enquiry);
  return enquiry;
}

export function updateEnquiryStatus(applicationId, newStatus, note = '') {
  const item = memoryStore.find((e) => e.applicationId === applicationId);
  if (!item) return null;

  item.status = newStatus;
  item.statusHistory = item.statusHistory || [];
  item.statusHistory.unshift({
    status: newStatus,
    timestamp: new Date().toISOString(),
    note: note || `Status updated to ${newStatus}`,
  });

  return item;
}

import familyImg from '../assets/family.png';
import { Car, Bike, Truck, Users } from 'lucide-react';

const U = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const CATS = [
  {
    id: 'car',
    path: '/insurance/car',
    title: 'Car Insurance',
    nav: 'Car Insurance',
    icon: Car,
    img: U('photo-1494976388531-d1058494cdd8'),
    short: 'Comprehensive protection for your car against accidents, theft and damages.',
    type: 'Car Insurance',
  },
  {
    id: 'bike',
    path: '/insurance/bike',
    title: 'Bike Insurance',
    nav: 'Bike Insurance',
    icon: Bike,
    img: U('photo-1558981806-ec527fa84c39'),
    short: 'Complete safety for your two-wheeler with affordable insurance plans.',
    type: 'Bike Insurance',
  },
  {
    id: 'commercial',
    path: '/insurance/commercial',
    title: 'Commercial Insurance',
    nav: 'Commercial Insurance',
    icon: Truck,
    img: U('photo-1601584115197-04ecc0da31d7'),
    short: 'Protection for your business vehicles to keep your business moving.',
    type: 'Commercial Insurance',
  },
  {
    id: 'life-family',
    path: '/insurance/life-family',
    title: 'Health + Life Insurance',
    nav: 'Health + Life Insurance',
    icon: Users,
    img: U('photo-1511895426328-dc8714191300'),
    short: 'Comprehensive health hospitalization and family term protection in one plan.',
    type: 'Health + Life Insurance',
  },
];

export const FAMILY_IMG = familyImg;

export const PAGES = {
  car: {
    hero: 'Drive with confidence. Insure with care.',
    lead: 'Compare third-party and comprehensive car insurance with expert guidance.',
    blocks: [
      {
        h: 'Types of Car Cover',
        cards: [
          ['Third-Party Cover', 'Legally required cover for injury, death or property damage to others.'],
          ['Comprehensive Cover', 'Third-party liability plus own damage protection.'],
          ['Own Damage Protection', 'Covers accidents, fire, floods and other damage to your car.'],
          ['Theft Protection', 'Financial protection if your car is stolen (as per policy terms).'],
        ],
      },
      {
        h: 'Popular Add-on Covers',
        cards: [
          ['Zero Depreciation', 'Claim without depreciation deduction on parts.'],
          ['Engine Protect', 'Helps with engine damage from water ingress.'],
          ['Roadside Assistance', 'Help for breakdowns and towing.'],
          ['Return to Invoice', 'Invoice value support on total loss or theft.'],
        ],
      },
    ],
    faqs: [
      ['Is car insurance mandatory in India?', 'Yes, at least third-party cover is mandatory under the Motor Vehicles Act.'],
      ['What does comprehensive cover include?', 'Third-party liability plus own damage, theft and natural calamity cover, subject to insurer terms.'],
      ['How do I claim?', 'Inform the insurer, share documents, and our team assists you through each step.'],
    ],
  },
  bike: {
    hero: 'Ride safe. Stay covered.',
    lead: 'Affordable two-wheeler insurance with simple paperwork and quick support.',
    blocks: [
      {
        h: 'Two-Wheeler Coverage',
        cards: [
          ['Third-Party Insurance', 'Mandatory cover for legal liability to third parties.'],
          ['Comprehensive Coverage', 'Own damage plus third-party liability in one plan.'],
          ['Own Damage Protection', 'Covers accidents, fire, theft and natural calamities.'],
          ['Personal Accident Cover', 'Owner-rider accident cover as per policy terms.'],
        ],
      },
      {
        h: 'Why Insure Your Bike',
        cards: [
          ['Legal Compliance', 'Ride without worrying about fines.'],
          ['Low Premiums', 'Plans to suit every budget.'],
          ['Easy Renewal', 'Renew online with expert help.'],
          ['Claim Assistance', 'We guide you from intimation to settlement.'],
        ],
      },
    ],
    faqs: [
      ['Is bike insurance compulsory?', 'Yes, third-party cover is mandatory for all two-wheelers.'],
      ['Can I renew an expired policy?', 'Yes, our team can help you renew; inspection may be required.'],
      ['Is personal accident cover included?', 'It is generally included for the owner-driver; check your policy.'],
    ],
  },
  commercial: {
    hero: 'Keep your business moving.',
    lead: 'Coverage for trucks, buses, taxis, vans and goods vehicles.',
    blocks: [
      {
        h: 'Vehicles We Help Insure',
        cards: [
          ['Trucks', 'Goods carriers and heavy vehicles.'],
          ['Buses', 'School, staff and tourist buses.'],
          ['Taxis', 'City and outstation taxis.'],
          ['Vans & Goods Vehicles', 'Light commercial vehicles for daily operations.'],
        ],
      },
      {
        h: 'Business Protection Benefits',
        cards: [
          ['Third-Party Liability', 'Legal liability for injury or property damage.'],
          ['Vehicle Damage Protection', 'Accidents, fire and natural calamities.'],
          ['Driver Cover', 'Personal accident options for drivers.'],
          ['Fleet Support', 'Guidance for multiple-vehicle policies.'],
        ],
      },
    ],
    faqs: [
      ['Can I insure multiple vehicles?', 'Yes, fleet options are available from several insurers.'],
      ['What is third-party liability?', 'Cover for legal liability for damage or injury to others caused by your vehicle.'],
      ['Which documents are needed?', 'RC, permit, fitness certificate, previous policy and ID proof.'],
    ],
  },
  'life-family': {
    hero: 'Protect the people who matter most.',
    lead: 'Health and life insurance together – one expert, one trusted point of contact.',
    blocks: [
      {
        label: 'Section A',
        h: 'Health Insurance',
        cards: [
          ['Family Floater', 'One policy and sum insured for the entire family.'],
          ['Hospitalization Cover', 'Room, doctor, surgery and ICU expenses.'],
          ['Medical Expense Protection', 'Pre and post hospitalization costs as per terms.'],
          ['Cashless Hospitalization', 'Treatment at 10,000+ network hospitals without upfront payment.'],
        ],
      },
      {
        label: 'Section B',
        h: 'Life Insurance',
        cards: [
          ['Family Financial Protection', 'A payout to your family if the unexpected happens.'],
          ['Term Life Insurance', 'Pure protection with high cover at low premiums.'],
          ['Financial Security', 'Cover loans, education and daily expenses.'],
          ['Goal-based Planning', 'We help choose cover amount and term for your family milestones.'],
        ],
      },
    ],
    faqs: [
      ['What is term insurance?', 'Pure life cover paying a sum to nominees if the insured passes away during the term.'],
      ['What is a family floater?', 'A single health plan covering all family members under one sum insured.'],
      ['Can I buy both together?', 'Yes, our experts help you plan life and health cover together.'],
    ],
  },
};

export const TESTIMONIALS = [
  [
    'Karthik',
    'Devakottai',
    'The team explained all the policy details clearly and helped me choose suitable vehicle insurance without any confusion. Very patient and supportive staff.',
  ],
  [
    'Kaviya',
    'Karaikudi',
    'Renewing my two-wheeler insurance took only a few minutes over the phone. The digital policy copy was delivered immediately to my email and phone.',
  ],
  [
    'Aravind',
    'Pudukkottai',
    'I received timely renewal reminders before my bike insurance expired, saving me from fines. Smooth process and very polite communication throughout.',
  ],
  [
    'Priya',
    'Kadaladi',
    'Dependable team for our mini delivery vans. They ensured all safety and legal liability requirements were properly covered at economical rates.',
  ],
  [
    'Vignesh',
    'Coimbatore',
    'They suggested the right add-on covers like zero depreciation and roadside assistance for my new scooter. Truly honest and professional advice.',
  ],
  [
    'Divya',
    'Erode',
    'The entire documentation process was completely smooth and paperless. I simply submitted the RC copy and received the renewal confirmation promptly.',
  ],
  [
    'Saravanan',
    'Kanyakumari',
    'Their advisor guided me systematically on garage formalities and claim filing after minor vehicle damage. Reliable and reassuring claims assistance.',
  ],
  [
    'Nandhini',
    'Vilathikulam',
    'Whenever I called with questions regarding premium breakup, they responded promptly and politely. Outstanding customer service from start to finish.',
  ],
  [
    'Suresh',
    'Vembar',
    'No hidden charges or confusing clauses. Everything about the premium calculation and deductible benefits was explained openly before making any payment.',
  ],
  [
    'Harini',
    'Sathirakudi',
    'Sent my vehicle details and had a verified quotation within ten minutes. Quick, convenient, and highly responsive customer support on WhatsApp.',
  ],
  [
    'Pradeep',
    'Paramakudi',
    'Friendly advisors who patiently answered every single doubt regarding comprehensive coverage. Having a trusted local insurance office in Paramakudi gives great peace of mind.',
  ],
  [
    'Meena',
    'Ramanathapuram',
    'I got an affordable premium for my family car after comparing multiple insurer quotes. Their transparent guidance saved both my money and valuable time.',
  ],
  [
    'Muthu',
    'Tiruchirappalli',
    'Finding the right insurance plan was effortless with their step-by-step assistance. They highlighted key terms so I could decide with full confidence.',
  ],
  [
    'Keerthana',
    'Tirunelveli',
    'Impressed with how fast they issued the policy certificate. No waiting or tedious follow-ups; the representative made the registration effortless.',
  ],
  [
    'Balaji',
    'Sivakasi',
    'Managed insurance for both our bike and car under one roof. Reasonable pricing, clear policy terms, and quick coordination across both plans.',
  ],
  [
    'Swetha',
    'Madurai',
    'Excellent support for our commercial transport vehicles. They handled the paperwork swiftly and guided our company on suitable goods vehicle coverage options.',
  ],
  [
    'Vijay',
    'Aruppukottai',
    'As a first-time vehicle owner, I was unsure about legal third-party rules. The staff guided me with genuine warmth and clear advice.',
  ],
  [
    'Revathi',
    'Sivaganga',
    'Very professional approach and sound knowledge of insurance guidelines. They compared top IRDAI-registered plans to find the ideal match for my car.',
  ],
  [
    'Dinesh',
    'Kalaiyarkoil',
    'Assisted me smoothly with policy name transfer and ownership updates. Their team made what seemed like complex paperwork feel completely hassle-free.',
  ],
  [
    'Abinaya',
    'Thiruvadanai',
    'They helped me select a budget-friendly policy without compromising on necessary coverage. Very trustworthy team with customer-first values.',
  ],
  [
    'Manikandan',
    'Sayalgudi',
    'From quotation comparison to final policy delivery, their dedication was remarkable. I will definitely recommend The Best Insurance Point to all my friends.',
  ],
];

export const COMPANY_NAME = 'THE BEST INSURANCE POINT';
export const PHONE = '63803 60336';
export const PHONE_RAW = '6380360336';
export const EMAIL = 'bestinsurance.pmk@gmail.com';
export const ADDRESS = 'NO 9/275, CHINNAKADAI VEETHI, PARAMAKUDI - 623707, RAMNAD DIST.';
export const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=NO+9%2F275%2C+CHINNAKADAI+VEETHI%2C+PARAMAKUDI+-+623707%2C+RAMNAD+DIST.';
export const WHATSAPP_URL = 'https://wa.me/916380360336';

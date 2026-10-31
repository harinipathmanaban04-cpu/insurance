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
    title: 'Health & Life Insurance',
    nav: 'Health & Life Insurance',
    icon: Users,
    img: U('photo-1511895426328-dc8714191300'),
    short: 'Secure your family’s future with comprehensive life and health insurance plans.',
    type: 'Health & Life Insurance',
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
  ['Rahul Sharma', 'Kolkata', 'Buying insurance was so easy. The team guided me perfectly and claim support was excellent.'],
  ['Pooja Verma', 'Pune', 'Very professional service and quick response. Got the best policy for my bike at an affordable price.'],
  ['Amit Singh', 'Jaipur', 'I insured my commercial vehicle through them. The process was smooth and hassle-free.'],
  ['Neha Iyer', 'Chennai', 'Clear advice on family health cover. Cashless process explained step by step.'],
  ['Karthik R', 'Coimbatore', 'Renewal took minutes. Helpful and honest guidance.'],
  ['Sana Khan', 'Hyderabad', 'Compared many car plans and picked the right one with their help.'],
];

export const PHONE = '+91 98765 43210';
export const EMAIL = 'info@example.com';
export const ADDRESS = '123, Business Park, Your City (placeholder)';

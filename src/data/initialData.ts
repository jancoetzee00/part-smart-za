import {
  InventoryItem,
  OwnerSettings,
  Seller,
  SubscriptionPlan,
  CategoryType,
  PartCondition,
  SAProvince
} from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Seller',
    priceZar: 450,
    maxListings: 10,
    description: 'Ideal for independent workshops & specialized spares providers.',
    features: [
      'Up to 10 active inventory listings',
      'Direct WhatsApp & Phone lead routing',
      'Standard search directory placement',
      'Monthly payment cycle'
    ]
  },
  {
    id: 'pro',
    name: 'Commercial Pro',
    priceZar: 850,
    maxListings: 35,
    description: 'Perfect for truck breakers, auto scrap yards, and equipment suppliers.',
    features: [
      'Up to 35 active inventory listings',
      'Featured badge on top search results',
      'Direct WhatsApp & Phone lead routing',
      'Detailed inquiry analytics & views counter',
      'Priority support'
    ]
  },
  {
    id: 'dealer_unlimited',
    name: 'Heavy Dealer Unlimited',
    priceZar: 1850,
    maxListings: 999,
    description: 'For major equipment dealers, commercial fleet breakers, and nationwide yards.',
    features: [
      'Unlimited inventory listings',
      'Top homepage banner exposure',
      'Verified Heavy Dealer badge',
      'Bulk inventory upload assistant',
      'Dedicated account manager & instant EFT auto-check'
    ]
  }
];

export const INITIAL_OWNER_SETTINGS: OwnerSettings = {
  passwordHash: 'admin123', // Default admin password
  ownerEmail: 'accounts@partsmart.co.za',
  ownerPhone: '+27 11 892 4000',
  bankingDetails: {
    bankName: 'First National Bank (FNB)',
    accountHolder: 'Part-Smart ZA (Pty) Ltd',
    accountNumber: '62849102384',
    branchCode: '250655',
    accountType: 'Business Cheque Account',
    swiftCode: 'FIRNZAJJ',
    paymentReferenceFormat: 'PS-[COMPANY-NAME] or PS-[SELLER-ID]',
    additionalInstructions: 'Please use your registered Company Name or Seller ID as the EFT payment reference. Email proof of payment (POP) to accounts@partsmart.co.za or upload your reference number in the Seller Portal for instant review.',
    updatedAt: new Date().toISOString()
  }
};

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 'seller-1',
    companyName: 'Highveld Earthmoving Spares',
    contactName: 'Johan van der Merwe',
    phone: '+27 82 459 1102',
    whatsapp: '27824591102',
    email: 'johan@highveldspares.co.za',
    province: 'Gauteng',
    city: 'Boksburg, Johannesburg',
    address: '45 Commissioner Street, Jet Park',
    planId: 'dealer_unlimited',
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-09-01T00:00:00.000Z',
    lastPaymentRef: 'PS-HIGHVELD-AUG26',
    createdAt: '2026-01-15T00:00:00.000Z'
  },
  {
    id: 'seller-2',
    companyName: 'Cape Truck Breakers & Diesels',
    contactName: 'Thabo Mokoena',
    phone: '+27 83 912 3344',
    whatsapp: '27839123344',
    email: 'sales@capetruckbreakers.co.za',
    province: 'Western Cape',
    city: 'Epping, Cape Town',
    address: '12 Viking Way, Epping Industria',
    planId: 'pro',
    subscriptionStatus: 'active',
    subscriptionDueDate: '2026-08-25T00:00:00.000Z',
    lastPaymentRef: 'PS-CAPETRUCK-9812',
    createdAt: '2026-02-10T00:00:00.000Z'
  },
  {
    id: 'seller-3',
    companyName: 'KZN Bakkie & Auto Strippers',
    contactName: 'Devan Naidoo',
    phone: '+27 71 884 9201',
    whatsapp: '27718849201',
    email: 'devan@kznbakkiespares.co.za',
    province: 'KwaZulu-Natal',
    city: 'Pinetown, Durban',
    address: '88 Old Main Road',
    planId: 'starter',
    subscriptionStatus: 'unpaid', // UNPAID SELLER FOR OWNER TO TEST REMOVING/EDITING UNPAID SUBSCRIPTIONS
    subscriptionDueDate: '2026-07-30T00:00:00.000Z',
    lastPaymentRef: 'EFT-PENDING-JULY',
    createdAt: '2026-03-01T00:00:00.000Z'
  },
  {
    id: 'seller-4',
    companyName: 'Limpopo Heavy Machinery & Hydraulics',
    contactName: 'Francois Botha',
    phone: '+27 84 300 7711',
    whatsapp: '27843007711',
    email: 'info@limpopomachinery.co.za',
    province: 'Limpopo',
    city: 'Polokwane',
    address: '22 Industrial Loop',
    planId: 'pro',
    subscriptionStatus: 'pending_verification',
    subscriptionDueDate: '2026-08-15T00:00:00.000Z',
    lastPaymentRef: 'FNB-REF-77112026',
    paymentProofSubmittedAt: '2026-08-08T10:30:00.000Z',
    createdAt: '2026-04-12T00:00:00.000Z'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item-101',
    sellerId: 'seller-1',
    sellerName: 'Highveld Earthmoving Spares',
    sellerPhone: '+27 82 459 1102',
    sellerWhatsapp: '27824591102',
    title: 'Caterpillar 320D Excavator Main Hydraulic Pump (Regulated)',
    category: 'heavy_equipment',
    subcategory: 'Hydraulics & Pumps',
    make: 'Caterpillar',
    model: '320D / 320C',
    year: 2021,
    partNumber: 'CAT-259-0815',
    condition: 'reconditioned',
    priceZar: 85000,
    province: 'Gauteng',
    city: 'Jet Park, Boksburg',
    description: 'Fully reconditioned Caterpillar 320D main twin-variable piston hydraulic pump. Pressure bench tested at 350 bar with full test certificate included. Ready for immediate fitment with 6-month warranty.',
    specifications: {
      'Displacement': '112 cc/rev',
      'Max Working Pressure': '350 Bar',
      'Warranty': '6 Months Mechanical',
      'Stock Condition': 'In Stock - Boksburg Yard'
    },
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    views: 342,
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-01T09:00:00.000Z'
  },
  {
    id: 'item-102',
    sellerId: 'seller-1',
    sellerName: 'Highveld Earthmoving Spares',
    sellerPhone: '+27 82 459 1102',
    sellerWhatsapp: '27824591102',
    title: 'Komatsu PC200-8 Heavy Duty Excavator Bucket (1.2m³)',
    category: 'heavy_equipment',
    subcategory: 'Buckets & Attachments',
    make: 'Komatsu',
    model: 'PC200 / PC210-8',
    year: 2022,
    partNumber: 'KOM-207-70-K12',
    condition: 'new',
    priceZar: 42500,
    province: 'Gauteng',
    city: 'Boksburg',
    description: 'Brand new reinforced rock bucket for 20-ton excavator class. Features Hardox 400 wear strips, heavy duty side cutters, and 5 x ESCO style bucket teeth. Pin diameter 80mm.',
    specifications: {
      'Capacity': '1.2 Cubic Meters',
      'Pin Diameter': '80 mm',
      'Material': 'Hardox 400 Steel',
      'Tooth Style': 'ESCO V29'
    },
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    views: 189,
    createdAt: '2026-08-02T11:20:00.000Z',
    updatedAt: '2026-08-02T11:20:00.000Z'
  },
  {
    id: 'item-103',
    sellerId: 'seller-2',
    sellerName: 'Cape Truck Breakers & Diesels',
    sellerPhone: '+27 83 912 3344',
    sellerWhatsapp: '27839123344',
    title: 'Scania DC13 V8 Euro 5 Complete Engine Assembly',
    category: 'trucks',
    subcategory: 'Engine & Turbo',
    make: 'Scania',
    model: 'R500 / R560 Streamline',
    year: 2019,
    partNumber: 'DC13-115-SCA',
    condition: 'used',
    priceZar: 165000,
    province: 'Western Cape',
    city: 'Cape Town',
    description: 'Complete runner Scania DC13 13-liter 6-cylinder / V8 diesel engine removed from a clean 2019 Scania R-Series horse with 420,000 km. Complete with turbo, high pressure fuel pump, and ECU harness.',
    specifications: {
      'Horsepower': '500 HP',
      'Mileage': '420,000 km',
      'Fuel System': 'XPI Common Rail',
      'Status': 'Running engine - Dyno tested'
    },
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    views: 512,
    createdAt: '2026-08-03T14:15:00.000Z',
    updatedAt: '2026-08-03T14:15:00.000Z'
  },
  {
    id: 'item-104',
    sellerId: 'seller-2',
    sellerName: 'Cape Truck Breakers & Diesels',
    sellerPhone: '+27 83 912 3344',
    sellerWhatsapp: '27839123344',
    title: 'Volvo FH16 Optidrive 12-Speed Automated Gearbox',
    category: 'trucks',
    subcategory: 'Gearboxes & Drivetrain',
    make: 'Volvo Trucks',
    model: 'FH16 / FM440',
    year: 2020,
    partNumber: 'ATO2612D',
    condition: 'reconditioned',
    priceZar: 95000,
    province: 'Western Cape',
    city: 'Epping, Cape Town',
    description: 'Fully overhauled Volvo Optidrive 12-speed automated transmission box with built-in retarder controller. Complete bearing overhaul with genuine Volvo seals.',
    specifications: {
      'Speeds': '12 Forward + 2 Reverse',
      'Retarder': 'Integrated Hydraulic',
      'Warranty': '3 Month Yard Guarantee'
    },
    images: [
      'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    views: 260,
    createdAt: '2026-08-04T08:45:00.000Z',
    updatedAt: '2026-08-04T08:45:00.000Z'
  },
  {
    id: 'item-105',
    sellerId: 'seller-3',
    sellerName: 'KZN Bakkie & Auto Strippers',
    sellerPhone: '+27 71 884 9201',
    sellerWhatsapp: '27718849201',
    title: 'Toyota Hilux GD-6 2.8L Complete Engine & 6-Speed Manual Gearbox',
    category: 'cars',
    subcategory: 'Engines & Transmissions',
    make: 'Toyota',
    model: 'Hilux Revo GD-6 2.8L',
    year: 2021,
    partNumber: '1GD-FTV-8812',
    condition: 'used',
    priceZar: 68000,
    province: 'KwaZulu-Natal',
    city: 'Pinetown, Durban',
    description: 'Clean running 1GD-FTV 2.8L Turbo Diesel engine with manual 4x4 gearbox from accident damage Toyota Hilux Raider bakkie. Low mileage (78,000 km). Perfect for bakkie conversion or engine replacement.',
    specifications: {
      'Engine Code': '1GD-FTV Turbo Diesel',
      'Displacement': '2755 cc',
      'Drivetrain': '4x4 Manual 6-Speed',
      'Mileage': '78,400 km'
    },
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    views: 410,
    createdAt: '2026-08-05T16:30:00.000Z',
    updatedAt: '2026-08-05T16:30:00.000Z'
  },
  {
    id: 'item-106',
    sellerId: 'seller-3',
    sellerName: 'KZN Bakkie & Auto Strippers',
    sellerPhone: '+27 71 884 9201',
    sellerWhatsapp: '27718849201',
    title: '2020 Ford Ranger 3.2 TDCi Wildtrak Stripping for Spares',
    category: 'cars',
    subcategory: 'Stripping for Spares',
    make: 'Ford',
    model: 'Ranger Wildtrak 3.2 Duratorq',
    year: 2020,
    partNumber: 'FORD-WILD-3.2-STRIP',
    condition: 'stripping_spares',
    priceZar: 12000,
    province: 'KwaZulu-Natal',
    city: 'Durban',
    description: 'Currently stripping 2020 Ford Ranger 3.2 4x4 Wildtrak. Front impact damage. Rear diff assembly, doors, tailgate, leather seats, dashboard, suspension arms, transfer case available.',
    specifications: {
      'Available Parts': 'Rear Axle, Doors, Transfer Case, Seats, ECU',
      'Color': 'Pride Orange',
      'Stripping Status': '90% Parts intact'
    },
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: false,
    views: 590,
    createdAt: '2026-08-06T10:00:00.000Z',
    updatedAt: '2026-08-06T10:00:00.000Z'
  },
  {
    id: 'item-107',
    sellerId: 'seller-4',
    sellerName: 'Limpopo Heavy Machinery & Hydraulics',
    sellerPhone: '+27 84 300 7711',
    sellerWhatsapp: '27843007711',
    title: 'JCB 3CX Backhoe Loader Perkins 444 Diesel Engine',
    category: 'heavy_equipment',
    subcategory: 'Engine & Spares',
    make: 'JCB',
    model: '3CX / 4CX Eco',
    year: 2018,
    partNumber: 'JCB-320/04001',
    condition: 'reconditioned',
    priceZar: 78000,
    province: 'Limpopo',
    city: 'Polokwane',
    description: 'Fully reconditioned JCB Dieselmax 4.4L turbocharged engine assembly. New pistons, rings, bearings, and reconditioned cylinder head. Tested on bench.',
    specifications: {
      'Engine Type': 'JCB Dieselmax 444',
      'Power': '68 kW / 92 HP',
      'Warranty': '6 Months'
    },
    images: [
      'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80'
    ],
    isFeatured: true,
    views: 215,
    createdAt: '2026-08-07T12:00:00.000Z',
    updatedAt: '2026-08-07T12:00:00.000Z'
  }
];

export const SUBCATEGORIES: Record<CategoryType, string[]> = {
  cars: [
    'All Car Parts',
    'Engines & Transmissions',
    'Stripping for Spares',
    'Body Parts & Panels',
    'Suspension & Steering',
    'Brakes & Hydraulics',
    'Electrical & ECUs',
    'Interior & Seats'
  ],
  trucks: [
    'All Truck Parts',
    'Engine & Turbo',
    'Gearboxes & Drivetrain',
    'Axles, Differentials & Hubs',
    'Truck Cabins & Chassis',
    'Air Brake Systems',
    'Trailer Spares & Fifth Wheels',
    'Stripping Trucks for Spares'
  ],
  heavy_equipment: [
    'All Equipment Parts',
    'Hydraulics & Pumps',
    'Buckets & Attachments',
    'Under carriage & Rubber Tracks',
    'Engine & Spares',
    'Transmission & Final Drive',
    'Cabins & Operator Controls',
    'Breakers & Hammers'
  ]
};

export const PROVINCES_LIST: SAProvince[] = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Mpumalanga',
  'Free State',
  'Eastern Cape',
  'Limpopo',
  'North West',
  'Northern Cape'
];

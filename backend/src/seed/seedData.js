require('dotenv').config();
const mongoose = require('mongoose');
const {
  Hotel,
  User,
  Room,
  Department,
  Service,
  Request,
  Task,
  KnowledgeDocument,
  Notification,
  Feedback,
  IssueTrend,
  SafetyCheck,
  Offer,
  ActivityLog,
  Subscription
} = require('../models');
const { ROLES, PRIORITY_LEVELS, TASK_STATUS, REQUEST_STATUS } = require('../config/constants');
const RAGService = require('../services/ragService');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/stayflow';

async function seed() {
  try {
    console.log('Connecting to MongoDB for seeding at', MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection established.');

    // Clear existing data
    console.log('Clearing existing collections...');
    await Promise.all([
      Hotel.deleteMany({}),
      User.deleteMany({}),
      Room.deleteMany({}),
      Department.deleteMany({}),
      Service.deleteMany({}),
      Request.deleteMany({}),
      Task.deleteMany({}),
      KnowledgeDocument.deleteMany({}),
      Notification.deleteMany({}),
      Feedback.deleteMany({}),
      IssueTrend.deleteMany({}),
      SafetyCheck.deleteMany({}),
      Offer.deleteMany({}),
      ActivityLog.deleteMany({}),
      Subscription.deleteMany({})
    ]);

    console.log('Creating 3 Hotels...');
    // Hotel 1: StayFlow Grand Pune (Primary Demo Hotel)
    const grandPune = await Hotel.create({
      name: 'StayFlow Grand Pune',
      subdomain: 'grandpune',
      hotelCode: 'SFGP',
      address: {
        street: '88 Koregaon Park North Main Road',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '411001'
      },
      contactEmail: 'concierge@stayflowgrandpune.com',
      contactPhone: '+91 20 6789 5500',
      logo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80',
      status: 'active',
      subscription: {
        plan: 'professional',
        status: 'active',
        price: 9999,
        billingCycle: 'monthly',
        nextBillingDate: new Date(Date.now() + 25 * 86400000)
      },
      limits: { maxRooms: 120, maxStaff: 60, maxRequestsPerMonth: 8000, maxAICallsPerMonth: 3000, maxStorageGB: 20 },
      usage: { requests: 142, aiCalls: 89, storageGB: 1.8 },
      supportedLanguages: ['English', 'Hindi', 'Marathi', 'German'],
      facilities: ['All-day Dining Pavilion', 'Infinity Swimming Pool', 'Rejuvenation Spa', '24/7 Fitness Center', 'Conference Banquets', 'Valet Parking']
    });

    // Hotel 2: The Meridian Mumbai
    const meridianMumbai = await Hotel.create({
      name: 'The Meridian Mumbai',
      subdomain: 'meridianmumbai',
      hotelCode: 'TMM',
      address: {
        street: 'Marine Drive Coastal Avenue',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400020'
      },
      contactEmail: 'contact@meridianmumbai.com',
      contactPhone: '+91 22 4500 8800',
      status: 'active',
      subscription: { plan: 'essential', status: 'active', price: 4999 }
    });

    // Hotel 3: Azure Palace Bengaluru
    const azureBengaluru = await Hotel.create({
      name: 'Azure Palace Bengaluru',
      subdomain: 'azurepalace',
      hotelCode: 'APB',
      address: {
        street: 'Indiranagar 100ft Luxury Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560038'
      },
      contactEmail: 'welcome@azurepalace.com',
      contactPhone: '+91 80 5522 9900',
      status: 'active',
      subscription: { plan: 'enterprise', status: 'active', price: 24999 }
    });

    const hotelId = grandPune._id;

    // Create Subscription record for Pune
    await Subscription.create({
      hotelId,
      plan: 'professional',
      status: 'active',
      price: 9999
    });

    console.log('Creating Departments for StayFlow Grand Pune...');
    const depts = [
      { name: 'Housekeeping', description: 'Room cleaning, linens, amenities, and turn-down services.' },
      { name: 'Maintenance', description: 'HVAC, plumbing, electrical, carpentry, and safety systems.' },
      { name: 'Front Desk', description: 'Guest check-in, check-out, concierge, billing, and luggage handling.' },
      { name: 'Room Service', description: 'In-room food & beverage dining orders and tray pickups.' },
      { name: 'Security', description: 'Guest safety, keycard access, patrol, and emergency protocols.' }
    ];

    const departmentDocs = {};
    for (const d of depts) {
      const doc = await Department.create({ ...d, hotelId, active: true });
      departmentDocs[d.name] = doc;
    }

    console.log('Creating Rooms for StayFlow Grand Pune...');
    const roomDocs = {};
    const roomsToSeed = [
      { roomNumber: '101', floor: 1, type: 'standard', status: 'available' },
      { roomNumber: '102', floor: 1, type: 'standard', status: 'occupied' },
      { roomNumber: '103', floor: 1, type: 'deluxe', status: 'maintenance' },
      { roomNumber: '201', floor: 2, type: 'deluxe', status: 'occupied' },
      { roomNumber: '204', floor: 2, type: 'deluxe', status: 'occupied' },
      { roomNumber: '305', floor: 3, type: 'suite', status: 'occupied' },
      { roomNumber: '308', floor: 3, type: 'suite', status: 'occupied' },
      { roomNumber: '312', floor: 3, type: 'suite', status: 'occupied' }, // Target guest demo room
      { roomNumber: '401', floor: 4, type: 'family', status: 'available' },
      { roomNumber: '405', floor: 4, type: 'family', status: 'occupied' },
      { roomNumber: '501', floor: 5, type: 'suite', status: 'occupied' }
    ];

    for (const r of roomsToSeed) {
      const room = await Room.create({
        hotelId,
        roomNumber: r.roomNumber,
        floor: r.floor,
        type: r.type,
        status: r.status,
        qrCode: `/guest?room=${r.roomNumber}`
      });
      roomDocs[r.roomNumber] = room;
    }

    console.log('Creating Catalog Services...');
    const servicesToSeed = [
      { name: 'Extra Towels', category: 'Housekeeping', departmentId: departmentDocs['Housekeeping']._id, defaultPriority: 'Low', defaultSLAMinutes: 30, description: 'Fresh set of plush bath and hand towels delivered to room.' },
      { name: 'Extra Pillow', category: 'Housekeeping', departmentId: departmentDocs['Housekeeping']._id, defaultPriority: 'Low', defaultSLAMinutes: 30, description: 'Feather or memory foam pillow with fresh pillowcase.' },
      { name: 'Drinking Water', category: 'Housekeeping', departmentId: departmentDocs['Housekeeping']._id, defaultPriority: 'Low', defaultSLAMinutes: 20, description: 'Complimentary glass bottles of chilled Himalayan spring water.' },
      { name: 'Room Cleaning', category: 'Housekeeping', departmentId: departmentDocs['Housekeeping']._id, defaultPriority: 'Medium', defaultSLAMinutes: 60, description: 'Full room tidying, vacuuming, bed making, and bathroom sanitation.' },
      { name: 'Laundry Service', category: 'Housekeeping', departmentId: departmentDocs['Housekeeping']._id, defaultPriority: 'Medium', defaultSLAMinutes: 120, description: 'Express washing, dry-cleaning, and pressing with return in 4 hours.' },
      { name: 'Iron & Ironing Board', category: 'Housekeeping', departmentId: departmentDocs['Housekeeping']._id, defaultPriority: 'Low', defaultSLAMinutes: 25, description: 'Steam iron with folding ironing board.' },
      { name: 'AC Inspection / Cooling', category: 'Maintenance', departmentId: departmentDocs['Maintenance']._id, defaultPriority: 'High', defaultSLAMinutes: 30, description: 'Technician diagnostics for temperature, thermostat, or airflow issue.' },
      { name: 'Plumbing / Leak Repair', category: 'Maintenance', departmentId: departmentDocs['Maintenance']._id, defaultPriority: 'High', defaultSLAMinutes: 30, description: 'Inspection and fix for tap leakage, shower drain, or toilet flush.' },
      { name: 'Wi-Fi / TV Assistance', category: 'Maintenance', departmentId: departmentDocs['Maintenance']._id, defaultPriority: 'Medium', defaultSLAMinutes: 45, description: 'In-room high-speed network setup or smart TV troubleshooting.' },
      { name: 'Room Service Breakfast', category: 'Room Service', departmentId: departmentDocs['Room Service']._id, defaultPriority: 'Medium', defaultSLAMinutes: 35, description: 'Continental, American, or Indian hot breakfast platter.' },
      { name: 'Late Checkout Request', category: 'Front Desk', departmentId: departmentDocs['Front Desk']._id, defaultPriority: 'Low', defaultSLAMinutes: 60, description: 'Extend stay departure time past standard 11:00 AM.' },
      { name: 'Luggage Assistance', category: 'Front Desk', departmentId: departmentDocs['Front Desk']._id, defaultPriority: 'Low', defaultSLAMinutes: 20, description: 'Bell desk assistance with luggage transfer or temporary storage.' }
    ];

    for (const s of servicesToSeed) {
      await Service.create({ ...s, hotelId, active: true });
    }

    console.log('Creating Seed Users and Demo Accounts...');
    const demoPassword = 'StayFlow@2026';

    // 1. ADMIN
    const adminUser = await User.create({
      name: 'Vikramaditya Singhania',
      email: 'admin@stayflow.demo',
      phone: '+91 98200 11223',
      password: demoPassword,
      role: ROLES.ADMIN,
      hotelId,
      active: true
    });

    // 2. MANAGER
    const managerUser = await User.create({
      name: 'Aditi Rao',
      email: 'manager@stayflow.demo',
      phone: '+91 98200 33445',
      password: demoPassword,
      role: ROLES.MANAGER,
      hotelId,
      active: true
    });

    // Update department manager
    await Department.updateMany({ hotelId }, { managerId: managerUser._id });

    // 3. PRIMARY DEMO STAFF (Maintenance)
    const staffUser = await User.create({
      name: 'Rohan Deshmukh',
      email: 'staff@stayflow.demo',
      phone: '+91 98200 55667',
      password: demoPassword,
      role: ROLES.STAFF,
      hotelId,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      employeeId: 'EMP-M01',
      skills: ['HVAC', 'Air Conditioning', 'Thermostats', 'Plumbing', 'Electrical'],
      active: true
    });

    // Additional Staff
    const staff2 = await User.create({
      name: 'Sunita Sharma',
      email: 'sunita.housekeeping@stayflow.demo',
      phone: '+91 98200 77889',
      password: demoPassword,
      role: ROLES.STAFF,
      hotelId,
      departmentId: departmentDocs['Housekeeping']._id,
      department: 'Housekeeping',
      employeeId: 'EMP-H02',
      skills: ['Room Cleaning', 'Linen Management', 'Turn-down', 'Deep Clean'],
      active: true
    });

    const staff3 = await User.create({
      name: 'Karan Mehra',
      email: 'karan.frontdesk@stayflow.demo',
      phone: '+91 98200 99001',
      password: demoPassword,
      role: ROLES.STAFF,
      hotelId,
      departmentId: departmentDocs['Front Desk']._id,
      department: 'Front Desk',
      employeeId: 'EMP-F03',
      skills: ['Concierge', 'VIP Relations', 'Billing', 'Keycards'],
      active: true
    });

    // 4. DEMO GUEST (Room 312)
    const guestUser = await User.create({
      name: 'Dr. Arjun Kapoor',
      email: 'guest@stayflow.demo',
      phone: '+91 98211 44556',
      password: demoPassword,
      role: ROLES.GUEST,
      hotelId,
      roomId: roomDocs['312']._id,
      roomNumber: '312',
      checkIn: new Date(Date.now() - 2 * 86400000),
      checkOut: new Date(Date.now() + 2 * 86400000),
      preferences: {
        language: 'English',
        pillowType: 'Soft Feather',
        housekeepingTime: 'Morning (10:00 AM)',
        frequentlyRequested: ['Drinking Water', 'Extra Towels', 'Late Checkout']
      },
      active: true
    });

    // Additional Guest in Room 308 for Trend testing
    const guest308 = await User.create({
      name: 'Meera Nambiar',
      email: 'meera.nambiar@guest.demo',
      password: demoPassword,
      role: ROLES.GUEST,
      hotelId,
      roomId: roomDocs['308']._id,
      roomNumber: '308',
      active: true
    });

    console.log('Creating Knowledge Documents with Vector Chunks...');
    const faqContent = `
# Hotel Information & Frequently Asked Questions

## Restaurant & Dining Hours
Breakfast is served at The Royal Pavilion on the Lobby level daily from 7:00 AM to 10:30 AM.
Lunch is available from 12:30 PM to 3:30 PM.
Dinner is hosted from 7:00 PM to 11:30 PM with live classical Indian instrumental music on weekends.
24/7 in-room dining is available by tapping Room Service in your StayFlow guest app or dialing 2.

## Swimming Pool & Wellness
The outdoor Infinity Deck pool is located on the 4th Floor and open daily from 6:00 AM to 10:00 PM.
Complimentary pool towels and sun lounger services are provided by pool attendants. Children under 14 must be supervised by an adult at all times.
The Rejuvenation Spa operates between 8:00 AM and 9:00 PM on the 4th Floor. Prior booking is recommended.

## Fitness Center (Gym)
Our state-of-the-art TechnoGym fitness center is open 24 hours daily on the 4th Floor. Access is via your digital keycard. Personal training sessions are available upon request from 7:00 AM to 7:00 PM.

## Wi-Fi & Internet
High-speed Wi-Fi is complimentary across all rooms and public venues. Connect to "StayFlow_Grand_Guest" and enter your Room Number and Last Name to authenticate. Bandwidth supports seamless 4K video conferencing and streaming.

## Check-In & Check-Out Times
Standard check-in time is 2:00 PM. Check-out time is 11:00 AM.
Late check-out until 3:00 PM can be requested via the StayFlow Guest app subject to availability.
Express digital check-out is accessible with one tap directly from your profile.

## Valet Parking & Airport Shuttle
Complimentary 24/7 valet parking is available at the main portico. Chauffeur-driven luxury airport transfers to Pune International Airport (PNQ) can be scheduled with the Concierge desk 3 hours in advance.

## Emergency Contacts
For medical or fire emergencies, dial 99 or touch the Emergency button on your room telephone. An in-house physician is on call 24/7.
`;

    const sopContent = `
# Standard Operating Procedures (SOP) — Engineering & Maintenance

## SOP-ENG-01: HVAC / Air Conditioning Troubleshooting
When a guest reports that the AC isn't cooling or is making unusual noises, follow these sequential steps:
1. Verify Thermostat Settings: Check that the wall control unit is switched to 'COOL' mode and set between 21°C and 23°C. Ensure the window sensors haven't disabled cooling due to an open balcony door.
2. Power & Circuit Breakers: Inspect the sub-distribution breaker board in the service duct for tripped 16A miniature circuit breakers.
3. Air Filter Inspection: Slide out the return air dust filter grille. Wash or replace clogged filters that restrict airflow.
4. Chilled Water Actuator Valve: Check if the 2-way fan coil unit valve actuator is responding to thermostat signals. If stuck closed, manually cycle or replace the actuator head.
5. Compressor / Blower Noise: Listen for motor bearing rattle or fan belt slippage. If severe vibration exists, turn off unit and lubricate or replace the blower assembly.
6. Escalation: If cooling capacity does not recover within 20 minutes, escalate immediately to Duty Chief Engineer and log request status as escalated.

## SOP-ENG-02: Bathroom Plumbing & Water Leakage
1. Immediate Isolation: Locate the secondary angle valve under the basin or behind the access panel to isolate water supply and stop overflow.
2. Wet Extraction: Alert housekeeping to deploy wet vacuum extraction within 10 minutes to prevent carpet or timber flooring damage.
3. Seal & Washer Replacement: Replace worn ceramic cartridges or flexible braided inlet hoses. Never use temporary adhesive tape on pressurized potable lines.
4. Post-Repair Verification: Test under full mains pressure for 5 minutes. Wipe all fittings dry and take a completion proof photo before closing the task.
`;

    // Process and save documents
    const faqChunks = RAGService.chunkContent(faqContent);
    await KnowledgeDocument.create({
      hotelId,
      title: 'Hotel Amenities & Guest FAQ Guide',
      category: 'faq',
      description: 'Comprehensive directory of dining hours, pool, gym, Wi-Fi, and check-in/out policies.',
      content: faqContent,
      chunks: faqChunks,
      status: 'indexed',
      uploadedBy: adminUser._id
    });

    const sopChunks = RAGService.chunkContent(sopContent);
    await KnowledgeDocument.create({
      hotelId,
      title: 'Engineering & Maintenance SOP Manual',
      category: 'sop',
      description: 'Standard operational procedures for HVAC troubleshooting, plumbing leakage, and electrical safety.',
      content: sopContent,
      chunks: sopChunks,
      status: 'indexed',
      uploadedBy: adminUser._id
    });

    console.log('Creating Realistic Active and Historical Requests...');

    // Scenario 1: Target Room 312 AC Issue (Active, High Priority, Assigned to Rohan)
    const req312 = await Request.create({
      hotelId,
      guestId: guestUser._id,
      roomId: roomDocs['312']._id,
      roomNumber: '312',
      type: 'issue',
      category: 'HVAC',
      subcategory: 'Cooling Failure & Noise',
      description: "The AC unit in Room 312 is making a loud buzzing noise and isn't cooling properly. The room is uncomfortably warm.",
      images: ['https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80'],
      priority: PRIORITY_LEVELS.HIGH,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      slaMinutes: 30,
      slaDeadline: new Date(Date.now() + 18 * 60000), // 18m remaining
      assignedTo: staffUser._id,
      status: REQUEST_STATUS.IN_PROGRESS,
      aiAnalysis: {
        category: 'HVAC',
        subcategory: 'Cooling Failure & Noise',
        confidence: 0.94,
        priority: 'High',
        detectedIssues: ['HVAC cooling failure with abnormal blower noise detected'],
        keywords: ['ac', 'cooling', 'noise', 'temperature'],
        summary: 'Inspect AC unit for cooling failure and unusual blower noise in Room 312.'
      },
      timeline: [
        { action: 'REPORTED', by: guestUser.name, note: 'Guest submitted issue via StayFlow app' },
        { action: 'ASSIGNED', by: 'Smart Assignment Engine', note: 'Assigned to Rohan Deshmukh (HVAC skill match, score 90/100)' },
        { action: 'ACCEPTED', by: staffUser.name, note: 'Staff acknowledged task' },
        { action: 'IN_PROGRESS', by: staffUser.name, note: 'Staff dispatched with diagnostic toolkit' }
      ]
    });

    const task312 = await Task.create({
      hotelId,
      requestId: req312._id,
      assignedTo: staffUser._id,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      category: 'HVAC',
      priority: 'High',
      roomId: roomDocs['312']._id,
      roomNumber: '312',
      description: "The AC unit in Room 312 is making a loud buzzing noise and isn't cooling properly.",
      aiSummary: 'Inspect AC unit for cooling failure and unusual blower noise in Room 312.',
      assignmentReason: 'Assigned to Rohan Deshmukh based on HVAC skill expertise and immediate availability (score 90/100).',
      slaMinutes: 30,
      slaDeadline: req312.slaDeadline,
      status: TASK_STATUS.IN_PROGRESS,
      startedAt: new Date(Date.now() - 12 * 60000)
    });

    // Scenario 2: Room 308 Plumbing Leak (Floor 3)
    const req308 = await Request.create({
      hotelId,
      guestId: guest308._id,
      roomId: roomDocs['308']._id,
      roomNumber: '308',
      type: 'issue',
      category: 'Plumbing',
      subcategory: 'Tap Leakage',
      description: 'The bathroom basin tap has a steady drip that will not stop when turned off.',
      images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80'],
      priority: PRIORITY_LEVELS.HIGH,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      slaMinutes: 30,
      slaDeadline: new Date(Date.now() + 8 * 60000), // 8m remaining (At Risk!)
      assignedTo: staffUser._id,
      status: REQUEST_STATUS.ASSIGNED,
      aiAnalysis: {
        category: 'Plumbing',
        subcategory: 'Tap Leakage',
        confidence: 0.91,
        priority: 'High',
        summary: 'Inspect bathroom basin tap for steady water leak.'
      },
      timeline: [
        { action: 'REPORTED', by: guest308.name, note: 'Guest reported tap dripping' },
        { action: 'ASSIGNED', by: 'Smart Assignment Engine', note: 'Assigned based on plumbing skill' }
      ]
    });

    await Task.create({
      hotelId,
      requestId: req308._id,
      assignedTo: staffUser._id,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      category: 'Plumbing',
      priority: 'High',
      roomId: roomDocs['308']._id,
      roomNumber: '308',
      description: 'The bathroom basin tap has a steady drip.',
      aiSummary: 'Inspect bathroom basin tap for steady water leak.',
      assignmentReason: 'Assigned to Rohan Deshmukh based on Plumbing skill match.',
      slaMinutes: 30,
      slaDeadline: req308.slaDeadline,
      status: TASK_STATUS.ASSIGNED
    });

    // Scenario 3: Room 305 AC Complaint (Floor 3, to trigger HVAC trend)
    const req305 = await Request.create({
      hotelId,
      guestId: guestUser._id,
      roomId: roomDocs['305']._id,
      roomNumber: '305',
      type: 'issue',
      category: 'HVAC',
      subcategory: 'Thermostat Lag',
      description: 'Room 305 thermostat resets to 26C automatically. AC feels weak.',
      priority: PRIORITY_LEVELS.HIGH,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      slaMinutes: 30,
      slaDeadline: new Date(Date.now() - 5 * 60000), // Breached!
      assignedTo: staffUser._id,
      status: REQUEST_STATUS.ASSIGNED,
      timeline: [{ action: 'REPORTED', by: 'Guest 305', note: 'AC resetting temperature' }]
    });

    await Task.create({
      hotelId,
      requestId: req305._id,
      assignedTo: staffUser._id,
      departmentId: departmentDocs['Maintenance']._id,
      department: 'Maintenance',
      category: 'HVAC',
      priority: 'High',
      roomId: roomDocs['305']._id,
      roomNumber: '305',
      description: 'Thermostat resets to 26C automatically.',
      assignmentReason: 'Assigned to Rohan Deshmukh',
      slaMinutes: 30,
      slaDeadline: req305.slaDeadline,
      status: TASK_STATUS.ASSIGNED
    });

    // Scenario 4: Historical Completed Request with 5-Star Feedback (Room 204)
    const req204 = await Request.create({
      hotelId,
      guestId: guestUser._id,
      roomId: roomDocs['204']._id,
      roomNumber: '204',
      type: 'service',
      category: 'Extra Towels',
      description: 'Please provide two extra bath towels and face cloths.',
      priority: PRIORITY_LEVELS.LOW,
      departmentId: departmentDocs['Housekeeping']._id,
      department: 'Housekeeping',
      slaMinutes: 30,
      slaDeadline: new Date(Date.now() - 3 * 3600000),
      assignedTo: staff2._id,
      status: REQUEST_STATUS.COMPLETED,
      completedAt: new Date(Date.now() - 3.5 * 3600000),
      resolutionTime: 14, // 14 min
      timeline: [
        { action: 'CREATED', by: 'Guest', note: 'Service requested' },
        { action: 'ASSIGNED', by: 'System', note: 'Assigned to Sunita Sharma' },
        { action: 'COMPLETED', by: staff2.name, note: 'Delivered fresh plush towels to room.' }
      ]
    });

    await Task.create({
      hotelId,
      requestId: req204._id,
      assignedTo: staff2._id,
      departmentId: departmentDocs['Housekeeping']._id,
      department: 'Housekeeping',
      category: 'Extra Towels',
      priority: 'Low',
      roomId: roomDocs['204']._id,
      roomNumber: '204',
      description: 'Deliver two extra bath towels.',
      slaMinutes: 30,
      slaDeadline: req204.slaDeadline,
      status: TASK_STATUS.COMPLETED,
      startedAt: new Date(Date.now() - 3.7 * 3600000),
      completedAt: req204.completedAt,
      resolutionTime: 14,
      resolutionNotes: 'Delivered fresh towels to guest. Guest satisfied.'
    });

    const fb204 = await Feedback.create({
      hotelId,
      requestId: req204._id,
      guestId: guestUser._id,
      rating: 5,
      comment: 'Super fast delivery, towels were warm and luxurious!',
      resolutionSatisfied: true
    });
    req204.feedback = { rating: 5, comment: fb204.comment, resolutionSatisfied: true, createdAt: fb204.createdAt };
    await req204.save();

    console.log('Seeding Issue Trends...');
    await IssueTrend.create({
      hotelId,
      category: 'HVAC',
      subcategory: 'Cooling Failure',
      floor: 3,
      rooms: ['305', '308', '312'],
      count: 7,
      timeRange: '48 hours',
      severity: 'High',
      insight: 'Multiple HVAC-related requests are concentrated on Floor 3 (7 complaints across 3 rooms in 48h).',
      recommendedAction: 'Schedule preventive HVAC inspection and chilled water actuator check for Floor 3 rooms.',
      status: 'active'
    });

    console.log('Seeding Safety & Compliance Checks...');
    const safetyItems = [
      { category: 'Fire Extinguisher', location: 'Floor 3 Service Corridor East', description: 'Annual hydrostatic pressure & seal inspection', dueDate: new Date(Date.now() + 2 * 86400000), status: 'due_soon', assignedTo: staffUser._id },
      { category: 'Emergency Exit', location: 'Floor 1 Main Stairwell', description: 'Illuminated battery backup & push-bar test', dueDate: new Date(Date.now() - 1 * 86400000), status: 'completed', completedAt: new Date(Date.now() - 1 * 86400000), notes: 'All exit lights functional with 90m battery life.', assignedTo: staffUser._id },
      { category: 'Pool Safety', location: '4th Floor Infinity Pool Deck', description: 'Water PH & chlorine balance test + lifebuoy verification', dueDate: new Date(Date.now() + 1 * 86400000), status: 'due_soon', assignedTo: staff2._id },
      { category: 'Kitchen Safety', location: 'Ground Floor Main Production Kitchen', description: 'Gas leak sensor calibration & exhaust hood fire damper test', dueDate: new Date(Date.now() - 2 * 86400000), status: 'overdue', notes: 'Scheduled technician postponed inspection.', assignedTo: staffUser._id }
    ];

    for (const s of safetyItems) {
      await SafetyCheck.create({ ...s, hotelId });
    }

    console.log('Seeding Upsell & Guest Offers...');
    await Offer.create({
      hotelId,
      guestId: guestUser._id,
      type: 'Late Checkout',
      title: 'Extended Stay: Late Checkout at 3:00 PM',
      description: 'Enjoy a leisurely departure with guaranteed late checkout up to 3:00 PM and access to the pool deck.',
      price: 1500,
      estimatedAcceptance: 78,
      status: 'recommended'
    });

    await Offer.create({
      hotelId,
      guestId: guestUser._id,
      type: 'Spa',
      title: 'Ayurvedic Rejuvenation Massage (60 min)',
      description: 'Exclusive 20% privilege at Rejuvenation Spa on signature warm herbal oil therapy.',
      price: 3200,
      estimatedAcceptance: 65,
      status: 'recommended'
    });

    await Offer.create({
      hotelId,
      guestId: guest308._id,
      type: 'Room Upgrade',
      title: 'Penthouse Terrace Suite Upgrade',
      description: 'Upgrade to panoramic private balcony suite with complimentary evening lounge cocktails.',
      price: 4500,
      estimatedAcceptance: 82,
      status: 'accepted',
      sentAt: new Date(Date.now() - 24 * 3600000),
      acceptedAt: new Date(Date.now() - 18 * 3600000)
    });

    console.log('Seeding Notifications & Activity Logs...');
    await Notification.create({
      hotelId,
      userId: staffUser._id,
      type: 'task_assigned',
      title: 'New High Priority Task: Room 312',
      message: 'AC cooling failure and noise reported in Room 312. SLA: 30 minutes.',
      requestId: req312._id,
      taskId: task312._id
    });

    await ActivityLog.create({
      hotelId,
      userId: adminUser._id,
      userName: adminUser.name,
      role: 'admin',
      action: 'INITIALIZE_HOTEL_SETUP',
      resource: 'Hotel',
      resourceId: hotelId.toString(),
      metadata: { hotelCode: 'SFGP', totalRooms: roomsToSeed.length }
    });

    console.log('====================================================');
    console.log('SUCCESS: StayFlow Database Seed Completed!');
    console.log('Demo Credentials:');
    console.log('Hotel Code: SFGP (StayFlow Grand Pune)');
    console.log('1. Admin:   admin@stayflow.demo   | Password: ' + demoPassword);
    console.log('2. Manager: manager@stayflow.demo | Password: ' + demoPassword);
    console.log('3. Staff:   staff@stayflow.demo   | Password: ' + demoPassword);
    console.log('4. Guest:   guest@stayflow.demo   | Password: ' + demoPassword + ' (Room 312)');
    console.log('====================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
}

seed();

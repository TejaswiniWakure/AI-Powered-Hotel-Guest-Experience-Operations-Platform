const mongoose = require('mongoose');
const { Department, Service, ProblemCategory, Hotel } = require('../models');
const MenuItem = require('../models/MenuItem');
const MenuSettings = require('../models/MenuSettings');
const { PRIORITY_LEVELS } = require('../config/constants');

const DEPARTMENTS = [
  { name: 'Housekeeping', description: 'Cleaning and room maintenance' },
  { name: 'Maintenance', description: 'Equipment and facility repair' },
  { name: 'Front Desk', description: 'Guest reception and inquiries' },
  { name: 'Room Service', description: 'In-room dining and amenities' }
];

const COMPREHENSIVE_SERVICES = [
  // Housekeeping
  { name: 'Extra towels', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'towel', description: 'Fresh bath and hand towels', estimatedMinutes: 20, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: true, requiresSchedule: false, displayOrder: 1, popular: true },
  { name: 'Extra pillows', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'pillow', description: 'Feather or memory foam pillows', estimatedMinutes: 20, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: true, requiresSchedule: false, displayOrder: 2 },
  { name: 'Blankets', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'blanket', description: 'Extra warm blankets', estimatedMinutes: 20, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: true, requiresSchedule: false, displayOrder: 3 },
  { name: 'Drinking water', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'water', description: 'Bottled drinking water', estimatedMinutes: 15, defaultSLAMinutes: 20, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: true, requiresSchedule: false, displayOrder: 4, popular: true },
  { name: 'Room cleaning', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'broom', description: 'Request full room cleaning', estimatedMinutes: 45, defaultSLAMinutes: 60, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: true, displayOrder: 5, popular: true },
  { name: 'Bathroom cleaning', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'spray', description: 'Quick bathroom refresh', estimatedMinutes: 30, defaultSLAMinutes: 45, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: true, displayOrder: 6 },
  { name: 'Laundry pickup', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'shirt', description: 'Pickup for washing & ironing', estimatedMinutes: 15, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: false, requiresSchedule: true, displayOrder: 7 },
  { name: 'Iron and ironing board', category: 'Housekeeping', departmentName: 'Housekeeping', icon: 'iron', description: 'Delivery of iron and board', estimatedMinutes: 15, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: false, requiresSchedule: false, displayOrder: 8 },

  // Maintenance
  { name: 'AC or heating problem', category: 'Maintenance', departmentName: 'Maintenance', icon: 'thermometer', description: 'Report temperature issues', estimatedMinutes: 30, defaultSLAMinutes: 45, defaultPriority: PRIORITY_LEVELS.HIGH, requiresQuantity: false, requiresSchedule: false, displayOrder: 1, popular: true },
  { name: 'TV problem', category: 'Maintenance', departmentName: 'Maintenance', icon: 'tv', description: 'Issues with TV or remote', estimatedMinutes: 30, defaultSLAMinutes: 60, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: false, displayOrder: 2 },
  { name: 'Wi-Fi problem', category: 'Maintenance', departmentName: 'Maintenance', icon: 'wifi', description: 'Internet connectivity issues', estimatedMinutes: 20, defaultSLAMinutes: 45, defaultPriority: PRIORITY_LEVELS.HIGH, requiresQuantity: false, requiresSchedule: false, displayOrder: 3 },
  { name: 'Light or power problem', category: 'Maintenance', departmentName: 'Maintenance', icon: 'zap', description: 'Bulb replacement or power issues', estimatedMinutes: 20, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.HIGH, requiresQuantity: false, requiresSchedule: false, displayOrder: 4 },
  { name: 'Plumbing problem', category: 'Maintenance', departmentName: 'Maintenance', icon: 'droplet', description: 'Leaks, drains, or toilet issues', estimatedMinutes: 30, defaultSLAMinutes: 45, defaultPriority: PRIORITY_LEVELS.HIGH, requiresQuantity: false, requiresSchedule: false, displayOrder: 5 },
  { name: 'Furniture problem', category: 'Maintenance', departmentName: 'Maintenance', icon: 'sofa', description: 'Broken or damaged furniture', estimatedMinutes: 60, defaultSLAMinutes: 120, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: false, displayOrder: 6 },

  // Front Desk
  { name: 'Extra key/card', category: 'Front Desk', departmentName: 'Front Desk', icon: 'key', description: 'Request an additional room key', estimatedMinutes: 10, defaultSLAMinutes: 15, defaultPriority: PRIORITY_LEVELS.LOW, requiresQuantity: true, requiresSchedule: false, displayOrder: 1 },
  { name: 'Late checkout request', category: 'Front Desk', departmentName: 'Front Desk', icon: 'clock', description: 'Request extended stay', estimatedMinutes: 15, defaultSLAMinutes: 30, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: false, displayOrder: 2 },
  { name: 'Wake-up call', category: 'Front Desk', departmentName: 'Front Desk', icon: 'bell-ring', description: 'Schedule a wake-up call', estimatedMinutes: 5, defaultSLAMinutes: 10, defaultPriority: PRIORITY_LEVELS.HIGH, requiresQuantity: false, requiresSchedule: true, displayOrder: 3 },
  { name: 'Luggage assistance', category: 'Front Desk', departmentName: 'Front Desk', icon: 'luggage', description: 'Help with baggage transport', estimatedMinutes: 15, defaultSLAMinutes: 20, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: true, displayOrder: 4 },
  { name: 'Taxi or airport transfer', category: 'Front Desk', departmentName: 'Front Desk', icon: 'car', description: 'Arrange transportation', estimatedMinutes: 20, defaultSLAMinutes: 60, defaultPriority: PRIORITY_LEVELS.MEDIUM, requiresQuantity: false, requiresSchedule: true, displayOrder: 5 }
];

const INITIAL_MENU_ITEMS = [
  // Breakfast
  {
    name: 'Classic Breakfast',
    category: 'Breakfast',
    description: 'Choice of eggs, toasted brioche, seasonal fruit cup, with freshly brewed coffee or tea.',
    price: 450,
    foodType: 'non-vegetarian',
    allergens: ['egg', 'gluten', 'dairy'],
    dietaryTags: ['popular'],
    preparationMinutes: 20,
    availableHours: { start: '06:30', end: '11:00' },
    isPopular: true,
    displayOrder: 1,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Masala Omelette',
    category: 'Breakfast',
    description: 'Three-egg spiced omelette with onion, chili, and cilantro, served with grilled toast.',
    price: 280,
    foodType: 'non-vegetarian',
    allergens: ['egg', 'gluten'],
    spiceOptions: ['mild', 'medium', 'spicy'],
    preparationMinutes: 15,
    availableHours: { start: '06:30', end: '11:00' },
    displayOrder: 2,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'South Indian Breakfast',
    category: 'Breakfast',
    description: 'Steamed idlis and crispy medu vada served with traditional drumstick sambar and coconut chutneys.',
    price: 350,
    foodType: 'vegetarian',
    allergens: ['nuts'],
    dietaryTags: ['gluten_free', 'vegetarian'],
    preparationMinutes: 20,
    availableHours: { start: '06:30', end: '11:00' },
    displayOrder: 3,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80'
  },

  // Starters
  {
    name: 'Paneer Tikka',
    category: 'Starters',
    description: 'Char-grilled cottage cheese cubes marinated in tandoori spices and yogurt, served with mint chutney.',
    price: 420,
    foodType: 'vegetarian',
    allergens: ['dairy'],
    dietaryTags: ['vegetarian', 'chef_special'],
    spiceOptions: ['mild', 'medium', 'spicy'],
    isChefSpecial: true,
    preparationMinutes: 25,
    availableHours: { start: '12:00', end: '23:00' },
    displayOrder: 4,
    image: 'https://images.unsplash.com/photo-1567184109411-b28f21ee097a?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Spiced Chicken Wings',
    category: 'Starters',
    description: 'Crispy fried wings tossed in house smoky paprika and garlic glaze with blue cheese dip.',
    price: 480,
    foodType: 'non-vegetarian',
    allergens: ['dairy', 'gluten'],
    spiceOptions: ['mild', 'medium', 'spicy'],
    preparationMinutes: 20,
    availableHours: { start: '12:00', end: '23:00' },
    displayOrder: 5,
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&auto=format&fit=crop&q=80'
  },

  // Indian Mains
  {
    name: 'Paneer Butter Masala',
    category: 'Indian Mains',
    description: 'Cottage cheese simmered in a velvet tomato and butter gravy finished with dried fenugreek.',
    price: 459,
    foodType: 'vegetarian',
    allergens: ['dairy', 'nuts'],
    dietaryTags: ['vegetarian', 'popular'],
    spiceOptions: ['mild', 'medium', 'spicy'],
    isPopular: true,
    preparationMinutes: 25,
    availableHours: { start: '12:00', end: '23:00' },
    optionGroups: [
      {
        name: 'Choose Accompaniment',
        selectionType: 'single',
        required: false,
        options: [
          { name: 'Butter Naan', additionalPrice: 89, available: true },
          { name: 'Garlic Naan', additionalPrice: 109, available: true },
          { name: 'Jeera Rice', additionalPrice: 199, available: true },
          { name: 'Plain Basmati Rice', additionalPrice: 169, available: true }
        ]
      }
    ],
    addOns: [
      { name: 'Extra Paneer', additionalPrice: 90, available: true },
      { name: 'Extra Butter Gravy', additionalPrice: 50, available: true }
    ],
    displayOrder: 6,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Chicken Dum Biryani',
    category: 'Indian Mains',
    description: 'Long-grain basmati rice cooked on dum with marinated tender chicken cuts and fragrant saffron, served with mirchi ka salan and burani raita.',
    price: 520,
    foodType: 'non-vegetarian',
    allergens: ['dairy'],
    dietaryTags: ['halal', 'popular', 'chef_special'],
    spiceOptions: ['mild', 'medium', 'spicy'],
    isPopular: true,
    isChefSpecial: true,
    preparationMinutes: 30,
    availableHours: { start: '12:00', end: '23:00' },
    addOns: [
      { name: 'Extra Raita', additionalPrice: 40, available: true },
      { name: 'Boiled Egg', additionalPrice: 30, available: true }
    ],
    displayOrder: 7,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80'
  },

  // Continental
  {
    name: 'Vegetable Penne Arrabbiata',
    category: 'Continental',
    description: 'Penne pasta tossed in spicy San Marzano tomato sauce, garlic, and fresh basil, topped with aged parmesan.',
    price: 390,
    foodType: 'vegetarian',
    allergens: ['gluten', 'dairy'],
    dietaryTags: ['vegetarian'],
    spiceOptions: ['mild', 'medium', 'spicy'],
    preparationMinutes: 20,
    availableHours: { start: '12:00', end: '23:00' },
    addOns: [
      { name: 'Extra Garlic Bread (2 pcs)', additionalPrice: 80, available: true },
      { name: 'Extra Parmesan Cheese', additionalPrice: 60, available: true }
    ],
    displayOrder: 8,
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&auto=format&fit=crop&q=80'
  },

  // Sandwiches & Snacks
  {
    name: 'Gourmet Club Sandwich',
    category: 'Sandwiches & Snacks',
    description: 'Triple-decker toasted sandwich with smoked chicken, fried egg, lettuce, cheddar cheese, and dijon mayo, served with salted french fries.',
    price: 360,
    foodType: 'non-vegetarian',
    allergens: ['egg', 'gluten', 'dairy'],
    preparationMinutes: 15,
    availableHours: { start: '11:00', end: '23:00' },
    displayOrder: 9,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Crispy French Fries',
    category: 'Sandwiches & Snacks',
    description: 'Golden seasoned potato fries served with house garlic aioli and organic tomato ketchup.',
    price: 220,
    foodType: 'vegetarian',
    dietaryTags: ['gluten_free', 'vegan'],
    preparationMinutes: 10,
    availableHours: { start: '11:00', end: '23:59' },
    displayOrder: 10,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&auto=format&fit=crop&q=80'
  },

  // Desserts
  {
    name: 'Warm Chocolate Fudge Brownie',
    category: 'Desserts',
    description: 'Decadent Belgian dark chocolate walnut brownie served warm with a scoop of Madagascar vanilla bean gelato.',
    price: 250,
    foodType: 'vegetarian',
    allergens: ['dairy', 'gluten', 'nuts', 'egg'],
    dietaryTags: ['popular'],
    isPopular: true,
    preparationMinutes: 10,
    availableHours: { start: '11:00', end: '23:59' },
    displayOrder: 11,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop&q=80'
  },

  // Beverages
  {
    name: 'Signature Masala Chai',
    category: 'Beverages',
    description: 'Freshly brewed aromatic Assam CTC tea infused with crushed cardamom, ginger, and cinnamon.',
    price: 120,
    foodType: 'vegetarian',
    allergens: ['dairy'],
    preparationMinutes: 10,
    availableHours: { start: '00:00', end: '23:59' },
    displayOrder: 12,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Single Origin Cappuccino',
    category: 'Beverages',
    description: 'Double shot espresso pulled from Chikmagalur Arabica beans, topped with velvety steamed milk froth.',
    price: 180,
    foodType: 'vegetarian',
    allergens: ['dairy'],
    preparationMinutes: 10,
    availableHours: { start: '00:00', end: '23:59' },
    displayOrder: 13,
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Fresh Lime Soda',
    category: 'Beverages',
    description: 'Freshly squeezed Key lime juice with sparkling club soda, served sweet, salted, or mixed.',
    price: 150,
    foodType: 'vegetarian',
    dietaryTags: ['vegan', 'gluten_free'],
    preparationMinutes: 5,
    availableHours: { start: '00:00', end: '23:59' },
    displayOrder: 14,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80'
  },

  // Late Night
  {
    name: 'Midnight Masala Noodles',
    category: 'Late Night',
    description: 'Wok-tossed spicy instant noodles with garden vegetables, green chili, and butter.',
    price: 220,
    foodType: 'vegetarian',
    allergens: ['gluten'],
    preparationMinutes: 15,
    availableHours: { start: '23:00', end: '06:30' },
    displayOrder: 15,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80'
  },
  {
    name: 'Midnight Tea & Gourmet Cookie Box',
    category: 'Late Night',
    description: 'Pot of piping hot English breakfast tea served with an assortment of butter shortbread and chocolate cookies.',
    price: 180,
    foodType: 'vegetarian',
    allergens: ['dairy', 'gluten'],
    preparationMinutes: 10,
    availableHours: { start: '23:00', end: '06:30' },
    displayOrder: 16,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&auto=format&fit=crop&q=80'
  }
];

async function generateStarterDataForHotel(hotel) {
  try {
    // 1. Create Departments
    const createdDepartments = {};
    for (const dep of DEPARTMENTS) {
      const existing = await Department.findOne({ hotelId: hotel._id, name: dep.name });
      if (!existing) {
        const newDep = await Department.create({
          hotelId: hotel._id,
          name: dep.name,
          description: dep.description
        });
        createdDepartments[dep.name] = newDep._id;
      } else {
        createdDepartments[dep.name] = existing._id;
      }
    }

    // 2. Create Services
    for (const srv of COMPREHENSIVE_SERVICES) {
      const depId = createdDepartments[srv.departmentName];
      if (!depId) continue;

      const existingSrv = await Service.findOne({ hotelId: hotel._id, name: srv.name });
      if (!existingSrv) {
        await Service.create({
          hotelId: hotel._id,
          name: srv.name,
          category: srv.category,
          departmentId: depId,
          icon: srv.icon,
          description: srv.description,
          estimatedMinutes: srv.estimatedMinutes,
          slaMinutes: srv.defaultSLAMinutes,
          defaultSLAMinutes: srv.defaultSLAMinutes,
          defaultPriority: srv.defaultPriority,
          requiresQuantity: srv.requiresQuantity,
          requiresSchedule: srv.requiresSchedule,
          displayOrder: srv.displayOrder,
          popular: srv.popular || false,
          slug: srv.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          guestVisible: true
        });
      }
    }

    // 3. Create Menu Settings
    let menuSettings = await MenuSettings.findOne({ hotelId: hotel._id });
    if (!menuSettings) {
      await MenuSettings.create({
        hotelId: hotel._id,
        menuTitle: `${hotel.name} In-Room Dining`,
        menuDescription: 'Freshly prepared meals delivered directly to your room.',
        currency: 'INR',
        taxPercent: 5,
        serviceChargePercent: 10,
        defaultDeliveryMin: 25,
        defaultDeliveryMax: 35,
        kitchenStatus: 'open'
      });
    }

    // 4. Create Menu Items
    for (const item of INITIAL_MENU_ITEMS) {
      const existing = await MenuItem.findOne({ hotelId: hotel._id, name: item.name });
      if (!existing) {
        await MenuItem.create({
          ...item,
          hotelId: hotel._id,
          status: 'published',
          availability: 'available'
        });
      }
    }

    console.log(`Starter data and In-Room Dining menu generated for hotel: ${hotel.name}`);
  } catch (error) {
    console.error('Error generating starter data:', error);
  }
}

module.exports = {
  generateStarterDataForHotel
};

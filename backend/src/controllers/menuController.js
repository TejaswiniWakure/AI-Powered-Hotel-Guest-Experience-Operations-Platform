const MenuItem = require('../models/MenuItem');
const MenuSettings = require('../models/MenuSettings');
const FoodOrder = require('../models/FoodOrder');
const Hotel = require('../models/Hotel');
const Notification = require('../models/Notification');
const { successResponse, errorResponse } = require('../utils/response');
const { emitHotelEvent, emitUserEvent } = require('../services/socketService');

// ==========================================
// MANAGER MENU CONTROLLERS
// ==========================================

// GET /api/manager/menu
exports.getManagerMenuItems = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { category, status, availability, search, sort } = req.query;

    const filter = { hotelId };

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status.toLowerCase();
    }
    if (availability && availability !== 'All') {
      filter.availability = availability.toLowerCase();
    }
    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { dietaryTags: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    let sortOption = { updatedAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };

    const items = await MenuItem.find(filter).sort(sortOption).populate('updatedBy', 'name');

    // Summary counts for Manager Dashboard cards
    const [totalCount, publishedCount, availableCount, unavailableCount, draftCount] = await Promise.all([
      MenuItem.countDocuments({ hotelId, status: { $ne: 'archived' } }),
      MenuItem.countDocuments({ hotelId, status: 'published' }),
      MenuItem.countDocuments({ hotelId, status: 'published', availability: 'available' }),
      MenuItem.countDocuments({ hotelId, availability: 'unavailable', status: { $ne: 'archived' } }),
      MenuItem.countDocuments({ hotelId, status: 'draft' })
    ]);

    return successResponse(res, {
      items,
      summary: {
        total: totalCount,
        published: publishedCount,
        available: availableCount,
        unavailable: unavailableCount,
        draft: draftCount
      }
    });
  } catch (error) {
    console.error('getManagerMenuItems error:', error);
    return errorResponse(res, error.message);
  }
};

// POST /api/manager/menu
exports.createMenuItem = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const itemData = {
      ...req.body,
      hotelId,
      createdBy: req.user._id,
      updatedBy: req.user._id
    };

    const item = await MenuItem.create(itemData);

    emitHotelEvent(hotelId, 'menu:updated', { action: 'created', item });
    return successResponse(res, item, 'Menu item created successfully', 201);
  } catch (error) {
    console.error('createMenuItem error:', error);
    return errorResponse(res, error.message, 400);
  }
};

// GET /api/manager/menu/:id
exports.getMenuItemDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.hotelId;

    const item = await MenuItem.findOne({ _id: id, hotelId });
    if (!item) return errorResponse(res, 'Menu item not found', 404);

    return successResponse(res, item);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PUT /api/manager/menu/:id
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.hotelId;

    const item = await MenuItem.findOneAndUpdate(
      { _id: id, hotelId },
      { ...req.body, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!item) return errorResponse(res, 'Menu item not found', 404);

    emitHotelEvent(hotelId, 'menu:updated', { action: 'updated', item });
    return successResponse(res, item, 'Menu item updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

// PATCH /api/manager/menu/:id/toggle-availability
exports.toggleItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.hotelId;

    const item = await MenuItem.findOne({ _id: id, hotelId });
    if (!item) return errorResponse(res, 'Menu item not found', 404);

    item.availability = item.availability === 'available' ? 'unavailable' : 'available';
    item.updatedBy = req.user._id;
    await item.save();

    emitHotelEvent(hotelId, 'menu:updated', { action: 'availability_changed', itemId: item._id, availability: item.availability });
    return successResponse(res, item, `Item marked as ${item.availability}`);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/manager/menu/:id/status
exports.updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const hotelId = req.user.hotelId;

    if (!['draft', 'published', 'archived'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const item = await MenuItem.findOneAndUpdate(
      { _id: id, hotelId },
      { status, updatedBy: req.user._id },
      { new: true }
    );
    if (!item) return errorResponse(res, 'Menu item not found', 404);

    emitHotelEvent(hotelId, 'menu:updated', { action: 'status_changed', itemId: item._id, status });
    return successResponse(res, item, `Item moved to ${status}`);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// POST /api/manager/menu/:id/duplicate
exports.duplicateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.hotelId;

    const original = await MenuItem.findOne({ _id: id, hotelId }).lean();
    if (!original) return errorResponse(res, 'Original menu item not found', 404);

    delete original._id;
    delete original.createdAt;
    delete original.updatedAt;
    original.name = `${original.name} (Copy)`;
    original.status = 'draft';
    original.createdBy = req.user._id;
    original.updatedBy = req.user._id;

    const copy = await MenuItem.create(original);
    return successResponse(res, copy, 'Menu item duplicated as draft', 201);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// DELETE /api/manager/menu/:id
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const hotelId = req.user.hotelId;

    const deleted = await MenuItem.findOneAndDelete({ _id: id, hotelId });
    if (!deleted) return errorResponse(res, 'Menu item not found', 404);

    emitHotelEvent(hotelId, 'menu:updated', { action: 'deleted', itemId: id });
    return successResponse(res, {}, 'Menu item permanently removed');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// GET /api/manager/menu-settings
exports.getMenuSettings = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    let settings = await MenuSettings.findOne({ hotelId });

    if (!settings) {
      const hotel = await Hotel.findById(hotelId);
      settings = await MenuSettings.create({
        hotelId,
        menuTitle: `${hotel?.name || 'Hotel'} In-Room Dining`,
        updatedBy: req.user._id
      });
    }

    return successResponse(res, settings);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PUT /api/manager/menu-settings
exports.updateMenuSettings = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const settings = await MenuSettings.findOneAndUpdate(
      { hotelId },
      { ...req.body, hotelId, updatedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    emitHotelEvent(hotelId, 'menu:settings_updated', settings);
    return successResponse(res, settings, 'Menu settings saved successfully');
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// ==========================================
// GUEST MENU & ORDERING CONTROLLERS
// ==========================================

// GET /api/guest/menu
exports.getGuestMenu = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { category, search } = req.query;

    const filter = {
      hotelId,
      status: 'published'
    };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search && search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const [items, settings] = await Promise.all([
      MenuItem.find(filter).sort({ displayOrder: 1, isPopular: -1, name: 1 }),
      MenuSettings.findOne({ hotelId })
    ]);

    return successResponse(res, {
      items,
      settings: settings || {
        menuTitle: 'In-Room Dining',
        currency: 'INR',
        kitchenStatus: 'open',
        taxPercent: 5,
        serviceChargePercent: 10,
        defaultDeliveryMin: 25,
        defaultDeliveryMax: 35,
        guestNotice: 'Please inform us of any food allergies or dietary requirements before ordering.'
      }
    });
  } catch (error) {
    console.error('getGuestMenu error:', error);
    return errorResponse(res, error.message);
  }
};

// POST /api/guest/requests/food
exports.placeFoodOrder = async (req, res) => {
  try {
    const { items, scheduleType, scheduledAt, deliveryPreference, orderNotes } = req.body;
    const hotelId = req.user.hotelId;
    const roomNumber = req.user.roomNumber || '312';
    const guestId = req.user._id;
    const guestName = req.user.name || 'Guest';

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 'Your cart is empty. Please select food items.', 400);
    }

    // Verify settings for tax and service charge
    const settings = await MenuSettings.findOne({ hotelId });
    const taxRate = (settings?.taxPercent ?? 5) / 100;
    const serviceChargeRate = (settings?.serviceChargePercent ?? 10) / 100;
    const deliveryFee = settings?.deliveryFee || 0;

    let subtotal = 0;
    const validatedItems = [];

    for (const rawItem of items) {
      let menuItem = null;
      if (rawItem.menuItemId) {
        menuItem = await MenuItem.findOne({ _id: rawItem.menuItemId, hotelId });
      }

      const basePrice = menuItem ? menuItem.price : (rawItem.unitPrice || rawItem.basePrice || 0);
      const name = menuItem ? menuItem.name : rawItem.name;
      const quantity = Math.max(1, parseInt(rawItem.quantity, 10) || 1);

      // calculate add-ons & options additional price
      let extraPrice = 0;
      if (rawItem.selectedOptions && Array.isArray(rawItem.selectedOptions)) {
        extraPrice += rawItem.selectedOptions.reduce((sum, opt) => sum + (opt.additionalPrice || 0), 0);
      }
      if (rawItem.selectedAddOns && Array.isArray(rawItem.selectedAddOns)) {
        extraPrice += rawItem.selectedAddOns.reduce((sum, addOn) => sum + (addOn.additionalPrice || 0), 0);
      }

      const itemTotal = (basePrice + extraPrice) * quantity;
      subtotal += itemTotal;

      validatedItems.push({
        menuItemId: menuItem?._id || rawItem.menuItemId,
        name,
        quantity,
        basePrice,
        selectedOptions: rawItem.selectedOptions || [],
        selectedAddOns: rawItem.selectedAddOns || [],
        spiceLevel: rawItem.spiceLevel || null,
        specialInstructions: rawItem.specialInstructions || '',
        itemTotal
      });
    }

    const tax = Math.round(subtotal * taxRate);
    const serviceCharge = Math.round(subtotal * serviceChargeRate);
    const total = subtotal + tax + serviceCharge + deliveryFee;

    const orderNo = `FO-${Math.floor(1000 + Math.random() * 9000)}`;
    const estDelivery = new Date(Date.now() + (settings?.defaultDeliveryMin || 30) * 60000);

    const order = await FoodOrder.create({
      orderNo,
      hotelId,
      guestId,
      guestName,
      roomId: req.user.roomId,
      roomNumber,
      department: 'room_service',
      items: validatedItems,
      subtotal,
      tax,
      serviceCharge,
      deliveryFee,
      total,
      scheduleType: scheduleType || 'asap',
      scheduledAt: scheduledAt || null,
      deliveryPreference: deliveryPreference || 'knock',
      orderNotes: orderNotes || '',
      paymentMethod: 'charge_to_room',
      paymentStatus: 'charged_to_room',
      status: 'placed',
      estimatedDeliveryAt: estDelivery,
      timeline: [
        {
          status: 'placed',
          at: new Date(),
          label: 'Order placed by guest',
          note: `Charge to Room: ₹${total}`
        }
      ]
    });

    // Notify room service staff & managers in real time
    emitHotelEvent(hotelId, 'food_order:created', order);

    return successResponse(res, order, 'In-room dining order placed successfully', 201);
  } catch (error) {
    console.error('placeFoodOrder error:', error);
    return errorResponse(res, error.message);
  }
};

// ==========================================
// ORDERS MANAGEMENT (Manager & Staff)
// ==========================================

// GET /api/manager/food-orders
exports.getFoodOrders = async (req, res) => {
  try {
    const hotelId = req.user.hotelId;
    const { status } = req.query;

    const filter = { hotelId };
    if (status && status !== 'All') {
      filter.status = status;
    }

    const orders = await FoodOrder.find(filter)
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    return successResponse(res, orders);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

// PATCH /api/manager/food-orders/:id/status
exports.updateFoodOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    const hotelId = req.user.hotelId;

    const validStatuses = ['placed', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid order status', 400);
    }

    const order = await FoodOrder.findOne({ _id: id, hotelId });
    if (!order) return errorResponse(res, 'Order not found', 404);

    order.status = status;
    if (rejectionReason) order.rejectionReason = rejectionReason;
    if (status === 'delivered') order.deliveredAt = new Date();

    const statusLabels = {
      confirmed: 'Kitchen confirmed your order',
      preparing: 'Your food is now being prepared',
      out_for_delivery: 'Out for delivery to your room',
      delivered: 'Order delivered. Enjoy your meal!',
      rejected: `Order rejected: ${rejectionReason || 'Item unavailable'}`
    };

    order.timeline.push({
      status,
      at: new Date(),
      label: statusLabels[status] || `Status updated to ${status}`
    });

    await order.save();

    emitHotelEvent(hotelId, 'food_order:updated', order);
    emitUserEvent(order.guestId, 'notification_created', {
      title: `Room Service #${order.orderNo}`,
      message: statusLabels[status] || `Order is now ${status}`
    });

    return successResponse(res, order, `Order status updated to ${status}`);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

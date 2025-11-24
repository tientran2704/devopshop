const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const CafeTable = require('../models/CafeTable');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all orders (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username fullName')
      .populate('tableId', 'tableNumber')
      .sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Get my orders (authenticated)
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('tableId', 'tableNumber')
      .sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error getting my orders:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Get orders by table (authenticated)
router.get('/table/:tableId', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ tableId: req.params.tableId })
      .populate('userId', 'username fullName')
      .sort({ orderTime: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders by table:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Get order by ID (authenticated)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'username fullName')
      .populate('tableId', 'tableNumber');
    
    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found'
      });
    }
    
    // Check if user owns the order or is admin
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to view this order'
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Create order (authenticated)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { tableId, items } = req.body;

    // Validate items and get menu item details
    const orderItems = [];
    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(400).json({
          error: 'Bad Request',
          message: `Menu item ${item.menuItemId} not found`
        });
      }
      orderItems.push({
        menuItemId: menuItem._id,
        menuItemName: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    const order = new Order({
      userId: req.user.id,
      tableId,
      items: orderItems
    });

    await order.save();

    // Update table status
    await CafeTable.findByIdAndUpdate(tableId, { status: 'OCCUPIED' });

    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'username fullName')
      .populate('tableId', 'tableNumber');

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Update order status (admin only)
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        completedTime: status === 'COMPLETED' ? new Date() : undefined
      },
      { new: true, runValidators: true }
    )
      .populate('userId', 'username fullName')
      .populate('tableId', 'tableNumber');
    
    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found'
      });
    }

    // Update table status based on order status
    let tableId = order.tableId;
    // Handle both populated and non-populated tableId
    if (tableId && typeof tableId === 'object' && tableId._id) {
      tableId = tableId._id;
    } else if (tableId && typeof tableId === 'object' && tableId.id) {
      tableId = tableId.id;
    }
    
    if (status === 'COMPLETED') {
      // Check if there are other active orders for this table
      const activeOrders = await Order.find({
        tableId: tableId,
        status: { $in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] },
        _id: { $ne: order._id } // Exclude current order
      });
      
      // If no active orders, set table to AVAILABLE so it can be booked again
      if (activeOrders.length === 0) {
        await CafeTable.findByIdAndUpdate(tableId, { status: 'AVAILABLE' });
      } else {
        // If there are still active orders, keep table as OCCUPIED
        await CafeTable.findByIdAndUpdate(tableId, { status: 'OCCUPIED' });
      }
    } else if (status === 'CANCELLED') {
      // If order is cancelled, check if table should be freed
      const activeOrders = await Order.find({
        tableId: tableId,
        status: { $in: ['PENDING', 'CONFIRMED', 'PREPARING', 'READY'] },
        _id: { $ne: order._id } // Exclude current order
      });
      
      if (activeOrders.length === 0) {
        await CafeTable.findByIdAndUpdate(tableId, { status: 'AVAILABLE' });
      }
    } else if (status === 'PENDING' || status === 'CONFIRMED' || status === 'PREPARING' || status === 'READY') {
      // If order is active, set table to OCCUPIED
      await CafeTable.findByIdAndUpdate(tableId, { status: 'OCCUPIED' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

// Transfer table (admin only)
router.patch('/:id/transfer-table', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { newTableId } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { tableId: newTableId },
      { new: true, runValidators: true }
    )
      .populate('userId', 'username fullName')
      .populate('tableId', 'tableNumber');
    
    if (!order) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Order not found'
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Error transferring table:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message
    });
  }
});

module.exports = router;


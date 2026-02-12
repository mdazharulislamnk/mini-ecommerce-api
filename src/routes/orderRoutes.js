const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

// All routes require authentication
router.use(authMiddleware);

// Customer routes
router.post('/', orderController.placeOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrder);

// Admin only routes
router.get('/', roleMiddleware([ROLES.ADMIN]), orderController.getAllOrders);
router.put('/:id/status', roleMiddleware([ROLES.ADMIN]), orderController.updateStatus);

module.exports = router;
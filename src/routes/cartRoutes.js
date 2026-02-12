const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authMiddleware);

router.post('/add', cartController.addItem);
router.get('/', cartController.getCart);
router.put('/:cartItemId', cartController.updateItem);
router.delete('/:cartItemId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin only routes
router.post(
  '/',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  productController.create
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  productController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([ROLES.ADMIN]),
  productController.delete
);

module.exports = router;
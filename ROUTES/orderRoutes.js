const express = require('express');
const { placeOrder, getOrders, updateOrderStatus, getMyOrders, deleteOrder } = require('../controllers/orderController');
const { authenticateJWT, authenticateAdminJWT } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateJWT, placeOrder);

router.get('/', authenticateAdminJWT, getOrders);

router.patch('/:id', authenticateAdminJWT, updateOrderStatus);

router.get('/my-orders', authenticateJWT, getMyOrders);

router.delete('/:id', authenticateAdminJWT, deleteOrder);

module.exports = router;

const express = require('express');
const { addPizza, getPizzas, deletePizza, updatePizza } = require('../controllers/pizzaController');
const { authenticateAdminJWT } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateAdminJWT, addPizza);

router.get('/', getPizzas);

router.patch('/:pizzaId', authenticateAdminJWT, updatePizza);

router.delete('/:pizzaId', authenticateAdminJWT, deletePizza);

module.exports = router;

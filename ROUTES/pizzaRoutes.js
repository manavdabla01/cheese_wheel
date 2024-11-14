const express = require('express');
const { addPizza, getPizzas, deletePizza, updatePizza } = require('../CONTROLLERS/pizzaController');
const { authenticateAdminJWT } = require('../MIDDLEWARE/authMiddleware');
const router = express.Router();

router.post('/', authenticateAdminJWT, addPizza);

router.get('/', getPizzas);

router.patch('/:pizzaId', authenticateAdminJWT, updatePizza);

router.delete('/:pizzaId', authenticateAdminJWT, deletePizza);

module.exports = router;

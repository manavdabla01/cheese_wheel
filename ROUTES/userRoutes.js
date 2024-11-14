const express = require('express');
const { signup, login,getAllUsers, updateUser, deleteUser } = require('../controllers/userController');
const { authenticateJWT, authenticateAdminJWT } = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/all-users', authenticateAdminJWT, getAllUsers)

router.patch('/:userId', authenticateAdminJWT || authenticateJWT, updateUser);

router.delete('/:userId', authenticateAdminJWT || authenticateJWT, deleteUser);

module.exports = router;

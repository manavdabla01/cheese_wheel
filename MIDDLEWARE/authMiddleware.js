// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT authentication middleware for customers and admins
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Access denied, token missing!" });
    }

    try {
        const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifiedUser; // Attach decoded token to req.user
        next(); // Continue to the next middleware or route
    } catch (error) {
        res.status(403).json({ message: "Invalid token!" });
    }
}


// JWT Verification Middleware
const authenticateAdminJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err || user.role !== 'admin') {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized if no token
    }
};

module.exports = {
  authenticateJWT,
  authenticateAdminJWT
}
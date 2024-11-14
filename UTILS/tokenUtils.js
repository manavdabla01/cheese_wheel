// utils/tokenUtils.js
const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
    return jwt.sign(payload,process.env.JWT_SECRET, { expiresIn: '10h' });
};


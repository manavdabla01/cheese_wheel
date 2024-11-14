// controllers/userController.js
const User = require('../MODELS/usersModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../UTILS/tokenUtils');

// Signup (Admin or Customer)
const signup = async (req, res) => {
    console.log('Received signup request:', req.body); 
    const { username, email, password, role } = req.body;

    try {
        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('Username or Email already exists'); 
            return res.status(400).json({ Message: 'Username or Email already exists' });
        }

        const newUser = new User({ username, email, password, role });
        if(!username || !email || !password || !role) {
            res.status(400).json({ error: 'All fields are required' });
            console.log("All fields are required")
        }
        await newUser.save();
        console.log(`New user created with username: ${username}`);
        res.status(201).json({ Message: `${role} account created successfully` });
    } catch (error) {
        
        console.error('Error creating account:', error); 
        res.status(500).json({ Error: 'Error creating account' });
    }
};


// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ Error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ Error: 'Invalid credentials' });
        }

        const payload = { _id: user._id, role: user.role };
        const token = generateToken(payload, process.env.JWT_SECRET);
        
        console.log('Login successful');
        res.json({ token, role: user.role });
        
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ Error: 'Error logging in' });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
};

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, email, password, role } = req.body;

    if (req.user._id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to update this user' });
    }

    try {
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (role) updateData.role = role;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    const { userId } = req.params;

    if (req.user._id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to delete this user' });
    }

    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

module.exports = {
  signup,
  login,
  getAllUsers,
  updateUser,
  deleteUser
}
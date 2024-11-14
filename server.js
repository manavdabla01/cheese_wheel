// server.js
const express = require('express');
const connectDB = require('./CONFIG/db');
const cors = require('cors');
const userRoutes = require('./ROUTES/userRoutes');
const pizzaRoutes = require('./ROUTES/pizzaRoutes');
const orderRoutes = require('./ROUTES/orderRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/users', userRoutes);
app.use('/pizzas', pizzaRoutes);
app.use('/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

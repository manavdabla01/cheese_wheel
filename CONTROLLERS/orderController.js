const Order = require('../MODELS/orderModel');
const Pizza = require('../MODELS/pizzaModel');

// Place an order
const placeOrder = async (req, res) => {
    const { pizzaId, size, quantity } = req.body;
    const userId = req.user && req.user._id;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!pizzaId || !size || !quantity) {
        return res.status(400).json({ success: false, message: 'Invalid input values' });
    }

    try {
        const pizza = await Pizza.findById(pizzaId);
        if (!pizza) {
            console.log(`Pizza not found for ID: ${pizzaId}`);
            return res.status(404).json({ success: false, message: 'Pizza not found' });
        }

        // Check if size is valid by verifying it exists in the prices object
        if (!pizza.prices[size]) {
            console.log(`Invalid pizza size: ${size} for pizza ID: ${pizzaId}`);
            return res.status(400).json({ success: false, message: 'Invalid pizza size' });
        }

        const selectedPrice = pizza.prices[size];
        const totalPrice = (selectedPrice * quantity).toFixed(2);

        const order = new Order({
            userId,
            pizzaId,
            size: size, // Use the size directly
            quantity,
            price: totalPrice,
        });

        await order.save();
        console.log(`Order placed successfully for User ID: ${userId}, Total Price: $${totalPrice}`);
        return res.status(201).json({ success: true, message: `Order placed successfully: $${totalPrice}` });
    } catch (error) {
        console.error('Error placing the order:', error.message);
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};


// Get all orders (Admin only)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('pizzaId', 'name').populate('userId', 'username');
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ error: 'Error fetching orders' });
    }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await Order.findByIdAndUpdate(id, { status });
        console.log(`Order status updated to ${status} for Order ID: ${id}`);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        console.error('Error updating order status:', error.message);
        res.status(500).json({ error: 'Error updating order status' });
    }
};

const getMyOrders = async (req, res) => {
    try {
      const userId = req.user._id;
      const orders = await Order.find({ userId });
      res.json(orders);
    } catch (error) {
      console.error('Error fetching user orders:', error.message);
      res.status(500).json({ error: 'Error fetching your orders' });
    }
  };
  
  // Admin: Delete an order
  const deleteOrder = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedOrder = await Order.findByIdAndDelete(id);
      if (!deletedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      console.error('Error deleting order:', error.message);
      res.status(500).json({ error: 'Error deleting order' });
    }
  };
  
  

module.exports = { placeOrder, getOrders, updateOrderStatus, deleteOrder, getMyOrders };

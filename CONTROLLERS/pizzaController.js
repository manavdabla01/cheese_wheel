// controllers/pizzaController.js
const Pizza = require('../MODELS/pizzaModel');

// Add new pizza (Admin only)
const addPizza = async (req, res) => {
    const { name, toppings, prices } = req.body; // Update to match "prices" as expected by the frontend
    
    if (!name || !toppings || !prices) {
        return res.status(400).json({ Error: 'Please provide all required fields: name, toppings, and prices' });
    }

    try {
        const newPizza = new Pizza({ name, toppings, prices }); // Pass "prices" to the Pizza model
        await newPizza.save();
        res.status(201).json({ Message: 'Pizza added successfully', pizza: newPizza });
    } catch (error) {
        res.status(500).json({ Error: 'Error adding pizza' });
        console.error(error.message);
    }
};


// Get all pizzas (Public)
const getPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ Error: 'Error fetching pizzas' });

    }
};

const deletePizza = async (req, res) => {
    const { pizzaId } = req.params;

    try {
        const result = await Pizza.findByIdAndDelete(pizzaId);
        if (!result) {
            return res.status(404).json({ error: 'Pizza not found' });
        }
        console.log(`Pizza with ID ${pizzaId} deleted successfully`);
        res.status(200).json({ message: 'Pizza deleted successfully' });
    } catch (error) {
        console.error('Error deleting pizza:', error.message);
        res.status(500).json({ error: 'Error deleting pizza' });
    }
};

// Update pizza (Admin only)
const updatePizza = async (req, res) => {
    const { pizzaId } = req.params;
    const { name, toppings, sizes } = req.body;

    if (!name || !toppings || !sizes || sizes.length === 0) {
        return res.status(400).json({ error: 'Please provide all required fields: name, toppings, and sizes' });
    }

    try {
        const updatedPizza = await Pizza.findByIdAndUpdate(pizzaId, { name, toppings, sizes }, { new: true });
        if (!updatedPizza) {
            return res.status(404).json({ error: 'Pizza not found' });
        }
        console.log(`Pizza with ID ${pizzaId} updated successfully`);
        res.status(200).json({ message: 'Pizza updated successfully', pizza: updatedPizza });
    } catch (error) {
        console.error('Error updating pizza:', error.message);
        res.status(500).json({ error: 'Error updating pizza' });
    }
};

module.exports = {
  addPizza,
  getPizzas,
  deletePizza,
  updatePizza
}
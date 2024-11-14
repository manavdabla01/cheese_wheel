const mongoose = require('mongoose');

const PizzaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    toppings: { type: [String], required: true },
    prices: {
        Small: { type: Number, required: true },
        Medium: { type: Number, required: true },
        Large: { type: Number, required: true }
    }
});


module.exports = mongoose.model('Pizza', PizzaSchema);

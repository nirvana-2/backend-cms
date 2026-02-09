const Food = require('../models/food');
//to get all food
const getAllFood = async (req, res) => {
    const foods = await Food.find({});
    res.json(foods);
}
//to get single food
const getFoodById = async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (food) {
        res.json(food);
    } else {
        res.status(404);
        throw new Error('Food not found');
    }
}
//to create food
const createFood = async (req, res) => {
    const { name, price, description, category, countInStock, available } = req.body;
    
    const food = new Food({
        name,
        price: Number(price),
        description,
        category,
        countInStock: countInStock !== undefined ? Number(countInStock) : 0,
        available: available === 'true' || available === true,
        image: req.file ? `/uploads/food/${req.file.filename}` : '/uploads/food/default.jpg',
        createdBy: req.user._id
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
}
//to update food only staff can update stocks and admin can update all 
const updateFood = async (req, res) => {
    const food = await Food.findById(req.params.id);

    if (food) {
        if (req.user.role === 'staff') {
            food.countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : food.countInStock;
        } else if (req.user.role === 'admin') {
            food.name = req.body.name || food.name;
            food.price = req.body.price !== undefined ? Number(req.body.price) : food.price;
            food.description = req.body.description || food.description;
            food.category = req.body.category || food.category;
            food.countInStock = req.body.countInStock !== undefined ? Number(req.body.countInStock) : food.countInStock;
            food.available = req.body.available !== undefined ? (req.body.available === 'true' || req.body.available === true) : food.available;
            
            if (req.file) {
                food.image = `/uploads/food/${req.file.filename}`;
            }
        }

        const updatedFood = await food.save();
        res.json(updatedFood);
    } else {
        res.status(404);
        throw new Error('Food item not found');
    }
};
//to delete food
//only admin can delete
const deleteFood = async (req, res) => {
    const food = await Food.findById(req.params.id);
    if (req.user.role !== "admin") {
        res.status(403);
        throw new Error('Not authorized to delete food')
    }
    if (food) {
        await Food.findByIdAndDelete(req.params.id);
        res.json({ message: 'Food removed' });
    } else {
        res.status(404);
        throw new Error('Food not found');
    }
}
//top selling food
const getTopFoods = async (req, res) => {
    // Sort by numSales in descending order (-1) and limit to 5 items
    const foods = await Food.find({}).sort({ numSales: -1 }).limit(5);

    if (foods) {
        res.json(foods);
    } else {
        res.status(404);
        throw new Error('No top selling foods found');
    }
};
module.exports = { getAllFood, getFoodById, createFood, updateFood, deleteFood, getTopFoods };
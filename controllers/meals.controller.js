// Models
const { Meal } = require('../models/meal.model');
const { Restaurant } = require('../models/restaurant.model');

const { AppError } = require('../utils/appError.util');

const { catchAsync } = require('../utils/catchAsync.util');

const createMeal = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { name, price } = req.body;

    const newMeal = await Meal.create({
        name,
        price,
        restaurantId: id,
    });

    res.status(201).json({
        status: 'success',
        newMeal,
    });
});

const getActiveMeals = catchAsync(async (req, res, next) => {

    const meals = await Meal.findAll({
        include: [
            { model: Restaurant },
        ],
        where: { status: 'active' }
    });

    res.status(200).json({
        status: 'success',
        meals,
    });
});

const getMealById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const mealFound = await Meal.findOne({
        include: [
            { model: Restaurant },
        ],
        where: { id }
    });

    res.status(200).json({
        status: 'success',
        mealFound,
    });
});

const updateMeal = catchAsync(async (req, res, next) => {
    const { meal, sessionUser } = req;
    const { name, price } = req.body;

    if (sessionUser.role !== 'admin') {
        return next(new AppError("You are not an admin", 401))
    }

    await meal.update({ name, price });

    res.status(204).json({ status: 'success' });
});

const deleteMeal = catchAsync(async (req, res, next) => {
    const { meal, sessionUser } = req;

    if (sessionUser.role !== 'admin') {
        return next(new AppError("You are not an admin", 401))
    }

    await meal.update({ status: 'inactive' });

    res.status(204).json({ status: 'success' });
});


module.exports = {
    createMeal,
    getActiveMeals,
    getMealById,
    updateMeal,
    deleteMeal,
};

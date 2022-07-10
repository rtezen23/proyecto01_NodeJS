const { Meal } = require('../models/meal.model');

const { AppError } = require('../utils/appError.util');
const { catchAsync } = require('../utils/catchAsync.util');

const mealExists = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const meal = await Meal.findOne({ where: { id } });

    if (!meal) return next(new AppError('Meal not found', 404));

    req.meal = meal;
    next();
});

module.exports = { mealExists };

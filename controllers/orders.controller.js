// Models
const { Order } = require('../models/Order.model');
const { Restaurant } = require('../models/restaurant.model');
const { Meal } = require('../models/meal.model');

const { AppError } = require('../utils/appError.util');

const { catchAsync } = require('../utils/catchAsync.util');

const createOrder = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { quantity, mealId } = req.body;

    const mealFound = await Meal.findOne({ where: { id: mealId } })

    if (!mealFound) {
        return next(new AppError("Meal doesn't exist", 404))
    }

    const newOrder = await Order.create({
        mealId,
        userId: sessionUser.id,
        totalPrice: mealFound.price * quantity,
        quantity,
    });

    res.status(201).json({
        status: 'success',
        newOrder,
    });
});

const getAllOrders = catchAsync(async (req, res, next) => {

    const orders = await Order.findAll({
        include: [
            { model: Meal }
        ]
    });

    res.status(200).json({
        status: 'success',
        orders,
    });
});

const updateOrder = catchAsync(async (req, res, next) => {

    const { order } = req;

    if (order.status !== 'active') {
        return next(new AppError("We can only update active orders", 401))
    }

    await order.update({ status: 'completed' });

    res.status(204).json({ status: 'success' });
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { order } = req;

    if (order.status !== 'active') {
        return next(new AppError("We can only delete active orders", 401))
    }

    await order.update({ status: 'cancelled' });

    res.status(204).json({ status: 'success' });
});


module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
};

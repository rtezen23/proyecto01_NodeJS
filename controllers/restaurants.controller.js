// Models
const { Restaurant } = require('../models/restaurant.model');
const { Review } = require('../models/review.model');

const { AppError } = require('../utils/appError.util');

const { catchAsync } = require('../utils/catchAsync.util');

const createRestaurant = catchAsync(async (req, res, next) => {
    const { name, address, rating } = req.body;

    const newRestaurant = await Restaurant.create({
        name,
        address,
        rating,
    });

    res.status(201).json({
        status: 'success',
        newRestaurant,
    });
});

const getActiveRestaurants = catchAsync(async (req, res, next) => {

    const restaurants = await Restaurant.findAll({
        include: [
            { model: Review },
        ],
        where: { status: 'active' }
    });

    res.status(200).json({
        status: 'success',
        restaurants,
    });
});

const getRestaurantById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const restaurantFound = await Restaurant.findOne({
        include: [
            { model: Review },
        ],
        where: { id }
    });

    res.status(200).json({
        status: 'success',
        restaurantFound,
    });
});

const updateRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant, sessionUser } = req;
    const { name, address } = req.body;

    if (sessionUser.role !== 'admin') {
        return next(new AppError("You are not an admin", 401))
    }

    await restaurant.update({ name, address });

    res.status(204).json({ status: 'success' });
});

const deleteRestaurant = catchAsync(async (req, res, next) => {
    const { restaurant, sessionUser } = req;

    if (sessionUser.role === 'admin') await restaurant.update({ status: 'inactive' });
    else return next(new AppError("You are not an admin", 401));

    res.status(204).json({ status: 'success' });
});

const createRestaurantReview = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const { restaurantId } = req.params;
    const { comment, rating } = req.body;

    const newReview = await Review.create({
        userId: sessionUser.id,
        comment,
        restaurantId: restaurantId,
        rating,
    })

    res.status(201).json({
        status: 'success',
        newReview
    });
});

const updateReview = catchAsync(async (req, res, next) => {
    const { sessionUser, review } = req;
    const { comment, rating } = req.body;

    if (sessionUser.id !== review.userId) {
        return next(new AppError("You didn't write this review", 401))
    }

    await review.update({
        comment,
        rating,
    })

    res.status(204).json({ status: 'success' });
});

const deleteReview = catchAsync(async (req, res, next) => {
    const { sessionUser, review } = req;

    if (sessionUser.id !== review.userId) {
        return next(new AppError("You didn't write this review", 401))
    }

    await review.update({
        status: 'inactive'
    })

    res.status(204).json({ status: 'success' });
});



module.exports = {
    createRestaurant,
    getActiveRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    createRestaurantReview,
    updateReview,
    deleteReview
};

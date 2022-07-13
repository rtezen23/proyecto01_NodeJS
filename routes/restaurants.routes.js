const express = require('express');

const {
    createRestaurant,
    getActiveRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    createRestaurantReview,
    updateReview,
    deleteReview
} = require('../controllers/restaurants.controller');

const { restaurantExists } = require('../middlewares/restaurants.middleware');
const { reviewExists } = require('../middlewares/reviews.middleware');
const { protectSession } = require('../middlewares/auth.middleware');
const { createRestaurantValidators } = require('../middlewares/validators.middleware');

const restaurantsRouter = express.Router();

restaurantsRouter
    .route('/')
    .post(protectSession, createRestaurantValidators, createRestaurant)
    .get(getActiveRestaurants);

restaurantsRouter.get('/:id', restaurantExists, getRestaurantById);

restaurantsRouter.use(protectSession);

restaurantsRouter.post('/reviews/:restaurantId', createRestaurantReview);

restaurantsRouter
    .route('/reviews/:id')
    .patch(reviewExists, updateReview)
    .delete(reviewExists, deleteReview);

restaurantsRouter
    .use('/:id', restaurantExists)
    .route('/:id')
    .patch(updateRestaurant)
    .delete(deleteRestaurant);



module.exports = { restaurantsRouter };

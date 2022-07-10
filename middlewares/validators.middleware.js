const { body, validationResult } = require('express-validator');

const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        const errorMsgs = errors.array().map(err => err.msg);

        const message = errorMsgs.join('. ');

        return next(new AppError(message, 400));
    }

    next();
};

const createUserValidators = [
    body('name').notEmpty().withMessage('Empty username not allowed'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Only 8 characters long allowed for password')
        .isAlphanumeric()
        .withMessage('We need letters and numbers for password'),
    checkResult,
];

const createRestaurantValidators = [
    body('name').notEmpty().withMessage('Empty restaurant name not allowed'),
    body('address').notEmpty().withMessage('Empty address not allowed'),
    body('rating').isNumeric().withMessage('Rating must be a number'),
    checkResult,
];

const createMealValidators = [
    body('name').notEmpty().withMessage('Empty meal name not allowed'),
    body('price').isNumeric().withMessage('Price must be a number'),
    checkResult,
];

const createOrderValidators = [
    body('mealId').notEmpty().withMessage('Empty mealId not allowed'),
    body('quantity')
        .notEmpty().withMessage('Empty quantity not allowed')
        .isNumeric().withMessage('Quantity must be a number'),
    checkResult,
];

module.exports = {
    createUserValidators,
    createRestaurantValidators,
    createMealValidators,
    createOrderValidators
};

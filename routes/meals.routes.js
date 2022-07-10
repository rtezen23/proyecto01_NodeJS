const express = require('express');

const {
    createMeal,
    getActiveMeals,
    getMealById,
    updateMeal,
    deleteMeal,
} = require('../controllers/meals.controller');

const { mealExists } = require('../middlewares/meals.middleware');
const { protectSession } = require('../middlewares/auth.middleware');
const { createMealValidators } = require('../middlewares/validators.middleware');

const mealsRouter = express.Router();

mealsRouter.post('/:id', protectSession, createMealValidators, createMeal);

mealsRouter.get('/', getActiveMeals);
mealsRouter.get('/:id', mealExists, getMealById);

mealsRouter.use(protectSession);

mealsRouter
    .use('/:id', mealExists)
    .route('/:id')
    .patch(updateMeal)
    .delete(deleteMeal);

module.exports = { mealsRouter };

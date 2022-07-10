const express = require('express');

const {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
} = require('../controllers/orders.controller');

const { orderExists } = require('../middlewares/orders.middleware');
const { protectSession } = require('../middlewares/auth.middleware');
const { createOrderValidators } = require('../middlewares/validators.middleware');

const ordersRouter = express.Router();

ordersRouter.use(protectSession);

ordersRouter.post('/', createOrderValidators, createOrder);

ordersRouter.get('/me', getAllOrders);

ordersRouter
    .use('/:id', orderExists)
    .route('/:id')
    .patch(updateOrder)
    .delete(deleteOrder);

module.exports = { ordersRouter };

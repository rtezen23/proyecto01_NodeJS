const express = require('express');
const rateLimit = require('express-rate-limit');

const { usersRouter } = require('./routes/users.routes');
const { restaurantsRouter } = require('./routes/restaurants.routes');
const { mealsRouter } = require('./routes/meals.routes');
const { ordersRouter } = require('./routes/orders.routes');

const { globalErrorHandler } = require('./controllers/error.controller');

const { AppError } = require('./utils/appError.util');

const app = express();

app.use(express.json());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000, // 1 hr
    message: 'Requests exceeded',
});

app.use(limiter);

app.use('/api/v1/users', usersRouter);
app.use('/api/v1/restaurants', restaurantsRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);

app.all('*', (req, res, next) => {
    next(
        new AppError(
            `${req.method} ${req.originalUrl} not found in this server`,
            404
        )
    );
});

app.use(globalErrorHandler);

module.exports = { app };

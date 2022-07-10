const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Restaurant } = require('../models/restaurant.model');
const { Order } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });

    res.status(200).json({
        status: 'success',
        users,
    });
});

const createUser = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashPassword,
        role
    });

    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        newUser,
    });
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: {
            email,
            status: 'active',
        },
    });

    if (!user) return next(new AppError('Invalid credentials', 400))

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return next(new AppError('Invalid credentials', 400))

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    res.status(200).json({
        status: 'success',
        token,
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { user } = req;
    const { name, email } = req.body;

    await user.update({ name, email });

    res.status(204).json({ status: 'success' });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { user } = req;

    await user.update({ status: 'inactive' });

    res.status(204).json({ status: 'success' });
});

const getAllOrders = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
    const orders = await Order.findAll({
        include: [
            { model: Restaurant },
        ],
        where: { userId: sessionUser.id }
    });

    res.status(200).json({
        status: 'success',
        orders,
    });
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { order } = req;

    const orderFound = await Order.findOne({
        include: [
            { model: Restaurant },
        ],
        where: { id: order.id }
    });

    res.status(200).json({
        status: 'success',
        orderFound,
    });
});


module.exports = {
    getAllUsers,
    createUser,
    login,
    updateUser,
    deleteUser,
    getAllOrders,
    getOrderById,
};

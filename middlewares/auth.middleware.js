const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { User } = require('../models/user.model');

const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const protectSession = catchAsync(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) token = req.headers.authorization.split(' ')[1];

    if (!token) return next(new AppError('Invalid session', 403));

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
        where: { id: decoded.id, status: 'active' },
    });

    if (!user) {
        return next(
            new AppError('The owner of this token doesnt exist anymore', 403)
        );
    }

    req.sessionUser = user;
    next();
});

const protectUserAccount = (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) return next(new AppError('Account does not belong to you', 403));

    next();
};

module.exports = { protectSession, protectUserAccount };

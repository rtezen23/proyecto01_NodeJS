const express = require('express');

const {
    getAllUsers,
    createUser,
    login,
    updateUser,
    deleteUser,
    getAllOrders,
    getOrderById,
} = require('../controllers/users.controller.js');


const {
    createUserValidators,
} = require('../middlewares/validators.middleware');
const { userExists } = require('../middlewares/users.middleware');
const {
    protectSession,
    protectUserAccount,
} = require('../middlewares/auth.middleware');

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);

usersRouter.post('/signup', createUserValidators, createUser);

usersRouter.post('/login', login);

usersRouter.use(protectSession);

usersRouter
    .use('/:id', userExists)
    .route('/:id')
    .patch(protectUserAccount, updateUser)
    .delete(protectUserAccount, deleteUser);

usersRouter.get('/orders', protectUserAccount, getAllOrders)
usersRouter.get('/orders/:id', protectUserAccount, getOrderById)



module.exports = { usersRouter };

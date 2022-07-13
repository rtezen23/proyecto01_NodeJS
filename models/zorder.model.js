const { db, DataTypes } = require('../utils/database.util');
const { Meal } = require('./meal.model');
const { User } = require('./user.model');

const Order = db.define('order', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    mealId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        /* references: {
            model: Meal,
            key: 'id',
        }, */
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        /* references: {
            model: User,
            key: 'id',

        }, */
    },
    totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active',
    },
});

module.exports = { Order };

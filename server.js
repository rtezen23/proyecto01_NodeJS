const { app } = require('./app');

// Models
const { Restaurant } = require('./models/restaurant.model');
const { Meal } = require('./models/meal.model');
const { Order } = require('./models/order.model');
const { Review } = require('./models/review.model');
const { User } = require('./models/user.model');

// Utils
const { db } = require('./utils/database.util');

db.authenticate()
    .then(() => console.log('Db authenticated'))
    .catch(err => console.log(err));

Restaurant.hasMany(Review, { foreignKey: 'restaurantId' });
Review.belongsTo(Restaurant);

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User);

Meal.hasOne(Order);
Order.belongsTo(Meal);

Restaurant.hasMany(Meal, { foreignKey: 'restaurantId' });
Meal.belongsTo(Restaurant);

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User);


db.sync()
    .then(() => console.log('Db synced'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
});

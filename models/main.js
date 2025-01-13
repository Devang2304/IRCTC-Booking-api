const {Sequelize} = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    pool: config.pool
})

const User = require('./user.model')(sequelize);
const Train = require('./train.model')(sequelize);
const Booking = require('./booking.model')(sequelize);
const AdminApiKey = require('./adminApiKey.model')(sequelize);


User.hasMany(Booking, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Train.hasMany(Booking, { foreignKey: 'train_id', onDelete: 'CASCADE' });
Booking.belongsTo(Train, { foreignKey: 'train_id' });

User.hasOne(AdminApiKey, { foreignKey: 'admin_id', onDelete: 'CASCADE' });
AdminApiKey.belongsTo(User, { foreignKey: 'admin_id' });

module.exports = { sequelize, User, Train, Booking, AdminApiKey };

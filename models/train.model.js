const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Train = sequelize.define('Train', {
    train_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    train_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source_station: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destination_station: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    available_seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, { timestamps: true });

  return Train;
};

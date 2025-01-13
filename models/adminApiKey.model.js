const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AdminApiKey = sequelize.define('AdminApiKey', {
    api_key_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, { timestamps: true });

  return AdminApiKey;
};

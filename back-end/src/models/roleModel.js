const {DataTypes, Model} = require('sequelize');
const db = require("../config/database");

class Role extends Model {}

Role.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Role",
    tableName: "role",
    timestamps: false,
  }
);
module.exports = Role;
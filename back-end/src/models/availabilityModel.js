const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");
const sequelize = db.getSequelize();
const Person = require("./personModel");

class Availability extends Model {}

Availability.init(
  {
    availability_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Person,
        key: "person_id",
      },
      onDelete: "CASCADE",
    },
    from_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Availability",
    tableName: "availability",
    timestamps: false,
  }
);

module.exports = Availability;

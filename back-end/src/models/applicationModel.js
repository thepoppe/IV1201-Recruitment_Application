const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");
const sequelize = db.getSequelize();
const Person = require("./personModel");

class Application extends Model {}

Application.init(
  {
    application_id: {
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
    submission_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "unhandled",
      validate: {
        isIn: [["unhandled", "accepted", "rejected"]],
      },
    },
  },
  {
    sequelize,
    modelName: "Application",
    tableName: "application",
    timestamps: false,
  }
);

module.exports = Application;

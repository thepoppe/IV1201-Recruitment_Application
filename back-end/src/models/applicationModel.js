const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");
const Person = require("./personModel");

const sequelize = db.getSequelize();

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

// Associations for Application model
Application.belongsTo(Person, { foreignKey: "person_id", as: "person", onDelete: "cascade" });


module.exports = Application;

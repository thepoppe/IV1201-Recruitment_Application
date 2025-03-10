const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");
const sequelize = db.getSequelize();

class Competence extends Model {}

Competence.init(
  {
    competence_id: {
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
    sequelize,
    modelName: "Competence",
    tableName: "competence",
    timestamps: false,
  }
);

module.exports = Competence;

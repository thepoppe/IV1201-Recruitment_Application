const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");
const sequelize = db.getSequelize();
const Person = require("./personModel");
const Competence = require("./competenceModel");

class CompetenceProfile extends Model {}

CompetenceProfile.init(
  {
    competence_profile_id: {
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
    competence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Competence,
        key: "competence_id",
      },
    },
    years_of_experience: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CompetenceProfile",
    tableName: "competence_profile",
    timestamps: false,
  }
);

module.exports = CompetenceProfile;

const { DataTypes, Model } = require("sequelize");
const db = require("../config/database");
const Competence = require("./competenceModel");

const sequelize = db.getSequelize();

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
    },
    competence_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

CompetenceProfile.belongsTo(Competence, {
  foreignKey: "competence_id",
  as: "competence",
});

module.exports = CompetenceProfile;

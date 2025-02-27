const { DataTypes, Model } = require('sequelize');

class Role extends Model {
  static initModel(sequelize) {
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
        sequelize, 
        modelName: "Role",
        tableName: "role",
        timestamps: false,
      }
    );
  }
}

module.exports = Role;
/**
 * PersonModel - interface for sequlize
 */

const {DataTypes, Sequelize, Model} = require('sequelize');
const { sequelize } = require("../config/databaseConfig");
const db = require("../config/database");
const bcrypt = require("bcrypt");
const sequelize = db.getSequelize();
class Person extends Model {}

Person.init(
  {
    person_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]+$/,
      },
    },
    surname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]+$/,
      },
    },
    pnr: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[0-9]{8}-[0-9]{4}$/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        len: [8, 64], // Length between 8-64 characters
        is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, // Matches Joi validation pattern for consistency
      },
    },
    username: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Person',
    tableName: "person",
    timestamps: false,
    hooks: {
      beforeCreate: async (person) => {
        person.username = person.name + person.surname;
        if (person.password) {
          person.password = await bcrypt.hash(person.password, 10);
        }
      },
      beforeUpdate: async (person) => {
        person.username = person.name + person.surname;
        if (person.changed("password")) {
          person.password = await bcrypt.hash(person.password, 10);
        }
      },
    },
  }
);

module.exports = Person;

/**
 * PersonModel - interface for sequlize
 */

const {DataTypes, Sequelize, Model} = require('sequelize');
const { sequelize } = require("../config/databaseConfig");

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
        },
        surname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pnr: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
        {
        sequelize,
        modelName: 'Person',
        tableName: "person",
        timestamps: false,
    },
);

module.exports = Person;
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
                len: [8, 64],
                is: /^[0-9a-zA-Z]+$/i,
                containsUpperLowerAndNumber(value) {
                    if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
                        throw new Error('Password must contain uppercase, lowercase letters, and numbers');
                    }
                }
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
            beforeCreate: (person) => {
                person.username = person.name + person.surname;
            },
            beforeUpdate: (person) => {
                person.username = person.name + person.surname;
            },
        },
    },
);

module.exports = Person;
/**
 * PersonModel - interface for sequlize
 */


const {Sequelize, DataTypes, Model} = require('sequelize');

class Person extends Model {}

Person.init(
    {
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
        sequelize, //unsure if we need this or if its only for local
        modelName: 'person',
    },
);
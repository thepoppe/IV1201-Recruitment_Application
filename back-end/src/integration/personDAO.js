/**
 * Communicates with database
 * finduserbyuser
 * creatuser
 */

/* This should be in a config file*/
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

//try connection
try {
    await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
};

/*file starts here*/
const Person = require("../models/personModel");
class personDAO {
    async create(personDTO){
        return await Person.create(personDTO)
    }
}

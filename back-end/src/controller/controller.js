/**
 * Handles all Person Requests. 
 * Performs as the middle hand between Integration and Model
 */
const PersonDAO = require("../integration/personDAO");
const personDTO = require("../models/personDTO")

class Controller{
    /**
     * Constructor for the Controller 
     */
    constructor(){
        this.personDAO = new PersonDAO(); 
    }

    /**
     * Checks if the person exists in the database, if not creates a new person
    * @param {Object} person - The person object containing name, surname, pnr, email, and password
    * @param {string} person.name - The name of the person
    * @param {string} person.surname - The surname of the person
    * @param {string} person.pnr - The personal number of the person
    * @param {string} person.email - The email of the person
    * @param {string} person.password - The password of the person
    * @returns {Promise<PersonDTO>}
    * @throws {Error} - If a person with that personalnumber already exists
    */
    async createPerson(person){
        const users = await this.personDAO.findPersonByPNR(person.pnr)
        if ( users.length > 0){
            throw new Error("Person with that pnr already exists");
        }
         
        const user = await this.personDAO.createPerson(person);
        return new personDTO(user);
    };







    /**
     * Finds a Person by ID
     * @param {number} id 
     * @returns {Promise<PersonDTO>}
     * @throws {Error} - If the person does not exist
     */
    async findPersonByID(id){
        const user = await this.personDAO.findPersonByID(id);
        if (!user){
            throw new Error("Person with that ID does not exist");
        }
        return new personDTO(user);
    };

    /**
     * Finds a Person by Name
     * @param {string} name 
     * @returns {Promise<PersonDTO>}
     * @throws {Error} - If the person does not exist
     */
    async findPersonByName(name){
        const users = await this.personDAO.findPersonByName(name);
        if (users.length === 0){
            throw new Error("Person with that name does not exist");
        }
        return users.map(user => new personDTO(user));
    };


}

module.exports = Controller;
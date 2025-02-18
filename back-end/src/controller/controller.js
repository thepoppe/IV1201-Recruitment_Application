const PersonDAO = require("../integration/personDAO");
const PersonDTO = require("../models/personDTO")

/**
 * Controller class for handling Requests
 */
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
    * @throws {Error} - If a person with that email already exists
    */
    async createPerson(person){
        const pnr = await this.personDAO.findByPnr(person.pnr)
        if (pnr){
            throw new Error("Person with that pnr already exists");
        }
        const email = await this.personDAO.findByEmail(person.email)
        if (email){
            throw new Error("Person with that email already exists");
        }

        const user = await this.personDAO.create(person);
        return new PersonDTO(user);
    };


    /**
     * Finds all persons in the database
     * @returns {Promise<PersonDTO[]>}
     * @throws {Error} - If there are no persons in the database
     */
    async findAllPersons() {
        const persons = await this.personDAO.findAll();
        if (persons.length === 0){
            throw new Error("There are no persons in the database");
        }
        return persons.map((person) => new PersonDTO(person));
    };
}

module.exports = Controller;
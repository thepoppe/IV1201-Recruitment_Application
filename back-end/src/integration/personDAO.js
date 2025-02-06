/**
 * Communicates with database
 * finduserbyuser
 * creatuser
 */


/*file starts here*/
const Person = require("../models/personModel")
const PersonDTO = require("../models/personDTO")
class PersonDAO {

    /**
    * Creates a new Person, saves it to the database, and returns a PersonDTO
    * @param {Object} person - The person object containing name, surname, pnr, email, and password
    * @param {string} person.name - The name of the person
    * @param {string} person.surname - The surname of the person
    * @param {string} person.pnr - The personal number of the person
    * @param {string} person.email - The email of the person
    * @param {string} person.password - The password of the person
    * @returns {Promise<Object>} - The created Person Object
    * @throws {Error} - If the person could not be created
    */
    async createPerson(person) {
        try {
            const user = await Person.create(person);
            return new PersonDTO(user);
        } catch (error) {
            console.error("Error creating person:", error);
            throw error;
        }
    }

    /**
    * Finds a Person by ID and returns a PersonDTO
    * @param {number} id - The ID of the person
    * @returns {Promise<PersonDTO>} - The found PersonDTO
    * @throws {Error} - If the database query fails
    */
    async findPersonByID(id) {
        try {
            const user = await Person.findOne({
                where: {
                    person_id: id
                }
            });
            return user ? new PersonDTO(user) : null;
        } catch (error) {
            console.error("Error finding person by ID:", error);
            throw error;
        }
    }


    /**
    * Finds a Person by Name and returns an array of PersonDTOs
    * @param {string} name - The name of the person
    * @returns {Promise<Array<PersonDTO>>} - The found array of PersonDTOs
    * @throws {Error} - If the database query fails
    */
    async findPersonByName(name) {
        try {
            const users = await Person.findAll({
                where: {
                    name: name
                }
            });
            return users.length > 0 ? users.map(user => new PersonDTO(user)) : [];
        } catch (error) {
            console.error("Error finding person by name:", error);
            throw error;
        }
    }

        /**
    * Finds a Person by PNR and returns an array of PersonDTOs
    * @param {string} pnr - The personal number of the person
    * @returns {Promise<Array<PersonDTO>>} - The found array of PersonDTOs
    * @throws {Error} - If the database query fails
    */
        async findPersonByPNR(pnr) {
            try {
                const users = await Person.findAll({
                    where: {
                        pnr: pnr
                    }
                });
                return users.length > 0 ? users.map(user => new PersonDTO(user)) : [];
            } catch (error) {
                console.error("Error finding person by PNR:", error);
                throw error;
            }
        }
}
module.exports = PersonDAO

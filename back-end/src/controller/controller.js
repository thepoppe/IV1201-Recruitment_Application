const PersonDAO = require("../integration/personDAO");
const PersonDTO = require("../models/personDTO")
const GenericAppError = require("../utils/genericAppError")
const ModelLoader = require("../models/dbModelLoader");
const {getSequelize} = require("../config/database")
const bcrypt = require("bcrypt");


/**
 * Controller class for handling Requests
 */
class Controller{
    /**
     * Constructor for the Controller 
     */
    constructor(){
        this.sequelize = getSequelize();
        ModelLoader.initModels(this.sequelize);
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
     * @throws {GenericAppError} `400 Bad Request` - If the provided personal number (PNR) is already registered
     * @throws {GenericAppError} `400 Bad Request` - If the provided email is already registered
     * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
    */
    async createPerson(person){
        try{

            const pnr = await this.personDAO.findByPnr(person.pnr)
            if (pnr){
                throw GenericAppError.createBadRequestError("User entered a PNR that is already registered.")
            }
            const email = await this.personDAO.findByEmail(person.email)
            if (email){
                throw GenericAppError.createBadRequestError("User entered an Email that is already registered.");
            }
            
            const user = await this.personDAO.create(person);
            return new PersonDTO(user);
        } catch(error){
            if (error instanceof GenericAppError)
                throw error;
            else
                throw GenericAppError.createInternalServerError("Unexpected error while creating a person", error);
        }
    };


    /**
     * Finds all persons in the database
     * @returns {Promise<PersonDTO[]>}
     * @throws {GenericAppError} `404 - Not found` - If there are no persons in the database
     * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
     */
    async findAllPersons() {
        try {  
            const persons = await this.personDAO.findAll();
            if (persons.length === 0){
                throw GenericAppError.createNotFoundError("No entries in the database");
            }
            return persons.map((person) => new PersonDTO(person));
        } 
        catch (error) {
            throw GenericAppError.createInternalServerError("Unexpected error while retrieving all persons", error);
        }
    };

    /**
     * Logs in the person if the email and password are correct
     * @param {Object} req_params - The person object containing email and password
     * @param {string} req_params.email - The email of the person
     * @param {string} req_params.password - The password of the person
     * @returns {Promise<PersonDTO>}
     * @throws {GenericAppError} `400 - Bad Request` - If no user with that email
     * @throws {GenericAppError} `400 - Bad Request`- If the password is incorrect
     * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
     */
    async login(req_params){
        try{
            const user = await this.personDAO.findByEmail(req_params.email);
            if (!user){
                throw GenericAppError.createAuthenticationError("Invalid email was given.", null, "Email and Password does not match");
            }
            const isPasswordValid = await bcrypt.compare(req_params.password, user.password);
            if (!isPasswordValid) {
                throw GenericAppError.createAuthenticationError("Invalid password was given.", null, "Email and Password does not match");
            }
            
            return new PersonDTO(user);
        } 
        catch (error) {
            if (error instanceof GenericAppError)
                throw error;
            else
                throw GenericAppError.createInternalServerError(`Unexpected error while logging in person [${req_params.email}] all persons`, error);
        }
    }

    /**
     * Finds a person by their id
     * @param {number} person_id - The id of the person
     * @returns {Promise<PersonDTO>}
     * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
     */
    async getPersonData(person_id){
        try{
            const user = await this.personDAO.findById(person_id);
            return new PersonDTO(user);
        }
        catch (error) {
            throw GenericAppError.createInternalServerError(`Unexpected error while retrieving person [${person.id}]`, error);
        }
    }

    /**
     * Finds the role of the user
     * @param {number} person_id - The id of the person
     * @returns {Promise<string>}
     * @throws {GenericAppError} `500 Internal Server Error` - If a database or backend processing error occurs
     */
    async getUserRole(person_id){
        try{
            const user = await this.personDAO.findById(person_id);
            const role = await this.personDAO.findRoleById(user.role_id);
            return role.name;
        }
        catch (error) {
            throw GenericAppError.createInternalServerError(`Unexpected error while retrieving role of person [${person.id}]`, error);
        }
    }
}

module.exports = Controller;
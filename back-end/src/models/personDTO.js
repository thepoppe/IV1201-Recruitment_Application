/**
 * PersonDTO is a class that is used to represent a person object to the client.
 */
class PersonDTO {
    /**
     * Constructor for the PersonDTO class.
     * @param {Object} person - The person object to be represented.
     */
    constructor(person) {
        this.id = person.person_id;
        this.name = person.name; 
        this.surname = person.surname;
        this.pnr = person.pnr;
        this.email = person.email;
        this.username = person.username;
        this.role = person.role ? person.role.name : null;
    }
}

module.exports = PersonDTO;

/**
 * PersonDTO is a class that is used to represent a person object in a more readable way.
 */
class PersonDTO {
    constructor(person) {
        this.id = person.person_id;
        this.name = person.name; 
        this.surname = person.surname;
        this.pnr = person.pnr;
        this.email = person.email;
        this.username = person.username;
    }
}

module.exports = PersonDTO;

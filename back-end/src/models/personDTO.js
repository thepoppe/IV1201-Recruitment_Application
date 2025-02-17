/**
 * The class that is treturned to the user
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

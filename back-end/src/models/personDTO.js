/**
 * The class that is treturned to the user
 */

class PersonDTO {
    constructor(json_person) {
        this.id = json_person.person_id;
        this.name = json_person.name; 
        this.surname = json_person.surname;
        this.pnr = json_person.pnr;
        this.email = json_person.email;
        this.username = json_person.username;
    }
}

module.exports = PersonDTO;

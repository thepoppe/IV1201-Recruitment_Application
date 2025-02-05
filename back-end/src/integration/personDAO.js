/**
 * Communicates with database
 * finduserbyuser
 * creatuser
 */


/*file starts here*/
const Person = require("../models/personModel")
class PersonDAO {
    async createPerson(personDTO){
        return await Person.create(personDTO)
    }
    async findPersonByID(id){
        const person = await Person.findAll({
            where: {
              person_id:id
            }
        })
        return person;
    }
}
module.exports = PersonDAO

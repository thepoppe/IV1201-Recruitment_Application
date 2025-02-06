/**
 * Communicates with database
 * finduserbyuser
 * creatuser
 */


/*file starts here*/
const Person = require("../models/personModel")
const personDTO = require("../models/personDTO")
class PersonDAO {
    async createPerson(person){
         const user = await Person.create(person);

         return  new personDTO(user); 
    }
    async findPersonByID(id){
        const user = await Person.findAll({
            where: {
              person_id:id
            }
        })
        return new personDTO(user);
    }
    async findPersonByName(name){
        const user = await Person.findAll({
            where: {
              name:name
            }
        })
        return new personDTO(user);
    }
}
module.exports = PersonDAO

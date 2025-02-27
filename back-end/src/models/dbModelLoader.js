const Role = require("./roleModel");
const Person = require("./personModel");

class ModelLoader{
    
    static initModels(sequelize){
        Role.initModel(sequelize);
        Person.initModel(sequelize);
    }
}
module.exports = ModelLoader
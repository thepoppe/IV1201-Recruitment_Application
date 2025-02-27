const {DataTypes, Model} = require('sequelize');
const bcrypt = require("bcrypt");

/**
 * Person Model for the database
 */
class Person extends Model {

  /**
   * Initialize the Person model
   */
  static initModel(sequelize){
    Person.init(
      {
      person_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]+$/,
        },
      },
      surname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-zA-Z]+$/,
        },
      },
      pnr: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[0-9]{8}-[0-9]{4}$/,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          len: [8, 64],
          is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 2,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      username: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Person',
      tableName: "person",
      timestamps: false,
      hooks: {
        /**
         * Hooks for the Person model that are called before creating a person
         * Sets the role_id to 2 (user) and the username to the name and surname of the person
         * Hashes the password before creating or updating a person
         * @param {Person} person - The person object
         */
        beforeCreate: async (person) => {
          person.role_id = 2;
          person.username = person.name + person.surname;
          if (person.password) {
            person.password = await bcrypt.hash(person.password, 10);
          }
        },

        /**
         * Hooks for the Person model that are called before updating a person
         * Sets the role_id to 2 (user) and the username to the name and surname of the person
         * Hashes the password before creating or updating a person if updated
         * @param {Person} person - The person object
         */
        beforeUpdate: async (person) => {
          person.role_id = 2;
          person.username = person.name + person.surname;
          if (person.changed("password")) {
            person.password = await bcrypt.hash(person.password, 10);
          }
        },
      },
    }
  );}
}

module.exports = Person;

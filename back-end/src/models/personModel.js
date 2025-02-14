const db = require("../config/database");
const bcrypt = require("bcrypt");

const Person = db.getSequelize().define(
  "Person",
  {
    person_id: {
      type: db.types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: db.types.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]+$/,
      },
    },
    surname: {
      type: db.types.STRING,
      allowNull: false,
      validate: {
        is: /^[a-zA-Z]+$/,
      },
    },
    pnr: {
      type: db.types.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[0-9]{8}-[0-9]{4}$/,
      },
    },
    email: {
      type: db.types.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: db.types.STRING(64),
      allowNull: false,
      validate: {
        len: [8, 64], // Length between 8-64 characters
        is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, // Matches Joi validation pattern for consistency
      },
    },
    username: {
      type: db.types.STRING,
    },
  },
  {
    tableName: "person",
    timestamps: false,
    hooks: {
      beforeCreate: async (person) => {
        person.username = person.name + person.surname;
        // Hash password before storing it in the database
        if (person.password) {
          person.password = await bcrypt.hash(person.password, 10);
        }
      },
      beforeUpdate: async (person) => {
        person.username = person.name + person.surname;
        // Only hash the password if it has changed
        if (person.changed("password")) {
          person.password = await bcrypt.hash(person.password, 10);
        }
      },
    },
  }
);

module.exports = Person;

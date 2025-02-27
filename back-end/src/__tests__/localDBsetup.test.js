const { Sequelize } = require("sequelize");
const ModelLoader = require("../models/dbModelLoader");

// Global sequelize instance
let sequelize = null;

// Set up connection to PostgreSQL Docker container on port 5433
const setupDatabase = async () => {
  sequelize = new Sequelize("test_db", "postgres", "postgres", {
    host: "localhost",
    port: 5433,
    dialect: "postgres",
    logging: false,
  });
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

// Load models and synchronize tables
const setupTables = async () => {
  try {
    ModelLoader.initModels(sequelize);
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error("Unable to synchronize models.", error);
    throw error;
  }
};

const setupDBWithTables = async () =>{
    await setupDatabase();
    await setupTables();
}

// Jest tests to ensure database connection and table synchronization
test("Setting up temp db", async () => {
  await expect(setupDatabase()).resolves.not.toThrow();
});

test("Setting up database tables", async () => {
  await setupDatabase();
  await expect(setupTables()).resolves.not.toThrow();
});

afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
});

module.exports = { sequelize, setupDBWithTables };

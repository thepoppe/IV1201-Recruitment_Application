const { Sequelize } = require("sequelize");

let sequelize;

async function setupDatabase() {

  sequelize = new Sequelize("test_db", "postgres", "postgres", {
    host: "localhost",
    port: 5433,
    dialect: "postgres",
    logging: false,
  });

  await sequelize.authenticate();
  await sequelize.sync({ force: true });
}

async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
  }
}

function getSequelize() {
  if (!sequelize) {
    throw new Error("Database not initialized. Call setupDatabase() first.");
  }
  return sequelize;
}

module.exports = {
  setupDatabase,
  closeDatabase,
  getSequelize,
};
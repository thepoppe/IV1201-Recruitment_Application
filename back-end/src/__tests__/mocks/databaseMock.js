const { Sequelize } = require("sequelize");

let sequelize;

async function setupDatabase() {

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  await sequelize.authenticate();
}

async function syncDatabase() {
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
  syncDatabase,
  closeDatabase,
  getSequelize,
};

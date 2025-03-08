const { Sequelize } = require("sequelize");

let sequelize;

async function setupDatabase() {
  if (!sequelize) {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.authenticate();
  }
}

async function syncDatabase() {
  if (!sequelize) await setupDatabase();
    await sequelize.sync({ force: true });
}

async function closeDatabase() {
  if (sequelize) {
    await sequelize.close();
    sequelize = null;
  }
}
async function clearDatabase(){
  if (sequelize){
    await sequelize.drop();
  }
}

function getSequelize() {
  if (!sequelize) {
    throw new Error("Database not initialized. Call setupDatabase() first.");
  }
  return sequelize;
}
async function init() {
  await setupDatabase();
}

module.exports = {
  init,
  setupDatabase,
  syncDatabase,
  closeDatabase,
  getSequelize,
  clearDatabase,
};

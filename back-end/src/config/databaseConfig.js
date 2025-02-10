require("dotenv").config();
const { Sequelize } = require("sequelize");


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect:  'postgres',
    port: process.env.DB_PORT,
});

const syncDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully");

        await sequelize.sync();
        console.log("Database tables synced");
    } catch (error) {
        console.error("Database sync error:", error);
        process.exit(1);
    }
};

module.exports = { sequelize, syncDatabase };
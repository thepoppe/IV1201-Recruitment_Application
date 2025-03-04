const { Sequelize, DataTypes } = require("sequelize");

/**
 * Singleton class for handling the database connection
 */
class Database {
  /**
   * Constructor for the Database class
   * Creates a new Sequelize instance if one does not already exist
   * @returns {Database} - The Database instance
   */
  constructor() {
    if (!Database.instance) {
      // Check if DATABASE_URL is available (for Heroku)
      if (process.env.DATABASE_URL) {
        this.sequelize = new Sequelize(process.env.DATABASE_URL, {
          dialect: "postgres",
          logging: false,
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false, // Required for Heroku Postgres
            },
          },
          pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000,
          },
        });
      } else {
        // For local development
        this.sequelize = new Sequelize(
          process.env.DB_NAME,
          process.env.DB_USER,
          process.env.DB_PASSWORD,
          {
            host: process.env.DB_HOST,
            dialect: "postgres",
            port: process.env.DB_PORT,
            logging: false,
            pool: {
              max: 10,
              min: 2,
              acquire: 30000,
              idle: 10000,
            },
          }
        );
      }
      this.initialized = false;
      Database.instance = this;
    }
    return Database.instance;
  }

  /**
   * Initialize the database connection
   */
  async init() {
    if (!this.initialized) {
      try {
        await this.sequelize.authenticate();
        console.log("Database connection has been established successfully.");
        await this.sequelize.sync();
        this.initialized = true;
      } catch (error) {
        console.error("Unable to connect to the database:", error);
        throw error;
      }
    }
  }

  /*
   * Get the Sequelize singleton instance
   * @returns {Sequelize} - The Sequelize instance
   */
  getSequelize() {
    return this.sequelize;
  }

  get types() {
    return DataTypes;
  }
}

const dbInstance = new Database();
module.exports = dbInstance;

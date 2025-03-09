require("dotenv").config();
const fs = require("fs");
const readline = require("readline");
const { Pool } = require("pg");
const path = require("path");

/**
 * Database Migration Script
 *
 * This script migrates data from a PostgreSQL dump file to Heroku databases.
 * It handles missing data in the person table and maintains relationships.
 *
 * Features:
 * - Creates database schema first
 * - Parses SQL dump files
 * - Fills missing data according to business rules
 * - Generates 15 applications for testing
 * - Migrates to either staging or production based on command line args
 * - Maintains data integrity and relationships
 * - Handles errors with transactions
 *
 * Usage:
 * node migrate.js [staging|production] [path-to-sql-dump]
 */

// Parse command line arguments
const args = process.argv.slice(2);
const environment = args[0] || "staging";
const dumpFilePath = args[1] || "../dump.sql";

// Check if environment is valid
if (environment !== "staging" && environment !== "production") {
  console.error('Invalid environment. Use "staging" or "production"');
  process.exit(1);
}

// Check if dump file exists
if (!fs.existsSync(dumpFilePath)) {
  console.error(`Dump file not found: ${dumpFilePath}`);
  process.exit(1);
}

// Set up database connection based on environment
const connectionString =
  environment === "production"
    ? process.env.DATABASE_URL_PRODUCTION
    : process.env.DATABASE_URL_STAGING;

if (!connectionString) {
  console.error(
    `DATABASE_URL_${environment.toUpperCase()} is not defined in .env file`
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Required for Heroku Postgres
  },
});

// Schema creation SQL
const schemaSql = `
-- =========================================
-- 🔹 Drop all tables and reset the database
-- =========================================
DROP TABLE IF EXISTS availability CASCADE;
DROP TABLE IF EXISTS competence_profile CASCADE;
DROP TABLE IF EXISTS competence CASCADE;
DROP TABLE IF EXISTS application CASCADE;
DROP TABLE IF EXISTS person CASCADE;
DROP TABLE IF EXISTS role CASCADE;
-- 🔹 Ensure database uses UTF-8
SET client_encoding = 'UTF8';
-- =========================================
-- 🔹 Create \`role\` Table (Create first because it's referenced by person)
-- =========================================
CREATE TABLE public.role (
    role_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
-- =========================================
-- 🔹 Create \`person\` Table
-- =========================================
CREATE TABLE public.person (
    person_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    pnr VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INTEGER NOT NULL,
    username VARCHAR(255) UNIQUE,
    CONSTRAINT person_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.role(role_id) ON DELETE CASCADE
);
-- =========================================
-- 🔹 Create \`competence\` Table
-- =========================================
CREATE TABLE public.competence (
    competence_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);
-- =========================================
-- 🔹 Create \`application\` Table
-- =========================================
CREATE TABLE public.application (
    application_id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    submission_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'unhandled' CHECK (status IN ('unhandled', 'accepted', 'rejected')),
    CONSTRAINT application_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(person_id) ON DELETE CASCADE
);
-- =========================================
-- 🔹 Create \`competence_profile\` Table
-- =========================================
CREATE TABLE public.competence_profile (
    competence_profile_id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    competence_id INTEGER NOT NULL,
    years_of_experience NUMERIC(4,2) NOT NULL,
    CONSTRAINT competence_profile_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(person_id) ON DELETE CASCADE,
    CONSTRAINT competence_profile_competence_id_fkey FOREIGN KEY (competence_id) REFERENCES public.competence(competence_id) ON DELETE CASCADE
);
-- =========================================
-- 🔹 Create \`availability\` Table
-- =========================================
CREATE TABLE public.availability (
    availability_id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    CONSTRAINT availability_person_id_fkey FOREIGN KEY (person_id) REFERENCES public.person(person_id) ON DELETE CASCADE
);
-- =========================================
-- 🔹 Insert Initial Data Without Explicit IDs
-- =========================================
-- Insert roles (Let the database assign IDs automatically)
INSERT INTO public.role (name) VALUES ('recruiter'), ('applicant');
-- Insert sample competences (Let the database assign IDs automatically)
INSERT INTO public.competence (name) VALUES 
('ticket sales'),
('lotteries'),
('roller coaster operation');
`;

// Data storage
const data = {
  person: [],
  availability: [],
  competence_profile: [],
};

// Counter for generating missing values
let pnrCounter = 0;

/**
 * Creates database schema
 */
async function createSchema() {
  console.log(`Creating database schema in ${environment} environment...`);

  const client = await pool.connect();
  try {
    await client.query(schemaSql);
    console.log("Schema created successfully");
  } catch (error) {
    console.error("Failed to create schema:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Parses SQL dump file and extracts data for each table
 */
async function parseDumpFile() {
  console.log(`Parsing dump file: ${dumpFilePath}`);

  const fileStream = fs.createReadStream(dumpFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentTable = null;

  for await (const line of rl) {
    // Detect which table data we're reading
    if (line.startsWith("COPY public.person")) {
      currentTable = "person";
      continue;
    } else if (line.startsWith("COPY public.availability")) {
      currentTable = "availability";
      continue;
    } else if (line.startsWith("COPY public.competence_profile")) {
      currentTable = "competence_profile";
      continue;
    }

    // End of table data
    if (line === "\\.") {
      currentTable = null;
      continue;
    }

    // Parse table data
    if (currentTable && line.trim() !== "") {
      const values = line.split("\t");

      switch (currentTable) {
        case "person":
          data.person.push(parsePersonData(values));
          break;
        case "availability":
          data.availability.push(parseAvailabilityData(values));
          break;
        case "competence_profile":
          data.competence_profile.push(parseCompetenceProfileData(values));
          break;
      }
    }
  }

  console.log(`Parsed data summary:`);
  console.log(`- Person records: ${data.person.length}`);
  console.log(`- Availability records: ${data.availability.length}`);
  console.log(
    `- Competence profile records: ${data.competence_profile.length}`
  );
}

/**
 * Generates a random password
 */
function generateRandomPassword() {
  // Generate a random password
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Parses and processes person data
 */
function parsePersonData(values) {
  const [person_id, name, surname, pnr, email, password, role_id, username] =
    values;

  // Generate missing data for person
  const processedPnr = pnr === "\\N" ? generatePnr() : pnr;
  const processedEmail =
    email === "\\N"
      ? `${name.toLowerCase()}@${surname.toLowerCase()}.se`
      : email;

  // Use plain text password instead of a hash - more secure as each user gets a unique password
  const processedPassword =
    password === "\\N" ? generateRandomPassword() : password;

  const processedRoleId = role_id || "2";
  const processedUsername = username === "\\N" ? `${name}${surname}` : username;

  return {
    person_id: parseInt(person_id),
    name,
    surname,
    pnr: processedPnr,
    email: processedEmail,
    password: processedPassword,
    role_id: parseInt(processedRoleId),
    username: processedUsername,
  };
}

/**
 * Parses availability data
 */
function parseAvailabilityData(values) {
  const [availability_id, person_id, from_date, to_date] = values;

  return {
    availability_id: parseInt(availability_id),
    person_id: parseInt(person_id),
    from_date,
    to_date,
  };
}

/**
 * Parses competence profile data
 */
function parseCompetenceProfileData(values) {
  const [competence_profile_id, person_id, competence_id, years_of_experience] =
    values;

  return {
    competence_profile_id: parseInt(competence_profile_id),
    person_id: parseInt(person_id),
    competence_id: parseInt(competence_id),
    years_of_experience: parseFloat(years_of_experience),
  };
}

/**
 * Generates a unique personal number (pnr)
 */
function generatePnr() {
  pnrCounter++;
  return `11112233-${String(pnrCounter).padStart(4, "0")}`;
}

/**
 * Migrates data to the target database
 */
async function migrateData() {
  console.log(`Starting migration to ${environment} database...`);

  const client = await pool.connect();
  try {
    // Begin transaction
    await client.query("BEGIN");

    // Import person data
    console.log("Importing person data...");
    for (const person of data.person) {
      await client.query(
        `INSERT INTO person (person_id, name, surname, pnr, email, password, role_id, username) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (person_id) DO UPDATE SET
           name = EXCLUDED.name,
           surname = EXCLUDED.surname,
           pnr = EXCLUDED.pnr,
           email = EXCLUDED.email,
           password = EXCLUDED.password,
           role_id = EXCLUDED.role_id,
           username = EXCLUDED.username`,
        [
          person.person_id,
          person.name,
          person.surname,
          person.pnr,
          person.email,
          person.password,
          person.role_id,
          person.username,
        ]
      );
    }

    // Generate and import application data
    console.log("Generating 15 sample applications...");

    // Get applicant person_ids (role_id = 2)
    const applicants = data.person.filter((p) => p.role_id === 2);

    // Randomly select up to 15 applicants
    const selectedApplicants =
      applicants.length <= 15
        ? applicants
        : applicants.sort(() => 0.5 - Math.random()).slice(0, 15);

    console.log(
      `Selected ${selectedApplicants.length} applicants for applications`
    );

    // Create applications with random statuses
    for (const applicant of selectedApplicants) {
      const statuses = ["unhandled", "accepted", "rejected"];
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      // Generate a random date in the last 90 days
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

      await client.query(
        `INSERT INTO application (person_id, submission_date, status) 
         VALUES ($1, $2, $3)`,
        [applicant.person_id, randomDate.toISOString(), randomStatus]
      );
    }

    // Import availability data
    console.log("Importing availability data...");

    // First, check which person_ids exist in availability but not in person
    const missingPersonIds = new Set();
    for (const avail of data.availability) {
      if (!data.person.some((p) => p.person_id === avail.person_id)) {
        missingPersonIds.add(avail.person_id);
      }
    }

    // Log warning about missing person records
    if (missingPersonIds.size > 0) {
      console.warn(
        `Warning: Found ${missingPersonIds.size} person_ids in availability that don't exist in person table`
      );
      console.warn(
        "These records will be skipped to maintain referential integrity"
      );
    }

    // Insert only availability records with valid person_ids
    for (const avail of data.availability) {
      if (!missingPersonIds.has(avail.person_id)) {
        await client.query(
          `INSERT INTO availability (availability_id, person_id, from_date, to_date) 
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (availability_id) DO UPDATE SET
             person_id = EXCLUDED.person_id,
             from_date = EXCLUDED.from_date,
             to_date = EXCLUDED.to_date`,
          [
            avail.availability_id,
            avail.person_id,
            avail.from_date,
            avail.to_date,
          ]
        );
      }
    }

    // Import competence profile data
    console.log("Importing competence profile data...");

    // First, check which person_ids exist in competence_profile but not in person
    const missingPersonIdsInCompetence = new Set();
    for (const comp of data.competence_profile) {
      if (!data.person.some((p) => p.person_id === comp.person_id)) {
        missingPersonIdsInCompetence.add(comp.person_id);
      }
    }

    // Log warning about missing person records
    if (missingPersonIdsInCompetence.size > 0) {
      console.warn(
        `Warning: Found ${missingPersonIdsInCompetence.size} person_ids in competence_profile that don't exist in person table`
      );
      console.warn(
        "These records will be skipped to maintain referential integrity"
      );
    }

    // Insert only competence_profile records with valid person_ids
    for (const comp of data.competence_profile) {
      if (!missingPersonIdsInCompetence.has(comp.person_id)) {
        await client.query(
          `INSERT INTO competence_profile (competence_profile_id, person_id, competence_id, years_of_experience) 
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (competence_profile_id) DO UPDATE SET
             person_id = EXCLUDED.person_id,
             competence_id = EXCLUDED.competence_id,
             years_of_experience = EXCLUDED.years_of_experience`,
          [
            comp.competence_profile_id,
            comp.person_id,
            comp.competence_id,
            comp.years_of_experience,
          ]
        );
      }
    }

    // Reset sequences
    console.log("Resetting sequences...");
    await client.query(
      "SELECT setval('person_person_id_seq', (SELECT MAX(person_id) FROM person), true)"
    );
    await client.query(
      "SELECT setval('application_application_id_seq', (SELECT MAX(application_id) FROM application), true)"
    );
    await client.query(
      "SELECT setval('availability_availability_id_seq', (SELECT MAX(availability_id) FROM availability), true)"
    );
    await client.query(
      "SELECT setval('competence_profile_competence_profile_id_seq', (SELECT MAX(competence_profile_id) FROM competence_profile), true)"
    );

    // Commit transaction
    await client.query("COMMIT");
    console.log(`Migration to ${environment} completed successfully!`);
  } catch (error) {
    // Rollback transaction on error
    await client.query("ROLLBACK");
    console.error("Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    client.release();
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log(`Starting migration to ${environment} environment`);

    // Create schema first
    await createSchema();

    // Parse the dump file
    await parseDumpFile();

    // Migrate the data
    await migrateData();

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Close database pool
    await pool.end();
  }
}

// Run the migration
main();

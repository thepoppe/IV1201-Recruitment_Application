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

// Data storage
const data = {
  person: [],
  availability: [],
  competence_profile: [],
};

// Counter for generating missing values
let pnrCounter = 0;

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
      ? `${name.toLowerCase()}.${surname.toLowerCase()}@amusementpark.com`
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

    const personIdMap = new Map(); // To store original -> new ID mapping

    for (const person of data.person) {
      const result = await client.query(
        `INSERT INTO person (name, surname, pnr, email, password, role_id, username) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING person_id;`, // Get the new ID
        [
          person.name,
          person.surname,
          person.pnr,
          person.email,
          person.password,
          person.role_id,
          person.username,
        ]
      );

      // Map old ID to new ID
      personIdMap.set(person.person_id, result.rows[0].person_id);
    }

    // Generate and import application data
    console.log("Generating 15 sample applications...");
    const statuses = ["unhandled", "accepted", "rejected"];

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
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

      // Use mapped person_id
      const correctPersonId = personIdMap.get(applicant.person_id);

      await client.query(
        `INSERT INTO application (person_id, submission_date, status) 
     VALUES ($1, $2, $3);`,
        [correctPersonId, randomDate.toISOString(), randomStatus]
      );
    }

    // Insert availability data
    console.log("Importing availability data...");
    for (const avail of data.availability) {
      const correctPersonId = personIdMap.get(avail.person_id);

      if (!correctPersonId) {
        console.warn(
          `Skipping availability for unknown person_id ${avail.person_id}`
        );
        continue;
      }

      await client.query(
        `INSERT INTO availability (person_id, from_date, to_date) 
     VALUES ($1, $2, $3);`,
        [correctPersonId, avail.from_date, avail.to_date]
      );
    }

    // Insert competence_profile data
    console.log("Importing competence profile data...");
    for (const comp of data.competence_profile) {
      const correctPersonId = personIdMap.get(comp.person_id);

      if (!correctPersonId) {
        console.warn(
          `Skipping competence_profile for unknown person_id ${comp.person_id}`
        );
        continue;
      }

      await client.query(
        `INSERT INTO competence_profile (person_id, competence_id, years_of_experience) 
     VALUES ($1, $2, $3);`,
        [correctPersonId, comp.competence_id, comp.years_of_experience]
      );
    }

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

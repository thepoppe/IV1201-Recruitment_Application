require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = 4000;

// PostgreSQL connection setup
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW() AS current_time");
    client.release();
    res.json({ success: true, time: result.rows[0].current_time });
  } catch (err) {
    console.error("Database connection error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

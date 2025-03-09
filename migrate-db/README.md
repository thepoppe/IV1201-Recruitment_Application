# Database Migration Script

This script migrates data from PostgreSQL dump file provided for the project to Heroku databases (staging or production).

## Features

- Creates complete database schema with all required tables
- Parses SQL dump files in PostgreSQL's `COPY FROM stdin` format
- Fills missing data in the person table according to specified rules:
  - Missing PNR: Uses "11112233-XXXX" format with incrementing numbers
  - Missing email: Generates "name@surname.se"
  - Missing password: Generates a random password for each user (can be reset by user using Forgot Password in the front-end)
  - Missing role_id: Sets to 2
  - Missing username: Combines name and surname
- Automatically generates 15 application records for testing
- Supports migration to both staging and production Heroku environments
- Uses transactions for data consistency

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Installation

1. Clone or download this repository

```bash
git clone https://github.com/thepoppe/IV1201-Recruitment_Application.git
```

2. Install dependencies (inside migrate-db):

```bash
npm install
```

3. Create a `.env` file with your Heroku database URLs:

```
DATABASE_URL_STAGING=postgres://username:password@host:port/staging_database_name
DATABASE_URL_PRODUCTION=postgres://username:password@host:port/production_database_name
```

## Usage

Run the script with the following command:

```bash
node migrate.js [environment] [path-to-sql-dump]
```

Where:
- `environment` is either `staging` or `production` (defaults to `staging` if not specified)
- `path-to-sql-dump` is the path to your SQL dump file (defaults to `../dump.sql` if not specified)

Example:

```bash
# Migrate to staging (default)
node migrate.js staging

# Migrate to production
node migrate.js production
```

Output after successfull data migraion:
```bash
$ node migrate.js production
Starting migration to production environment
Creating database schema in production environment...
Schema created successfully
Parsing dump file: ../dump.sql
Parsed data summary:
- Person records: 900
- Availability records: 2324
- Competence profile records: 1357
Starting migration to production database...
Importing person data...
Generating 15 sample applications...
Selected 15 applicants for applications
Importing availability data...
Importing competence profile data...
Resetting sequences...
Migration to production completed successfully!
Migration completed successfully
```

## ⚠️ WARNING:
-  This script COMPLETELY WIPES YOUR DATABASE before importing data. It drops all existing tables and recreates them from scratch. Make sure to back up any important data before running this script.
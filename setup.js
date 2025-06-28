#!/usr/bin/env node

// setup.js
const { Pool } = require('pg');
const fs = require('fs');

// JSON data file containing the extracted city data
const data = require('./wilayas_data.json');

async function main() {
  const prompt = require('prompt-sync')({ sigint: true });

  // Prompt for database connection information
  const host = prompt('DB_HOST: ');
  const port = prompt('DB_PORT: ');
  const user = prompt('DB_USER: ');
  const password = prompt('DB_PASSWORD: ');
  const database = prompt('DB_NAME: ');

  const pool = new Pool({ host, port, user, password, database });

  try {
    // Create tables if they do not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wilaya (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 8000000000000000 + 1000000000000000)::BIGINT),
        code INTEGER UNIQUE NOT NULL,
        name TEXT UNIQUE NOT NULL,
        name_ar TEXT
      );
      
      CREATE TABLE IF NOT EXISTS daira (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 8000000000000000 + 1000000000000000)::BIGINT),
        name TEXT NOT NULL,
        name_ar TEXT,
        wilaya_id BIGINT NOT NULL REFERENCES wilaya(id) ON DELETE CASCADE,
        UNIQUE(name, wilaya_id)
      );
      
      CREATE TABLE IF NOT EXISTS communes (
        id BIGINT PRIMARY KEY DEFAULT (floor(random() * 8000000000000000 + 1000000000000000)::BIGINT),
        name TEXT NOT NULL,
        name_ar TEXT,
        wilaya_id BIGINT NOT NULL REFERENCES wilaya(id) ON DELETE CASCADE,
        daira_id BIGINT NOT NULL REFERENCES daira(id) ON DELETE CASCADE,
        UNIQUE(name, daira_id, wilaya_id)
      );
    `);

    console.log('✔ Tables created successfully');

    // Insert data into tables
    for (const wilaya of data) {
      const wRes = await pool.query(
        `INSERT INTO wilaya (code, name, name_ar) VALUES ($1, $2, $3) RETURNING id`,
        [wilaya.code, wilaya.name, wilaya.name_ar]
      );
      const wilayaId = wRes.rows[0].id;

      for (const daira of wilaya.dairas) {
        const dRes = await pool.query(
          `INSERT INTO daira (name, name_ar, wilaya_id) VALUES ($1, $2, $3) RETURNING id`,
          [daira.name, daira.name_ar, wilayaId]
        );
        const dairaId = dRes.rows[0].id;

        for (const commune of daira.communes) {
          await pool.query(
            `INSERT INTO communes (name, name_ar, wilaya_id, daira_id) VALUES ($1, $2, $3, $4)`,
            [commune.name, commune.name_ar, wilayaId, dairaId]
          );
        }
      }
    }

    console.log('✔ All data inserted successfully');
    process.exit(0);
  } catch (err) {
    console.error('✖ Error:', err);
    process.exit(1);
  }
}

main();

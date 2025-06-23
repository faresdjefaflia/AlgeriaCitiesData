const { readFileSync } = require("fs");
const { Client } = require("pg");
const path = require("path");
require("dotenv").config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  await client.connect();
  const data = JSON.parse(readFileSync(path.join(__dirname, "data", "algeria_cities.json"), "utf8"));

  const wilayas = new Map();
  const dairas = new Map();

  for (const item of data) {
    const wilayaCode = parseInt(item.wilaya_code);
    const wilayaName = item.wilaya_name_ascii.trim();
    const wilayaNameAr = item.wilaya_name.trim();

    const dairaName = item.daira_name_ascii.trim();
    const dairaNameAr = item.daira_name.trim();

    const communeName = item.commune_name_ascii.trim();
    const communeNameAr = item.commune_name.trim();

    // 1. wilaya
    let wilayaId = wilayas.get(wilayaCode);
    if (!wilayaId) {
      const insertRes = await client.query(
        `INSERT INTO wilaya (code, name, name_ar)
         VALUES ($1, $2, $3)
         ON CONFLICT (code) DO NOTHING
         RETURNING id`,
        [wilayaCode, wilayaName, wilayaNameAr]
      );
      if (insertRes.rows.length > 0) {
        wilayaId = insertRes.rows[0].id;
      } else {
        const selectRes = await client.query(
          `SELECT id FROM wilaya WHERE code = $1`,
          [wilayaCode]
        );
        wilayaId = selectRes.rows[0]?.id;
      }
      if (!wilayaId) throw new Error(`Wilaya not found or inserted: ${wilayaName}`);
      wilayas.set(wilayaCode, wilayaId);
    }

    // 2. daira
    const dairaKey = `${dairaName}_${wilayaId}`;
    let dairaId = dairas.get(dairaKey);
    if (!dairaId) {
      const insertRes = await client.query(
        `INSERT INTO daira (name, name_ar, wilaya_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (name, wilaya_id) DO NOTHING
         RETURNING id`,
        [dairaName, dairaNameAr, wilayaId]
      );
      if (insertRes.rows.length > 0) {
        dairaId = insertRes.rows[0].id;
      } else {
        const selectRes = await client.query(
          `SELECT id FROM daira WHERE name = $1 AND wilaya_id = $2`,
          [dairaName, wilayaId]
        );
        dairaId = selectRes.rows[0]?.id;
      }
      if (!dairaId) throw new Error(`Daira not found or inserted: ${dairaName}`);
      dairas.set(dairaKey, dairaId);
    }

    // 3. commune
    await client.query(
      `INSERT INTO communes (name, name_ar, wilaya_id, daira_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name, daira_id, wilaya_id) DO NOTHING`,
      [communeName, communeNameAr, wilayaId, dairaId]
    );
  }

  await client.end();
  console.log("✅ Done importing.");
}

run().catch((err) => {
  console.error("❌ Error:", err);
  client.end();
});

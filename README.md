# 🇩🇿 Algeria Cities Data (Wilayas, Dairas, Communes) for PostgreSQL + Node.js

A Node.js script to import Algerian administrative data (wilayas, dairas, and communes) into a PostgreSQL database. Useful for Express.js or general backend projects.

---

## 📦 Requirements

- PostgreSQL
- Node.js
- JSON data file: `algeria_cities.json`
- Required packages: `pg`, `dotenv`, `fs` (built-in)

---

## 📂 Database Schema

```sql
CREATE TABLE wilaya (
  id BIGINT PRIMARY KEY DEFAULT (
    floor(random() * 8000000000000000 + 1000000000000000)::BIGINT
  ),
  code INTEGER UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL,
  name_ar TEXT
);

CREATE TABLE daira (
  id BIGINT PRIMARY KEY DEFAULT (
    floor(random() * 8000000000000000 + 1000000000000000)::BIGINT
  ),
  name TEXT NOT NULL,
  name_ar TEXT,
  wilaya_id BIGINT NOT NULL REFERENCES wilaya(id) ON DELETE CASCADE,
  UNIQUE(name, wilaya_id)
);

CREATE TABLE communes (
  id BIGINT PRIMARY KEY DEFAULT (
    floor(random() * 8000000000000000 + 1000000000000000)::BIGINT
  ),
  name TEXT NOT NULL,
  name_ar TEXT,
  wilaya_id BIGINT NOT NULL REFERENCES wilaya(id) ON DELETE CASCADE,
  daira_id BIGINT NOT NULL REFERENCES daira(id) ON DELETE CASCADE,
  UNIQUE(name, daira_id, wilaya_id)
);
````

---

## ⚙️ Install Dependencies

```bash
npm install
```

---

## 📁 Project Structure

```
project/
│
├── data/
│   └── algeria_cities.json
├── Database Schema/
│   └── 1.wilaya.sql
│   └── 2.daira.sql  
│   └── 3.communes.sql
│
├── .env
├── db.js
├── addCities.js
├── README.md
```

---

## 🧪 .env File Example

```env
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
```

---

## 🚀 Run the Script

```bash
node addCities.js
```

This will:

1. Insert wilayas
2. Insert related dairas
3. Insert related communes

Using ASCII names for logic (`*_ascii`) and Arabic names for display (`*_ar`).

---

## ✅ Notes

* The script uses `ON CONFLICT DO NOTHING` to avoid duplicates.
* The script assumes the JSON file includes both ASCII and Arabic names.

---

## 🕌 Credit

Data adapted from official Algerian administrative sources and formatted for PostgreSQL + Node.js usage.

Thanks: https://github.com/othmanus/algeria-cities
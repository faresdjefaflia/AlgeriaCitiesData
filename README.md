أكيد، هذا نص `README` باللغة الإنجليزية، بسيط واحترافي:

---

AlgeriaCitiesData 🇩🇿
A simple CLI tool to import structured data of Algerian **Wilayas**, **Dairas**, and **Communes** into a PostgreSQL database.

---

**Features:**

* Automatically creates tables: `wilaya`, `daira`, `communes`
* Populates them with full official data from a structured JSON file
* Minimal setup – just provide your database credentials

---

**Installation:**

```bash
npm install -g algeriacitiesdata
```

---

**Usage:**

```bash
algeriacitiesdata
```

You will be prompted to enter your database connection:

```
DB_HOST: 127.0.0.1
DB_PORT: 5432
DB_USER: your_user
DB_PASSWORD: your_password
DB_NAME: your_database
```

If the connection is valid, the tool will:

* Create necessary tables if they don't exist
* Insert all wilayas, their dairas, and communes

---

**Example Output:**

```
✔ Tables created successfully  
✔ All data inserted successfully
```

---

**Tables created:**

* `wilaya(id, code, name, name_ar)`
* `daira(id, name, name_ar, wilaya_id)`
* `communes(id, name, name_ar, wilaya_id, daira_id)`

---

**Author:**
Fares Djefaflia
GitHub: [https://github.com/faresdjefaflia](https://github.com/faresdjefaflia)

---

**License:**
MIT

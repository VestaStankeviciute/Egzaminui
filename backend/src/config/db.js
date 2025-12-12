const mysql = require("mysql2/promise");

// Prisijungimas prie Docker MySQL
const pool = mysql.createPool({
  host: "mysql",      // Jei backend veikia lokaliai; Docker Compose atveju bus "mysql"
  user: "root",
  password: "rootpassword",
  database: "egzaminas"
});

module.exports = db;

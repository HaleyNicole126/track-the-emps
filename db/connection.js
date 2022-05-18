const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: "localhost",
      user: "root",
      password: "*MinneSki126",
      database: "employee_db",
    },
    console.log("Connected to the election database.")
  );
  

module.exports = db;



const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // Your MySQL username,
    user: "root",
    // Your MySQL password
    password: "*MinneSki126",
    database: "employee_db",
  },
  console.log("Connected to the election database.")
);

// // GET all departments
db.query(`SELECT * FROM department`, (err, rows) => {
  console.log(rows);
});

// // GET a single department
// db.query(`SELECT * FROM department WHERE id = 1`, (err, row) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(row);
// });

// DELETE a department
// db.query(`DELETE FROM department WHERE id = ?`, 1, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// CREATE a departmnet
// const sql = `INSERT INTO department (id, name)
//               VALUES (?, ?)`;
// const params = [1, 'Senior Management'];

// db.query(sql, params, (err, result) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(result);
// });

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

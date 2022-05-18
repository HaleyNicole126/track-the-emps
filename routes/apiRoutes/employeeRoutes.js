const express = require("express");
const router = express.Router();
const db = require("../../db/connection");
const inputCheck = require('../../utils/inputCheck');

// // GET all employees
router.get("/employee", (req, res) => {
  const sql = `SELECT 
    e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS department,     
    role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e 
    LEFT JOIN role on e.role_id = role.id
    LEFT JOIN employee m ON m.id = e.manager_id
    LEFT JOIN department on role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// GET an employee by their ID

router.get("/employee/:id", (req, res) => {
    const sql = `SELECT 
      e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS department,     
      role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e 
      LEFT JOIN role on e.role_id = role.id
      LEFT JOIN employee m ON m.id = e.manager_id
      LEFT JOIN department on role.department_id = department.id
      WHERE e.id = ?`;
      const params = [req.params.id];
  
    db.query(sql, params, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });

// CREATE an employee
router.post("/employee", ({ body }, res) => {
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "role_id",
    "manager_id"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO employee (body.first_name, body.last_name, body.role_id, body.manager_id)
    VALUES (?, ?, ?, ?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body,
    });
  });
});

// Update employee's role


// DELETE an employee

module.exports = router;

const express = require("express");
const mysql = require("mysql2");
const inputCheck = require('./utils/inputCheck');

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
app.get('/api/department', (req, res) => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// GET a single department
app.get('/api/department/:id', (req, res) => {
  const sql = `SELECT * FROM department WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// DELETE a department
app.delete('/api/department/:id', (req, res) => {
  const sql = `DELETE FROM department WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Department not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// CREATE a department
app.post('/api/department', ({ body }, res) => {
  const errors = inputCheck(
    body,
    "name"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO department (name)
  VALUES (?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
});

// // GET all roles
app.get('/api/role', (req, res) => {
  const sql = `SELECT role.*, department.name
          AS departmnet_name
          FROM role
          LEFT JOIN department
          ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// GET a single role
app.get('/api/role/:id', (req, res) => {
  const sql = `SELECT role.*, department.name
            AS department_name
            FROM role
            LEFT JOIN department
            ON role.department_id = department.id
            WHERE role.id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row
    });
  });
});

// CREATE a role
app.post('/api/role', ({ body }, res) => {
  const errors = inputCheck(
    body,
    "name"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  const sql = `INSERT INTO role (name)
  VALUES (?)`;
  const params = [body.name];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: body
    });
  });
});

// DELETE a role 
app.delete('/api/role/:id', (req, res) => {
  const sql = `DELETE FROM role WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Role not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

// CREATE an employee
app.post('/api/employee', ({ body }, res) => {
  const errors = inputCheck(
    body,
    'first_name', 'last_name', 'role_id', 'manager_id'
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
      data: body
    });
  });
});

// // GET all employees
app.get('/api/employee', (req, res) => {
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
      message: 'success',
      data: rows
    });
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

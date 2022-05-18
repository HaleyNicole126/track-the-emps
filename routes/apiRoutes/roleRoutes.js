const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// // GET all roles
router.get('/role', (req, res) => {
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
  router.get('/role/:id', (req, res) => {
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
  router.post('/role', ({ body }, res) => {
    const errors = inputCheck(
      body,
      "title", "salary", "department_id"
    );
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];
  
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
  router.delete('/role/:id', (req, res) => {
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

  module.exports = router; 
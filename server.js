const express = require("express");
// const db = require("./db/connection");
const apiRoutes = require("./routes/apiRoutes");
// const inputCheck = require('./utils/inputCheck');
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", apiRoutes);

// menu prompt

const promptMenu = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "menuList",
        message: "What would you like to do?",
        choices: [
          "view-all-departments",
          "view-all-roles",
          "view-all-employees",
          "add-a-department",
          "add-a-role",
          "add-an-employee",
          "update-an-employee-role",
        ],
      },
    ])
    .then((userPick) => {
      switch (userPick.menuList) {
        case "view-all-departments":
          viewAllDept();
          break;
        case "view-all-roles":
          viewAllRole();
          break;
        case "view-all-employees":
          viewAllEmp();
          break;
        case "add-a-department":
          addDept();
          break;
        case "add-a-role":
          addRole();
          break;
        case "add-an-employee":
          addEmp();
          break;
        case "update-an-employee-role":
          updateEmp();
          break;
      }
    });
};

// viewAllDept()
function viewAllDept() {
  db.query(`SELECT * FROM department`, function (err, results) {
    console.log("Departments");
    console.table(results);
    promptMenu();
  });
};

// viewAllRole()
function viewAllRole() {
  db.query(
    `SELECT role.*, department.name
  AS departmnet_name
  FROM role
  LEFT JOIN department
  ON role.department_id = department.id`,
    function (err, results) {
      console.log("Roles");
      console.table(results);
      promptMenu();
    }
  );
};

// viewAllEmp()
function viewAllEmp() {
  db.query(
    `SELECT 
  e.id, e.first_name, e.last_name, role.title AS job_title, department.name AS department,     
  role.salary AS salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e 
  LEFT JOIN role on e.role_id = role.id
  LEFT JOIN employee m ON m.id = e.manager_id
  LEFT JOIN department on role.department_id = department.id`,
    function (err, results) {
      console.log("Employees");
      console.table(results);
      promptMenu();
    }
  );
};

// addDept()
function addDept() {
  inquirer
    .prompt({
      type: "input",
      name: "dept",
      message: "Department name:",
    })
    .then((deptname) => {
      db.query(
        `INSERT INTO department (name) VALUES (?)`,
        deptname.dept,
        function (err, results) {
          console.log("Department added successfully!");
          viewAllDept();
        }
      );
    });
};

// addRole()

// addEmp()

// updateEmp()

promptMenu();
// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

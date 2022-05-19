const express = require("express");
// const db = require("./db/connection");
const apiRoutes = require("./routes/apiRoutes");
// const inputCheck = require('./utils/inputCheck');
const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const { response } = require("express");

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
          "update-an-employee-manager",
          // "view-employees-by-manager",
          // "view-employees-by-dept",
          "delete-dept",
          "delete-role",
          "delete-employee",
          // "view-dept-budget"
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
          updateEmpRole();
          break;
        case "update-an-employee-manager":
          updateEmpMgr();
          break;
        // case
        //   "view-employees-by-dept":
        //   viewEmpDept();
        //   break;
        case
          "delete-dept":
          deleteDept();
          break;
        case
          "delete-role":
          deleteRole();
          break;
        case
          "delete-employee":
          deleteEmp();
          break;
        // case
        //   "view-dept-budget":
        //   viewBudget();
        //   break;
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
}

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
}

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
}

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
}

// addRole()
function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "jobTitle",
        message: "Job Title:",
      },
      {
        type: "input",
        name: "salary",
        message: "Role Salary:",
      },
      {
        type: "input",
        name: "deptId",
        message: "Department ID:",
      },
    ])
    .then((rname) => {
      const sql = `INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`;
      const params = [rname.jobTitle, rname.salary, rname.deptId];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("Success! Role Added");
        viewAllRole();
      });
    });
}

// addEmp()
function addEmp() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "First Name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Last Name:",
      },
      {
        type: "input",
        name: "role_id",
        message: "Role ID:",
      },
      {
        type: "input",
        name: "manager_id",
        message: "Manager ID",
      },
    ])
    .then((empname) => {
      const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?,?,?,?)`;
      const params = [
        empname.first_name,
        empname.last_name,
        empname.role_id,
        empname.manager_id,
      ];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("Success! Employee added");
        viewAllEmp();
      });
    });
}

// updateEmp()
function updateEmpRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message:
          "Employee ID of the Employee to update:",
      },
      {
        type: "input",
        name: "role_id",
        message: "What is the Role ID of their new position?",
      },
    ])
    .then((emprole) => {
      const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
      const params = [emprole.role_id, emprole.employee_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("Success! Role updated");
        viewAllEmp();
      });
    });
};

// updateEmp()
function updateEmpMgr() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employee_id",
        message:
          "Employee ID of the Employee to update:",
      },
      {
        type: "input",
        name: "manager_id",
        message: "What is their new manager's ID?",
      },
    ])
    .then((empmgr) => {
      const sql = `UPDATE employee SET manager_id = ? WHERE id = ?`;
      const params = [empmgr.manager_id, empmgr.employee_id];
      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("Success! Manager updated");
        viewAllEmp();
      });
    });
}

// Delete Department
function deleteDept() {
  inquirer.prompt(
    {
      type: "input",
      name: "dept_id",
      message: "Department ID to delete: "
    }
  )
  .then((response) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [response.dept_id];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("successfully deleted department");
      viewAllDept();
    });
  })
}

// Delete Role
function deleteRole() {
  inquirer.prompt(
    {
      type: "input",
      name: "role_id",
      message: "Role ID to delete: "
    }
  )
  .then((response) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [response.role_id];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("successfully deleted role");
      viewAllRole();
    });
  })
}

// Delete Employee
function deleteEmp() {
  inquirer.prompt(
    {
      type: "input",
      name: "employee_id",
      message: "Employee ID to delete: "
    }
  )
  .then((response) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [response.employee_id];

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log("successfully deleted employee");
      viewAllEmp();
    });
  })
}

promptMenu();
// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

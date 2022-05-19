const express = require("express");
// const db = require("./db/connection");
const apiRoutes = require("./routes/apiRoutes")
// const inputCheck = require('./utils/inputCheck');
const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require("./db/connection");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", apiRoutes);

// menu prompt

const promptMenu = () => {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'menuList',
      message: 'What would you like to do?',
      choices: ['view-all-departments', 'view-all-roles', 'view-all-employees', 'add-a-department', 'add-a-role', 'add-an-employee', 'update-an-employee-role']
    }
  ])
  .then(userPick => {
    switch(userPick.menuList){
      case 'view-all-departments':viewAllDept();
      break;
      case 'view-all-roles':viewAllRole();
      break;
      case 'view-all-employees':viewAllEmp();
      break;
      case 'add-a-department':addDept();
      break;
      case 'add-a-role':addRole();
      break;
      case 'add-an-employee':addEmp();
      break;
      case 'update-an-employee-role':updateEmp();
      break;
    }
  });
};

// viewAllDept()
function viewAllDept() {
  db.query(`SELECT * FROM department`,
    function (err, results) {
      console.log("Departments");
      console.table(results);
      promptMenu();
    })

};

// viewAllRole()

// viewAllEmp()

// addDept()

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

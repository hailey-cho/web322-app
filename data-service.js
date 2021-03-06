const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "d153adli6s4o93",
  "dofxxhxxlmwmxb",
  "9ee5406f68953b190d598260bfeacd985608c949793cf2182eee0b0b0accbb72",
  {
    host: "ec2-54-225-228-142.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    }
  }
);

// Employee table
const Employee = sequelize.define("Employee", {
  employeeNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  maritalStatus: Sequelize.STRING,
  isManager: Sequelize.STRING,
  employeeManagerNum: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING
});

// Department table
const Department = sequelize.define("Department", {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  departmentName: Sequelize.STRING
});

Department.hasMany(Employee, { foreignKey: "department" });

// Reads employee and departments data
module.exports.initialize = function() {
  return new Promise((resolve, reject) => {
    sequelize
      .sync()
      .then(function() {
        console.log("Connection has been established successfully.");
        resolve();
      })
      .catch(function(err) {
        console.log("Unable to connect to the database:", err);
        reject("unable to sync the database");
      });
  });
};

// Return all employees
module.exports.getAllEmployees = function() {
  return new Promise((resolve, reject) => {
    Employee.findAll()
      .then(function(data) {
        resolve(data);
      })
      .catch(err => {
        reject("No results returned");
      });
  });
};

// add an employee
module.exports.addEmployee = function(employeeData) {
  return new Promise(function(resolve, reject) {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (const key in employeeData) {
      if (employeeData[key] === "") {
        employeeData[key] = null;
      }
    }
    Employee.create(employeeData)
      .then(res => resolve(res))
      .catch(err => reject("Unable to create employee"));
  });
};

// add a department
module.exports.addDepartment = function(departmentData) {
  return new Promise(function(resolve, reject) {
    for (const key in departmentData) {
      if (departmentData[key] === "") {
        departmentData[key] = null;
      }
    }
    Department.create(departmentData)
      .then(res => resolve(res))
      .catch(err => reject("Unable to create department"));
  });
};

// return all departments
module.exports.getDepartments = function() {
  return new Promise(function(resolve, reject) {
    Department.findAll()
      .then(data => {
        var fixed = [];
        for (var i = 0; i < data.length; i++) {
          fixed.push(data[i].dataValues);
        }
        resolve(fixed);
      })
      .catch(err => {
        reject("No results returned");
      });
  });
};

// Return all employees with the same status
module.exports.getEmployeesByStatus = function(status) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        status: status
      }
    })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject("No results returned");
      });
  });
};

// Return all employees in this department
module.exports.getEmployeesByDepartment = function(department) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        department: department
      }
    })
      .then(res => resolve(res))
      .catch(err => reject("No results returned"));
  });
};

// Return all employees with this manager
module.exports.getEmployeesByManager = function(manager) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeManagerNum: manager
      }
    })
      .then(res => resolve(res))
      .catch(err => reject("No results returned"));
  });
};

// Return the employee with this employee number
module.exports.getEmployeeByNum = function(num) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeNum: num
      }
    })
      .then(res => resolve(res[0]))
      .catch(err => reject("No results returned"));
  });
};

// return the department with this department id
module.exports.getDepartmentById = function(id) {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: {
        departmentId: id
      }
    })
      .then(res => resolve(res[0]))
      .catch(err => reject("No results returned"));
  });
};

module.exports.deleteDepartmentById = function(id) {
  return new Promise((resolve, reject) => {
    Department.destroy({
      where: {
        departmentId: id
      }
    })
      .then(res => resolve("destroyed"))
      .catch(err => reject(err));
  });
};

// deletes an employee
module.exports.deleteEmployeeByNum = function(num) {
  return new Promise((resolve, reject) => {
    Employee.destroy({
      where: {
        employeeNum: num
      }
    })
      .then(() => {
        resolve();
      })
      .catch(err => {
        reject("Unable to delete employee");
      });
  });
};

// update an employee
module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = employeeData.isManager ? true : false;
    for (const key in employeeData) {
      if (employeeData[key] === "") {
        employeeData[key] = null;
      }
    }
    Employee.update(employeeData, {
      where: {
        employeeNum: employeeData.employeeNum
      }
    })
      .then(res => resolve(res))
      .catch(err => reject("Unable to update employee"));
  });
};

// update a department
module.exports.updateDepartment = function(departmentData) {
  return new Promise((resolve, reject) => {
    for (const key in departmentData) {
      if (departmentData[key] === "") {
        departmentData[key] = null;
      }
    }
    Department.update(departmentData, {
      where: {
        departmentId: departmentData.departmentId
      }
    })
      .then(res => resolve(res))
      .catch(err => reject("Unable to update department"));
  });
};

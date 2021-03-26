const Sequelize = require('sequelize');


const sequelize = new Sequelize('d7aggshi3gkp84', 'omsgrdclinrjdd', '7d6f670345dfb52b8bb3041bc8b55a41531de38d27d22519b79f3cc8e86e75c0', {
    host: 'ec2-3-91-127-228.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions:{
        ssl: {rejectUnauthorized: false}
    }
});

const Employee = sequelize.define('Employee', {
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

const Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
})

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        sequelize
        .sync()
        .then(function() {
            console.log('Connection has been established successfully.');
            resolve();
        })
        .catch(function(err) {
            console.log('Unable to connect to the database:', err);
            reject("unable to sync the database");
        });
    });
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject)=>{
        Employee.findAll()
            .then(res => resolve(res))
            .catch(err => reject(err))

    });
}

module.exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        reject();
    });
}

module.exports.addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(const key in employeeData){
            if(employeeData[key] === ""){
                employeeData[key] = null;
            }
        }
        console.log(employeeData)
        Employee.create(employeeData)
            .then(res => resolve(res))
            .catch(err => reject("Unable to create employee"))
    })
}

module.exports.addDepartment = function(departmentData){
    return new Promise(function(resolve, reject){
        for(const key in departmentData){
            if(departmentData[key] === ""){
                departmentData[key] = null;
            }
        }
        Department.create(departmentData)
            .then(res => resolve(res))
            .catch(err => reject("Unable to create department"))
    })
}

module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        Department.findAll()
            .then(res => resolve(res))
            .catch(err => reject("No results returned"))
    })
}

//query Employees
module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where: {
                status
            }
        })
            .then(res => resolve(res))
            .catch(err => reject("No results returned"))
    
    });
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where: {
                department
            }
        })
        .then(res => resolve(res))
        .catch(err => reject("No results returned"))
    });
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            }
        })
        .then(res => resolve(res))
        .catch(err => reject("No results returned"))
    });
}

module.exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject)=>{
        Employee.findAll({
            where: {
                employeeNum: num
            }
        })
            .then(res => resolve(res[0]))
            .catch(err => reject("No results returned"))
    });
}

module.exports.getDepartmentById = function(id){
    return new Promise((resolve, reject)=>{
        Department.findAll({
            where: {
                departmentId: id 
            }
        })
            .then(res => resolve(res[0]))
            .catch(err => reject("No results returned"))
    });
}

module.exports.deleteDepartmentById = function(id){
    return new Promise((resolve, reject)=>{
        Department.destroy({
            where: {
                departmentId: id
            }
        })
        .then(res => resolve("destroyed"))
        .catch(err => reject(err))
    })
}

module.exports.deleteEmployeeByNum = function(num){
    return new Promise((resolve, reject)=>{
        Employee.destroy({
            where: {
                employeeNum: num
            }
        })
        .then(res => resolve("destroyed"))
        .catch(err => reject(err))
    })
}

module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve, reject)=>{
        employeeData.isManager = (employeeData.isManager) ? true : false;
        for(const key in employeeData){
            if(employeeData[key] === ""){
                employeeData[key] = null;
            }
        }
        Employee.update(employeeData, {
            where: {
                employeeNum: employeeData.employeeNum
            }
        })
            .then(res => resolve(res))
            .catch(err => reject("Unable to update employee"))
    });
}

module.exports.updateDepartment = function(departmentData){
    return new Promise((resolve, reject)=>{
        for(const key in departmentData){
            if(departmentData[key] === ""){
                departmentData[key] = null;
            }
        }
        Department.update(departmentData, {
            where: {
                departmentId: departmentData.departmentId
            }
        })
            .then(res => resolve(res))
            .catch(err => reject("Unable to update department"))
    });
}

const fs = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        fs.readFile('./data/employees.json', (err, data)=>{
            if(err){
                return reject("Unable to read file");
            }
            employees = JSON.parse(data);
            fs.readFile('./data/departments.json', (err, data)=>{
                if(err){
                    return reject("Unable to read file");
                }
                departments = JSON.parse(data);
                resolve();
            })
        })
        
    })
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject)=>{
        if(employees.length === 0){
            reject("No results retured");
        }
        else{ 
            resolve(employees);
        }
            
    });
}

module.exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        const managers = employees.filter(employee => employee.isManager);
        if(managers.length === 0){
            reject("No results returned");
        }
        else{
            resolve(managers);
        }
    });
}

module.exports.addEmployee = function(employeeData){
    return new Promise(function(resolve, reject){
        if(employeeData.isManager === undefined){
            employeeData.isManager = false;
        }
        employeeData.employeeNum = employees.length + 1;
        employees.push(employeeData);
        resolve();
    
    })
}


module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(departments.length === 0){
            reject("No results returned");   
        }
        else{
            resolve(departments);
        }
    })
}

//query Employees
module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject)=>{
        const employeesByStatus = employees.filter(e => e.status === status);
        if(employeesByStatus.length === 0){
            reject("No results retured");
        }
        else{ 
            resolve(employeesByStatus);
        }
    
    });
}

module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject)=>{
        const getEmployeesByDepartment = employees.filter(e => e.department === Number(department));
        if(getEmployeesByDepartment.length === 0){
            reject("No results retured");
        }
        else{ 
            resolve(getEmployeesByDepartment);
        }
    
    });
}

module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject)=>{
        const employeesByManagerNum = employees.filter(e => e.employeeManagerNum === Number(manager));
        if(employeesByManagerNum.length === 0){
            reject("No results retured");
        }
        else{ 
            resolve(employeesByManagerNum);
        }
    
    });
}

module.exports.getEmployeeByNum = function(num){
    return new Promise((resolve, reject)=>{
        const employeeNum = employees.find(e => e.employeeNum === Number(num));
        if(employeeNum.length === 0){
            reject("No results retured");
        }
        else{ 
            resolve(employeeNum);
        }
    
    });
}

module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve, reject)=>{
        const employee = employees.find(e => e.SSN === employeeData.SSN);
        if(employee){

            employee.firstName = employeeData.firstName;
            employee.lastName = employeeData.lastName;
            employee.email = employeeData.email;
            employee.addressStreet = employeeData.addressStreet;
            employee.addressCity = employeeData.addressCity;
            employee.addressState = employeeData.addressState;
            employee.addressPostal = employeeData.addressPostal;
            employee.isManager = employeeData.isManager;
            employee.status = employeeData.status;
            employee.department = employeeData.department;
            resolve();
        }       
    
    })
}

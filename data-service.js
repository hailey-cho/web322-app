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

const fs = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        fs.readFile('./data/employees.json', (err, data)=>{
            if(err){
                reject(err);
            }
            employees = JSON.parse(data);
        })
        fs.readFile('./data/departments.json', (err, data)=>{
            if(err){
                reject(err);
            }
            departments = JSON.parse(data);
        })
    })
}

module.exports.getAllEmployees = function(){
    return new Promise((resolve, reject)=>{
        if(employees.length == 0){
            reject("No results retured");
        }
        resolve(employees);
    });
}

module.exports.getManagers = function(){
    return new Promise(function(resolve, reject){
        var filteredManager = [];
        for(let i = 0; i < employees.length; i++){
            if(employees[i].isManager == true){
                filteredManager.push(employees[i]);
            }
        }
        if(filteredManager == 0){
            reject("No results returned");
        }
        resolve(filteredManager);
    });
}

module.exports.getDepartments = function(){
    return new Promise(function(resolve, reject){
        if(departments.length == 0){
            reject("No results returned");   
        }
        resolve(departments);
    })
}


// module.exports = {
//     initialize, getAllEmployees, getManagers, getDepartments
// }
const fs = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function(){
    return new Promise((resolve, reject)=>{
        fs.readFile('./data/employees.json', (err, data)=>{ //callback function 
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
        // var managers = [];
        // for(let i = 0; i < employees.length; i++){
        //     if(employees[i].isManager == true){
        //         managers.push(employees[i]);
        //     }
        // }
        const managers = employees.filter(employee => employee.isManager);
        if(managers.length === 0){
            reject("No results returned");
        }
        else{
            resolve(managers);
        }
    });
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


// module.exports = {
//     initialize, getAllEmployees, getManagers, getDepartments
// }
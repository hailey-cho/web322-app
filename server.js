/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Hayeon Cho______ Student ID: ___121074199___ Date: ___February 5th 2021___
*
*  Online (Heroku) Link: ________https://salty-waters-37475.herokuapp.com/___________
*
********************************************************************************/ 


const express = require("express");
const path = require("path");
const dataService = require("./data-service.js");
const app = express();


app.use(express.static('public')); // "static" middleware

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "views/home.html"));
});

app.get("/about", function(req, res){
    res.sendFile(path.join(__dirname, "views/about.html"));
})

app.get("/employees", function(req, res){
    dataService.getAllEmployees().then((data)=>{
        res.json(data);
    }).catch(err =>{
        res.json({
            message: err
        });
    });
});

app.get("/managers", function(req, res){
    dataService.getManagers().then((data)=>{
        res.json(data);
    }).catch(err => {
        res.json({
            message: err
        });
    });
});

app.get("/departments", function(req, res){
    dataService.getDepartments().then((data)=>{
        res.json(data);
    }).catch(err => {
        res.json({
            message: err
        })
    });
});

app.get("/employees/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addEmployee.html"));
});

app.get("/images/add", function(req, res){
    res.sendFile(path.join(__dirname, "/views/addImage.html"));
});

app.use(function(req,res){
    res.status(404).sendFile(path.join(__dirname, "views/notFound.html"));
}) 


var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log(`Express http server listening on port, ${HTTP_PORT}`);
}


dataService.initialize()
    .then(function(){ 
        app.listen(HTTP_PORT, onHttpStart);
    }).catch(function(err){ 
        console.log("Failed to start " + err);
    });

    
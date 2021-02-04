/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Hayeon Cho______ Student ID: ___121074199___ Date: ___February 2nd 2021___
*
*  Online (Heroku) Link: ____________https://salty-waters-37475.herokuapp.com/ ___________________
*
********************************************************************************/ 



const express = require("express");
const path = require("path");
const dataService = require("./data-service.js");
const app = express();


app.use(express.static('public')); // "static" middleware

app.get("/", function(req, res){
    // res.sendFile("/Users/hayeoncho/Desktop/4semester/web322/assignments/web322-app/views/home.html");
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

// no matching route
// app.use(function(err, req, res, next){
//     console.log("error");
//     res.status(400).send("Page Not Found");
//     // // res.sendFile(path.join(__dirname, "views/notFound.html"));
//     // next();
// })

// app.use((req,res)=>{
//     res.status(404).send("NO Matching route"); 
// })

app.use(function(req,res){
    // res.status(404).send("No matching route");
    res.status(404).sendFile(path.join(__dirname, "views/notFound.html"));
}) 


var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log(`Express http server listening on port, ${HTTP_PORT}`);
}


dataService.initialize()
    .then(function(){ //resolve
        app.listen(HTTP_PORT, onHttpStart);
    }).catch(function(err){ //reject
        console.log("Failed to start " + err);
    });

    
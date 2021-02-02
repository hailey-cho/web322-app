/*********************************************************************************
*  WEB322 – Assignment 02
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Hayeon Cho______ Student ID: ___121074199___ Date: ___February 2nd 2021___
*
*  Online (Heroku) Link: ________________________________________________________
*
********************************************************************************/ 



var express = require("express");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;

function onHttpStart(){
    console.log("Express http server listening on port");
}

app.use(express.static('public')); // "static" middleware

app.get("/", function(req, res){
    res.send("<a href='views/home.html'></a>");
});

app.get("/about", function(req, res){
    res.send("<a href='views/about.html'></a>")
})

app.get("/employees", function(req, res){
    res.json()
})

app.get("/managers", function(req, res){
    res.send("TODO: get all employees who have isManager==true");
})

app.get("/departments", function(req, res){
    res.json()
})

// no matching route
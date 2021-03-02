/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Hayeon Cho______ Student ID: ___121074199___ Date: ___February 18th 2021___
*
*  Online (Heroku) Link: ________https://salty-waters-37475.herokuapp.com/__________
*
********************************************************************************/ 


const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const dataService = require("./data-service.js");
const exphbs = require("express-handlebars");
const app = express();

app.engine('.hbs', exphbs({extname: ".hbs"}));
app.set('view engine', '.hbs');


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage}); // storage: storage

app.use(express.static('public')); // "static" middleware

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", function(req, res){
    res.render(path.join(__dirname, "views/home.html"));
});

app.get("/about", function(req, res){
    res.render(path.join(__dirname, "views/about.html"));
})

app.get("/employees", function(req, res){
    const {
        status, department, manager
    } = req.query;
    if(status){
        dataService.getEmployeesByStatus(status).then((data)=>{
            res.json(data);
        }).catch(err =>{
            res.json({
                message: err
            });
        });
    }
    else if(department){
        dataService.getEmployeesByDepartment(department).then((data)=>{
            res.json(data);
        }).catch(err =>{
            res.json({
                message: err
            });
        });
    }
    else if(manager){
        dataService.getEmployeesByManager(manager).then((data)=>{
            res.json(data);
        }).catch(err =>{
            res.json({
                message: err
            });
        });
    }
    else{
        dataService.getAllEmployees().then((data)=>{
            res.json(data);
        }).catch(err =>{
            res.json({
                message: err
            });
        });
    }
});


app.get("/employee/:value", function(req, res){
    const num = req.params.value;
    dataService.getEmployeeByNum(num).then((data)=>{
        res.json(data);
    }).catch(err =>{
        res.json({
            message: err
        });
    });
})

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
    res.render(path.join(__dirname, "/views/addEmployee.html"));
});

app.post("/employees/add", function(req, res){
    dataService.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    })
    
})

app.get("/images/add", function(req, res){
    res.render(path.join(__dirname, "/views/addImage.html"));
});

app.post("/images/add", upload.single("imageFile"), function(req, res){
    res.redirect("/images");
});

app.get("/images", function(req, res){
    fs.readdir("./public/images/uploaded", function(err, items){
        if(err){
            throw err;
        } 
        res.json({
            images: items
        })
    })
})

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

navLink: function(url, options){
    return '<li' + 
        ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
        '><a href="' + url + '">' + options.fn(this) + '</a></li>';
}
    
equal: function (lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if (lvalue != rvalue) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
}

/*********************************************************************************
*  WEB322 – Assignment 06
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: _____Hayeon Cho______ Student ID: ___121074199___ Date: ___April 6 2021_
*
*  Online (Heroku) Link: ________https://salty-waters-37475.herokuapp.com/__________
*
********************************************************************************/ 

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const multer = require("multer");
const clientSessions = require("client-sessions"); 
const fs = require("fs");
const path = require("path");
const dataService = require("./data-service.js");
const dataServiceAuth = require("./data-service-auth.js")
const exphbs = require("express-handlebars");
const app = express();
var HTTP_PORT = process.env.PORT || 8080;


const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({storage}); // storage: storage

const ensureLogin = (req, res, next) => {
    if(!req.session.user){ // if a user is not logged in
        res.redirect("/login");
    }
    else{
        next();
    }
}

app.engine('.hbs', exphbs({
    extname: ".hbs", 
    defaultLayout: "main",
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }        
        
    }
}));

app.set('view engine', '.hbs');


app.use(clientSessions({
    cookieName: "session",
    secret: "A6_web322",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use(express.static('public')); // "static" middleware
app.use(bodyParser.urlencoded({ extended: true }))

app.use(bodyParser.json())

app.use(function(req,res,next){
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});


app.get("/", function(req, res){
    res.render("home", {});
});

app.get("/about", function(req, res){
    res.render("about", {});
});

app.get("/employees", ensureLogin, function(req, res){
    const {
        status, department, manager
    } = req.query;
    if(status){
        dataService.getEmployeesByStatus(status).then((data)=>{
            if(data.length > 0){
                res.render("employees", {
                    employees: data
                })
            }
            else{
                res.render("employees", {
                    message: "no results"
                });
            }
        }).catch((err) => {
                res.status(500).send("No results");
            });
    }
    else if(department){
        dataService.getEmployeesByDepartment(department).then((data)=>{
            if(data.lenght > 0){
                res.render("employees", {
                    employees: data
                });
            }
            else{
                res.render("employees", {
                    message: "no results"
                });
            }
        }).catch(err =>{
            res.status(500).send("No results");
        });
    }
    else if(manager){
        dataService.getEmployeesByManager(manager).then((data)=>{
            if(data.length > 0){
                res.render("employees", {
                    employees: data
                });
            }
            else{
                res.render("employees", {
                    message: "no results"
                });
            }
        }).catch(err =>{
            res.status(500).send("No results");
        });
    }
    else{
        dataService.getAllEmployees().then((data)=>{
            data = data.map(e => e.dataValues);
            if(data.length > 0){
                res.render("employees", {
                    employees: data
                });
            }
            else {
                res.render("employees", {
                    message: "no results"
                });
            }
            
        }).catch(err =>{
            res.status(500).send("No results");
        });
    }
});


app.get("/employee/:empNum", ensureLogin, function(req, res){
    const viewData = {}
    const num = req.params.empNum;
    dataService.getEmployeeByNum(num).then((data)=>{
        if (data) {
            viewData.employee = data.dataValues; //store employee data in the "viewData" object as "employee"
        } else {
            viewData.employee = null; // set employee to null if none were returned
        }
    }).catch(() => {
        viewData.employee = null; // set employee to null if there was an error 
    }).then(dataService.getDepartments)
    .then((data) => {
        viewData.departments = data.map(e => e.dataValues); // store department data in the "viewData" object as "departments"

        // loop through viewData.departments and once we have found the departmentId that matches
        // the employee's "department" value, add a "selected" property to the matching 
        // viewData.departments object

        for (let i = 0; i < viewData.departments.length; i++) {
            if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
            }
        }
    }).catch(() => {
        viewData.departments = []; // set departments to empty if there was an error
    }).then(() => {
        if (viewData.employee == null) { // if no employee - return an error
            res.status(404).send("Employee Not Found");
        } else {
            res.render("employee", { employee: viewData.employee, departments: viewData.departments }); // render the "employee" view
        }
    });
});

        

app.get("/department/:departmentId", ensureLogin, function(req, res){
    const id = req.params.departmentId;
    dataService.getDepartmentById(id).then((data)=>{
        if(data){
            res.render("department", {
                department: data.dataValues
            });
        }
        else{
            res.status(404).send("Department Not Found");
        }
    }).catch(err =>{
        res.status(404).send("Department Not Found");
    });
})

app.get("/department/delete/:departmentId", ensureLogin, function(req, res){
    const id = req.params.departmentId;
    dataService.deleteDepartmentById(id)
    .then((data)=>{
        res.redirect("/departments");
    })
    .catch(err => {
        res.status(500).send("Unable to Remove Department / Department not found")
    })
})

app.get("/employees/delete/:empNum", ensureLogin, function(req, res){
    const id = req.params.empNum;
    dataService.deleteEmployeeByNum(id)
    .then((data)=>{
        res.redirect("/employees");
    })
    .catch(err => {
        res.status(500).send("Unable to Remove Employee / Employee not found")
    })
})

app.post("/employee/update", ensureLogin, (req, res) => {
    dataService.updateEmployee(req.body).then(()=>{
        res.redirect("/employees");
    }).catch((rejectMsg) => {
        res.status(500).send("Unable to Remove Employee / Employee not found");
    })
});


app.get("/managers", ensureLogin, function(req, res){
    dataService.getManagers().then((data)=>{
        res.json(data);
    }).catch(err => {
        res.json({
            message: err
        });
    });
});

app.get("/departments", ensureLogin, function(req, res){
    dataService.getDepartments().then((data)=>{
        if(data.length > 0){
            res.render("departments", {
                departments: data
            });
        }
        else{
            res.render("departments", {
                message: "no results"
            })
        }
        
    }).catch(err => {
        res.status(500).send("No results");
    });
});

app.get("/departments/add", function(req, res) {
    dataService.getDepartments().then((data) => {
        res.render("addDepartment", {departments: data});
    }).catch((err)=>{
        res.render("addDepartment", {departments: []});
    });
});

app.post("/departments/add", (req, res) => {
    dataService.addDepartment(req.body).then(()=>{
        res.redirect("/departments");
    }).catch((rejectMsg) => {
        res.status(500).send("Unable to add department");
    });
});

app.post("/department/update", (req, res) => {
    dataService.updateDepartment(req.body)
    .then(() => { 
        res.redirect("/departments");
    })
    .catch((rejectMsg) => {
        res.status(500).send("No results");
    }); 
});

//employee
app.get("/employees/add", ensureLogin, function(req, res){
    dataService.getDepartments()
        .then(data =>{
            res.render("addEmployee", {departments: data});
        })
        .catch(err => {
            res.render("addEmployee", {departments: []}); 
        })
});

app.post("/employees/add", ensureLogin, function(req, res){
    dataService.addEmployee(req.body).then(()=>{
        res.redirect("/employees");
    })  
    .catch(err => {
        res.status(500).send("Unable to add employee");
    })
})

app.get("/images/add", ensureLogin, function(req, res){
    res.render("addImage", {});
});

app.post("/images/add", upload.single("imageFile"), ensureLogin, function(req, res){
    res.redirect("/images");
});

app.get("/images", ensureLogin, function(req, res){
    fs.readdir('public/images/uploaded',(err,files)=>{
        if(err){
            throw err;
        }
        res.render("images", {
            images: files
        }); 
    });
})

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.post("/register", (req, res) => {
    dataServiceAuth.registerUser(req.body)
        .then(() => {
            res.render("register",{successMessage: "User created"});
        })
        .catch((err) => {
            res.render("register", {errorMessage: err, userName: req.body.userName} );
        })
});

app.post("/login", (req, res) => {
    req.body.userAgent = req.get('User-Agent');
    dataServiceAuth.checkUser(req.body).then((user) => {
        req.session.user = {
            userName: user.userName,// authenticated user's userName
            email: user.email,// authenticated user's email
            loginHistory: user.loginHistory// authenticated user's loginHistory
        }
        res.redirect('/employees');
    }).catch((err) => {
        res.render("login", {errorMessage: err, userName: req.body.userName});
    })
});

app.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/");
});

app.get("/userHistory", ensureLogin, (req, res) => {
    res.render("userHistory");
})

app.use(function(req,res){
    res.status(404).sendFile(path.join(__dirname, "views/notFound.html"));
}); 



function onHttpStart(){
    console.log(`app listening on: ${HTTP_PORT}`);
}


dataService.initialize()
    .then(dataServiceAuth.initialize)
    .then(function(){ 
        app.listen(HTTP_PORT, onHttpStart);
    }).catch(function(err){ 
        console.log("unable to start server: " + err);
    });
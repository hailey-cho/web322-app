const mongoose = require("mongoose");

const Schema = mongoose.Schema
const userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    password: String,
    email: String,
    loginHistory:[{
        dateTime: Date,
        userAgent: String
    }]
});

const User = mongoose.model("User", userSchema);

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://hcho:hcho@web.d4aio.mongodb.net/web322_app?retryWrites=true&w=majority");
        db.on('error', (err)=>{
            reject(err); // reject the promise with the provided error
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });
};

module.exports.registerUser = function(userData) {
    return new Promise(function (resolve, reject){
        const {password, password2} = userData;
        if(password !== password2){
            return reject("Passwords do not match");
        }
        const newUser = new User(userData);
        newUser.save()
            .then(() => {
                resolve();
            })
            .catch((err) => {
                if(err.code === 11000){
                    return reject("User Name already taken");
                }
                reject(`There was an error creating the user: ${err}`);

            })
    })
}

module.exports.checkUser = function(userData) {
    return new Promise(function (resolve, reject){
        User.find({
            userName: userData.userName
        })
            .then((users) => {
                if(!users || users.length === 0){
                    return reject(`Unable to find user: ${users[0]}`);
                }
                if(users[0].password !== userData.password){
                    return reject(`Incorrect Password for user: ${userData.userName}`);
                }
                users[0].loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent});
                User.update(
                    {userName: users[0].userName},
                    {$set: {loginHistory: users[0].loginHistory}}
                ).then(() => {
                    resolve(users[0]);  
                }).catch((err) => {
                    reject(`There was an error verifying the user: ${err}`);
                })
            }).catch((err) => {
                reject(`Unable to find user: ${userData.userName}`);
            })
    })
}


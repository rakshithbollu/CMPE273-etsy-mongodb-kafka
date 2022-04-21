const express = require('express');
const session = require('express-session');
const app = express();
var mysql = require('mysql');
//const passport    = require('passport');
var cors = require('cors');
//var constraints = require("./config.json");
var multer =require('multer');
app.use(cors());
var kafka = require('./kafka/client');
//require('../Utils/passport');
//app.get('/',(req,res) => res.send('API Running'));


const connectDB = require('./config/db');
const path = require('path');


app.get('/',(req,res) => res.send('API Running'));

connectDB();

// Init Middleware
app.use(express.json());
app.use(session({
     secret: 'mysql',
     resave: false,
     saveUninitialized: false,
     duration: 60 * 60 * 1000,
     activeDuration: 5 * 60 * 1000
 }));
 
/*
var connection = mysql.createPool({
    host: constraints.DB.host,
    user:constraints.DB.username,
    password: constraints.DB.password,
    port: constraints.DB.port,
    database: constraints.DB.database
});
*/
var connection = mysql.createConnection({
    host: 'localhost',
    database: 'users_schema',
    port: '3306',
    user: 'root',
    password: 'Git@m123'
});

connection.connect((err) => {
    if(err){
        throw 'Error occured ' + err.message;
    }
    console.log("pool created");
});


app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/shopname', require('./routes/api/shopname'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
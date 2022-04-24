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




connectDB();

app.use(express.static(__dirname + '/public'));
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

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/shopname', require('./routes/api/shopname'));

app.get('*', function (req, res) {
    res.sendFile(`${__dirname}/public/index.html`, (err) => {
      if (err) {
        console.log(err);
        res.end(err.message);
      }
    });
  });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
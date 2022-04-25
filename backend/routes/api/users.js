const express = require('express');
const router = express.Router();
const session = require('express-session');
var mysql = require('mysql');
//var constraints = require("../../config.json");
var cors = require('cors');
const {check, validationResult} = require('express-validator');
//const app = express();
var kafka = require('../../kafka/client');
router.use(cors());
const e = require('express');
router.use(express.urlencoded({extended: true}));

router.use(express.json())
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require('../../utils/config');
const {auth} = require('../../utils/passport');
auth();
const connectDB = require('../../config/db');
var User =require('../../models/User');
const config = require('config');
connectDB();
//app.use(express.json({extended: false}));

//For route use  GET api/users
//router.get('/',(req,res) => res.send('User Route'));

/*
var connection = mysql.createPool({
    host: constraints.DB.host,
    user:constraints.DB.username,
    password: constraints.DB.password,
    port: constraints.DB.port,
    database: constraints.DB.database
});
*/



/*
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  check('password','password should be minimum of length 6 charcaters').isLength({min: 6}),
], async (req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    var value = req.body.password;
    const salt=await bcrypt.genSalt(10);
    value =await bcrypt.hash(value,salt);
    if(!errors.isEmpty()){
    //res.send(errors.code);
    return res.status(500).json({errors: errors.array()});
    }
    const {name,email,password} = req.body;
    try{ 
        connection.query(`SELECT email FROM users WHERE email=?`,[email
        ],  function(error,results){
            console.log(results);
            if(results.length === 0){
                console.log("New user");
                connection.query(`Insert into users(name,email,password) values(?,?,?)`,[name,
                    email,value],  function(error,results){
                  if(error){
                        res.writeHead(200, {
                             'Content-Type': 'text-plain'
                          });
                         res.send(error.code);
                         res.send("failure");
                     }else{
                          res.writeHead(200,{
                             'Content-Type': 'text/plain'
                         });
                         //res.end(JSON.stringify(results));
                         res.end("success");
                     }
                 });
            }
            else{
                //console.log("User already existed!");
               res.send("failure");
            }
        });
        
    }
    catch(err){
        console.error(err.message);
        res.send("server error");
    }
}
);
*/

router.post(
    '/',
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      kafka.make_request('register',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if(results.status === 500 || results.status === 400){
          res.send(results.message);
          }
          else{
          res.send (results.message);
          }
        
    });
    }
  );


router.post('/signin', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password','password is required').exists()
  ], async (req,res) => {

    console.log(req.body);
    const errors = validationResult(req.body);
    if(!errors.isEmpty()){

        return res.status(500).json({errors: errors.array()});
    }
    const {email,password} = req.body;
    kafka.make_request('login',req.body, function(err,results){
      if(results.status === 200 ){
        res.status(200).send(results.message);
      }
      else{
        res.status(results.status).send(results.message);
      }
      
  });
});
  
module.exports = router;
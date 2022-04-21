"use strict";
const JwtStrategy = require('passport-jwt').Strategy;
const  ExtractJwt  = require('passport-jwt').ExtractJwt;
const passport = require('passport');
var {secret} = require('./config');
var mysql = require('mysql');
const User = require('../models/User');

const connectDB = require('../config/db');
const path = require('path');


connectDB();

function auth()
{
    var opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: secret
    };
passport.use (new JwtStrategy(opts,(jwt_payload,callback) => {
    const email = jwt_payload.email
    console.log(email);
    User.find({email:email},
    (error,results)=> {
        if(error){
            console.log("Invalid user from server");
            return callback(error,false)
        }
        if(results){
            console.log("Valid user");
            callback(null,results);}
            else {
                console.log("InValid user");
                callback(null,results);}
})})
)
}

exports.auth = auth;
exports.checkAuth =passport.authenticate("jwt",{session :false});
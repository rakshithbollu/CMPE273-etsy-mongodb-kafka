const express = require('express');
//const auth = require('../../middleware/auth');
const router = express.Router();
const {checkAuth, auth} = require("../../utils/passport");
auth();
//For route use  GET api/auth

router.get('/authentication',checkAuth,(req,res) => 
{

    console.log(req.user[0]);
    console.log("hi")
if (req.session)
{
    //res.json({ success: true, isAuthenticated: true, user: {email: user.email, id: user.id, username: user.username} });
    res.json({success: true, user : [{email: req.user[0].email, name: req.user[0].name, password : req.user[0].password,dateofbirth : req.user[0].dateofbirth, picture:req.user[0].picture,mobile:req.user[0].mobile,city:req.user[0].city,country : req.user[0].country,address : req.user[0].address,gender:req.user[0].gender,shopname:req.user[0].shopname,shopimage:req.user[0].shopimage}]});
}
});
module.exports = router;
const express = require('express');
const router = express.Router();
const session = require('express-session');
var mysql = require('mysql');
var kafka = require('../../kafka/client');
//var constraints = require("../../config.json");
var cors = require('cors');
const {check, validationResult} = require('express-validator');
//const app = express();
router.use(cors());
const User = require('../../models/User');
const Product = require('../../models/productModel');
const e = require('express');
const Order = require('../../models/Order');
const Favourite = require('../../models/Favourite');
const Cart = require('../../models/Cart')
//const { default: OrderDetails } = require('../../../frontend/src/components/order/OrderDetails');
//const ApiFeatures = require("../utils/apifeatures");
router.use(express.urlencoded({extended: true}));
router.use(express.json())
var Category=require('../../models/Category');
//app.use(express.json({extended: false}));

//For route use  GET api/users
//router.get('/',(req,res) => res.send('User Route'));


var connection = mysql.createConnection({
    host: 'localhost',
    database: 'users_schema',
    port: '3306',
    user: 'root',
    password: 'Git@m123'
});

connection.connect((err) => {
    if(err){
        throw 'Error occured ' + err;
    }
    console.log("pool created");
});


router.post('/uniqueshopname', [
    check('shopname', 'shop name is required').not().isEmpty(),
  ], async (req,res) => {
      console.log(req.body);
      const errors = validationResult(req);
      console.log(errors);
      if(!errors.isEmpty()){
      //res.send(errors.code);
      return res.status(500).json({errors: errors.array()});
      }
      const {shopname} = req.body;
      try{ 
        let shopunique = await User.find({ shopname });
              if(shopunique.length !== 0){
                res.status(200).json({success: false,shopunique});
                
                       }      
              else{
                
                res.status(200).json({success: true});
                  //console.log("Restaurant already existed!");
              }
          
      }
      catch(err){
          console.error(err.message);
          res.send("server error");
      }
  }
  );

  router.post('/createshop', [
    check('shopname', 'shop name is required').not().isEmpty(),
  ], async (req,res) => {
      console.log("shop data",req.body);
      const errors = validationResult(req);
      console.log(errors);
      if(!errors.isEmpty()){
      //res.send(errors.code);
      return res.status(500).json({errors: errors.array()});
      }
      const {shopname,email} = req.body;
      kafka.make_request('createshop',req.body, function(err,results){
        console.log(results);
              if(err){
                res.status(results.status).json(results.message);
                 }
                 
                 else{
                    res.status(200).json({success: true});
                }
             }); 

  }
  );

  router.get('/getShopDetails/:shopname', [
], async (req,res) => {
    console.log(req.params);
    const {shopname} = req.params;
    kafka.make_request('getshopdetails',req.params, function(err,results){
       // console.log(results);
              if(results.status === 400 || results.status === 500 ){
                res.status(results.status).json(results.message);
                 }
                 
                 else{
                    res.status(200).json(results);
                }
             }); 

  }
  );
    

router.post('/createproduct', [
        check('productname', 'product name is required').not().isEmpty(),
        check('description', 'product description is required').not().isEmpty(),
        check('price', 'price is required').not().isEmpty(),
        check('category', 'category is required').not().isEmpty(),
        check('stock', 'stock is required').not().isEmpty(),
        check('currency','currency is required').not().isEmpty(),
        check('image_URL','image_url is required').not().isEmpty(),
        
      ], async (req,res) => {
          console.log(req.body);
          const errors = validationResult(req);
          console.log(errors);
          if(!errors.isEmpty()){
          //res.send(errors.code);
          return res.status(500).json({errors: errors.array()});
          }
          const {productname,description,price,category,stock,image_URL,shopname,currency} = req.body;
          kafka.make_request('createproduct',req.body, function(err,results){
            // console.log(results);
                   if(results.status === 400 || results.status === 500 ){
                     res.status(results.status).json(results.message);
                      }
                      
                      else{
                         res.status(200).json(results);
                     }
                  }); 
     
       }
       );

// owner editing the product details

router.post('/updateproduct/:productid/'
  , async (req,res) => {
    //var id = req.params.productid;
    kafka.make_request('updateproduct',[req.params,req.body], function(err,results){
        // console.log(results);
               if(results.status === 400 || results.status === 500 ){
                 res.status(results.status).json(results.message);
                  }
                  
                  else{
                     res.status(200).json(results);
                 }
              }); 
 
   }
   );

// shop admin deleting the products
router.post('/deleteproductfromshop'
  , async (req,res) => {
    console.log(req.body);
    const {_id,product} = req.body;
    kafka.make_request('deleteproduct',req.body, function(err,results){
        // console.log(results);
               if(err ){
                 res.status(results.status).json(results.message);
                  }
                  
                  else{
                     res.status(200).json({success:true});
                 }
              }); 
   }
   );

router.post('/saveshopimage', [
    
  ], async (req,res) => {
      console.log(req.body);
      const {shopimage,email} = req.body;
      kafka.make_request('saveshopimage',req.body, function(err,results){
        // console.log(results);
               if(results.status === 400 || results.status === 500 ){
                 res.status(results.status).json(results.message);
                  }
                  
                  else{
                     res.status(200).json(results);
                 }
              }); 
 
   }
   );


  router.post('/getshopcategory', [
    
], async (req,res) => {
    console.log(req.body);
    const {shopname} = req.body;
    try{  
        let results = await Category.find({ $or :[{shopname:shopname} , {shopname : "NULL"}] })
                  if(!results){
  
                         //res.send(error.code);
                         res.status(400).json({success: false});
                     }else{
                         //res.end(JSON.stringify(results));
                         res.status(200).json({success: true,results});
                     }
                
            }      
    catch(err){
        console.error(err.message);
        res.send("database error");
    }
}
);

router.post('/shopcategory', [
    
], async (req,res) => {
    console.log(req.body);
    const {shopname,category} = req.body;
    try{  
        
        let categories =[]
        categories = new Category({
            shopname,
            category,
          });
    
          await categories.save();
                         //res.end(JSON.stringify(results));
                         res.status(200).json({success: true});
            }      
    catch(err){
        console.error(err.message);
        res.send("database error");
    }
}
);
  module.exports = router;
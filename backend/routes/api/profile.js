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
const product = require('../../models/productModel');
const Favourite = require('../../models/Favourite');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart')
const e = require('express');
//const ApiFeatures = require("../utils/apifeatures");
router.use(express.urlencoded({extended: true}));
router.use(express.json())
const {checkAuth} = require("../../utils/passport");
const connectDB = require('../../config/db');
const config = require('config');
const { response } = require('express');
connectDB();
//app.use(express.json({extended: false}));

//For route use  GET api/users
//router.get('/',(req,res) => res.send('User Route'));





//For route use  GET api/profile



router.post('/changeprofile'
  , async (req,res) => {
    console.log(req.body);
    const {email,name,city,dateofbirth,mobile,address,country,picture} = req.body;
    //{$set:{item_name:item_name,foodtype:foodtype,price:price}},{new: true}
    kafka.make_request('updateprofile',req.body, function(err,results){
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


router.post('/addgiftoption'
  , async (req,res) => {
    console.log(req.body);
    const {email,product,giftoption} = req.body;
    //{$set:{item_name:item_name,foodtype:foodtype,price:price}},{new: true}
    kafka.make_request('addgiftop',req.body, function(err,results){
        // console.log(results);
               if(results.status === 400 || results.status === 500 ){
                 res.status(results.status).json(results.message);
                  }
                  
                  else{
                     res.status(200).json(results.message);
                  }
              }); 
 
   }
   );

router.post('/addgiftdescription'
  , async (req,res) => {
    console.log(req.body);
    const {email,product,giftdescription} = req.body;
    //{$set:{item_name:item_name,foodtype:foodtype,price:price}},{new: true}
    kafka.make_request('addgiftdesc',req.body, function(err,results){
        // console.log(results);
               if(results.status === 400 || results.status === 500 ){
                 res.status(results.status).json(results.message);
                  }
                  
                  else{
                     res.status(200).json(results.message);
                  }
              }); 
 
   }
   );

//display the product details based on the products given in the search query

//display products
router.post(
    '/getSearchDetails',
    [],
    
    async (req, res) => {
      
        kafka.make_request('searchproducts',[req.body,req.query], function(err,results){
            // console.log(results);
                   if(err ){
                     res.status(results.status).json(results.message);
                      }
                      
                      else{
                         res.status(200).json(results);
                      }
                  }); 
     
       }
);
//let favorites1= await Favourite.find({email})
//let favorites = await Favourite.aggregate(query);
//let favorites = await Favourite.find({email}).populate('product').sort({price:-1})
//let favorites = await Favourite.find({email, test:{$gte: minvalue,$lte:maxvalue}}).sort({te:1})
// favorites = await Favourite.find({email:/wa/})

//let favorites = await Favourite.find({email}).populate('product','productname description')
// getting the particular product details

router.get('/getProductDetails', [

  ], async (req,res) => {

    console.log(req.query);
    const errors = validationResult(req.body);
    if(!errors.isEmpty()){

        return res.status(500).json({errors: errors.array()});
    }
    //const {email,password} = req.body;
    kafka.make_request('getproductdetail',req.query, function(err,results){
        // console.log(results);
               if( results.status===400 || results.status===500){
                 res.status(results.status).json(results.message);
                  }
                  
                  else{
                     res.status(200).json(results);
                  }
              }); 
 
            });

//adding the cart details
router.post('/addtocart'
  , async (req,res) => {
    // get current cart price and add this product price to it and generate cartprice
    
   
          kafka.make_request('addItemstocart',req.body, function(err,results){
        console.log(results);
              if(results.status===400 || results.status===500){
                res.status(results.status).json(results.message);
                 }
                 
                 if (results.status===200) {
                    res.status(200).json(results.message);
                }
             });  
             
  }
);

// delete products from the cart
router.post('/deletefromcart'
  , async (req,res) => {
    console.log(req.body);
    // get current cart price and add this product price to it and generate cartprice
    const {productid,email} = req.body;
    kafka.make_request('deletecartitems',req.body, function(err,results){
        console.log(results);
              if(results.status===400 || results.status===500){
                res.status(results.status).json(results.message);
                 }
                 
                 if (results.status===200) {
                    res.status(200).json({success:true});
                }
             }); 
});

//my cart details
router.post('/getCartDetails'
  , async (req,res) => {
    console.log("email details",req.body);
    const {email} = req.body;
    kafka.make_request('getcartitems',req.body, function(err,results){
        console.log(results);
              if(err){
                res.status(500).json(err);
                 }
                 
                 else{
                    res.status(200).json(results);
                }
             }); 
}
);



// creating a order id in orders table after paying for products in the cart.
/*
router.post('/orders'
  , async (req,res) => {
    console.log("emails is",req.body);
    const {email,totalprice} = req.body;
    try{   
           // inserting into orders 
            connection.query(`Insert into orders(email,orderdate,totalprice) values(?,?,?)`,[email,
            (new Date().toISOString().slice(0, 10)),totalprice],function(error,results){
                console.log(results)});
                // getting the products from cart table based on user name
            connection.query(`SELECT  productid,quantity,price,shopname from cart where email = ?`,email,function(error,results){
                //results=JSON.parse(JSON.stringify(results));
                // get the latest order id from the orders table
            connection.query(`SELECT  max(orderid) as orderid from orders where email = ?`,email,function(error1,results1){
            const orderid = results1[0].orderid
            for ( let i =0;i<results.length;i++) {
                //var productid = results[i].productid
                // inserting into the orderdetails table by looping over the products in the cart
                  connection.query(`Insert into orderdetails(productid,quantity,orderid,price,shopname,totalprice) values(?,?,?,?,?,?)`,[results[i].productid,results[i].quantity,orderid,results[i].price,results[i].shopname,totalprice],function(error2,results2){
                    //var i;
                    console.log("printing i",i);
                    // to get the sales count variable and update the stock/quantity in the products table
                    connection.query(`SELECT sum(quantity) as salescount from users_schema.orderdetails where productid=?`,[results[i].productid],function(error3,results3){
                        //const salescount = results3[0].salescount 
                        console.log("salescount",results3[0].salescount)             
                    connection.query(`UPDATE products set stock=(stock-?),salescount=? where productid =?`,[results[i].quantity,results3[0].salescount,results[i].productid])
                    //connection.query(`UPDATE products set stock=(stock-?) where productid =?`,[results[i].quantity,results[i].productid])

                    if(error)
                    {
                        res.status(400).json({success: false}); 
                        
                    }
                    console.log('values added')
                   
                    
            })})}})})
            // deleting data from cart table.
            connection.query(`Delete from cart where email = ?`, email,function(error,results){
                if (error)
                {
                    res.status(400).json({success: false}); 
                    
                }
                else 
                {
                    res.status(200).json({success:true});
                }  
         })
        }
             catch(err){
        console.error(err.message);
        res.send("server error");
    }
}
);
*/

router.post('/orders'
  , async (req,res) => {
    console.log("emails is",req.body);
    
    kafka.make_request('addorders',req.body, function(err,results){
        console.log(results);
              if(err){
                res.status(results.status).json(results.message);
                 }
                 
                 else{
                    res.status(200).json({success : 'true'});
                }
             }); 
}
);

// fetching the orders made by a particular end user.
/*
router.post('/mypurchases'
  , async (req,res) => {
    console.log(req.body);
    const {email} = req.body;
    try{   
       
            connection.query(`SELECT  P.productid , P.productname ,P.currency, P.shopname , P.image_URL,OD.quantity,OD.price,
            O.orderid , O.orderdate,OD.totalprice from users_schema.products P , users_schema.orders O , users_schema.orderdetails OD
            where O.email = ?  AND P.productid IN ( select OD.productid from users_schema.orderdetails 
            where OD.orderid IN (select O.orderid from users_schema.orders))`,email,  function(error,results){
            console.log(results);
            if (results.length !== 0)
            {
                res.status(200).json(results);
            }
            else 
            {
                res.status(400).json("false"); 
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
//getting the order details

// fetching the orders made by a particular end user.
router.post('/mypurchases', [
], async (req,res) => {
    
    kafka.make_request('getorders',req.body, function(err,results){
        console.log(results);
              if(err){
                res.status(results.status).json(results.message);
                 }
                 
                 else{
                    res.status(200).json(results);
                }
             }); 
}
);

/*
router.post('/addfavourite', [
], async (req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
    //res.send(errors.code);
    return res.status(500).json({errors: errors.array()});
    }
    const {productid,email} = req.body;
    try{  
                connection.query(`Insert into favorites(productid,email) values(?,?)`,[productid,email
                    ],  function(error,results){
                  if(error){
                         //res.send(error.code);
                         res.status(400).json("failure");
                     }else{
                        res.status(200).json("success");
                     }
                 });
            }      
    catch(err){
        console.error(err.message);
        res.send("database error");
    }
}
);
*/

// add favorite
router.post('/addfavourite', [
], async (req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
    //res.send(errors.code);
    return res.status(500).json({errors: errors.array()});
    }
    kafka.make_request('add_favproducts',req.body, function(err,results){
        console.log(results)
        if(results.status=== 500){
            res.send("database error");
        }
        if(results.status=== 200){
            res.status(200).json("success");
        }
        
    }); 
  
}
);
/*
router.post('/getfavourite', [
], async (req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
    //res.send(errors.code);
    return res.status(500).json({errors: errors.array()});
    }
    var {favkeyword,email} = req.body;
    if (favkeyword === "undefined") {
        var favkeyword= ""
    }
    try{  
        let temp = `'%${favkeyword}%'`;

                connection.query(`SELECT P.* FROM products P WHERE  P.productname like ${temp} AND P.productid in (select productid from favorites where email=?)`,[email
                    ],  function(error,results){
                   console.log(results)
                  if(error){
                    res.status(400).json("failure");
                     }else{
                        res.status(200).json({success:true, results});
                     }
                 });
            }      
    catch(err){
        console.error(err.message);
        res.send("database error");
    }
}
);
*/
//getfavorites

router.post('/getfavourite', [
], async (req,res) => {
    
   
    kafka.make_request('getfavproducts',req.body, function(err,results){
        console.log(results);
              if(err){
                res.status(results.status).json(results.message);
                 }
                 
                 else{
                    res.status(200).json(results);
                }
             }); 
}
);

/*
router.post('/deletefavourite', [
], async (req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
    //res.send(errors.code);
    return res.status(500).json({errors: errors.array()});
    }
    const {productid,email} = req.body;
    try{  
                connection.query(`delete from  favorites Where productid = ? and email = ? `,[productid,email
                    ],  function(error,results){
                  if(error){
                    res.status(400).json("failure");
                     }else{
                        res.status(200).json({success:true});
                     }
                 });
            }      
    catch(err){
        console.error(err.message);
        res.send("database error");
    }
}
);
*/

// delete favorite

router.post('/deletefavourite', [
], async (req,res) => {
    console.log(req.body);
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
    //res.send(errors.code);
    return res.status(500).json({errors: errors.array()});
    }
  
 
        kafka.make_request('delete_favproducts',req.body, function(err,results){
            console.log(results);
                  if(results.status===400 || results.status===500){
                    res.status(results.status).json(results.message);
                     }
                     
                     if (results.status===200) {
                        res.status(200).json({success:true});
                    }
                 });    
    
}
);

// changing the currency
router.post('/changecurrency'
  , async (req,res) => {
    console.log(req.body);
    const {currency} = req.body;
    try{  
        connection.query(`UPDATE products set currency=?`,[currency], function(error,results){
        //console.log(results);
        if(error){
            res.send("failure");
           
         }else{
            res.status(200).json({
                success: true,
              });
         }
        
     });
    }
    catch(err){
        console.error(err.message);
        res.send("server error");
    }
}
);
module.exports = router;
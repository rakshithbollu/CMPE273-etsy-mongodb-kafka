import React, { Fragment,useEffect,useState} from "react";
import {Redirect} from "react-router-dom";
import "./Cart.css";
import CartItemCard from "./CartItemCard";
import { useSelector, useDispatch } from "react-redux";
import { addItemsToCart,removeItemsFromCart,getCartDetails,addGiftOption,addGiftDescription} from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import { addOrderDetails,getOrderDetails} from "../../actions/orderAction";
import { useAlert } from "react-alert";
import { loadUser } from "../../actions/userauthentication";

const Cart = ({history}) =>{
 const dispatch = useDispatch();
 const {isAuthenticated,user} =useSelector(
  (state) => state.auth
);
const alert = useAlert();
const [formData, setFormData] = useState({
  subtotal: '1',
  grosstotal: '1'
});
//const successlogin = '';
const {subtotal,grosstotal} = formData;
console.log(subtotal);
console.log(grosstotal);
const onChange = e => setFormData({ ...formData, [e.target.name] : e.target.value});
const email=user && user.length && user[0].email;
const [totalprice,setTotalPrice]=useState('');
const [description,setNewDescription] = useState('');
const { cartItems } = useSelector((state) => state.cart);

const handleChange = (productid,giftoption) => {
  if(giftoption === true){
    giftoption = false;
    dispatch(addGiftOption(productid, email, giftoption)).then(()=> dispatch(getCartDetails(email)));
  }
  else{
    giftoption = true
    dispatch(addGiftOption(productid, email, giftoption)).then(()=> dispatch(getCartDetails(email)));
    }
};
const handleDescription = (productid,giftdescription) =>
{
  dispatch(addGiftDescription(productid, email, giftdescription)).then(()=> dispatch(getCartDetails(email)));
}
useEffect(() => {
  if(cartItems)
  {
    setTotalPrice(cartItems.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    ))
  }
},[cartItems]);
useEffect(() => {
  if (email)
  {
  dispatch(getCartDetails(email));
  }
}, [dispatch,email]);
 const increaseQuantity = (productid, quantity, stock,price,shopname,productname,image_URL) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
      const email = user[0].email;
      dispatch(addItemsToCart(productid, newQty,email,price,shopname,productname,image_URL)).then(()=> dispatch(getCartDetails(email)));
      
  };

  const decreaseQuantity = (productid, quantity,price,shopname,productname,image_URL) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    const email = user && user.length && user[0].email;
    if (email)
    {
      dispatch(addItemsToCart(productid, newQty,email,price,shopname,productname,image_URL)).then(()=> dispatch(getCartDetails(email)));
     // dispatch(getCartDetails(email));
    }
  };

  const deleteCartItems = (productid) => {
    const email = user && user.length && user[0].email;
    if (email)
    {
    dispatch(removeItemsFromCart(productid,email)).then(()=> dispatch(getCartDetails(email)));
    }
  };

 
  const checkoutHandler = () => {
    console.log(user);
    if(user && user.length && user[0].address)
  {
    ;
    alert.success("order is placed successfully")
    dispatch(addOrderDetails(email,totalprice)).then(()=> dispatch(getOrderDetails(email))).then(() => history.push("/mypurchases"));
  }else{
    alert.error("Please fill the address in the profile page");
    history.push("/EditUser");
  }
  };
    return (
    <Fragment>
        <section class="section-pagetop bg">

<div class="container">
            <h2 class="title-page">Shopping cart</h2>
        </div> 
        </section>
        
        <section class="section-content padding-y">
        <div class="container">
        {cartItems && cartItems.length &&
        <div class="row">
            <main class="col-md-9">
        <div class="card">
        
        <table class="table table-borderless table-shopping-cart">
        <thead class="text-muted">
        <tr class="small text-uppercase">
        <th scope="col">Product</th>
        <th scope="col" width="120">Quantity</th>
        <th scope="col" width="120">Price</th>
        <th scope="col" class="text-right" width="200"> </th>
        </tr>
        </thead>
        {cartItems && 
            cartItems.map((item) => (
        <tbody>
        <tr>
            <td>
                <figure class="itemside">
                    <div class="aside"><img src={item.image_URL} height="100" widht ="100" class="img-sm" /></div>
                    <figcaption class="info">
                        <a href="#" class="title text-dark"><Link to ={`/product/${item.product._id}`}>{item.productname}</Link></a>
                        <p class="text-muted small">{item.shopname}</p>
                    </figcaption>             
   <input style={{"color": "black", "top":"20px","font-size":"13px",}} id="excludeoutofstock" type="checkbox" checked={item.giftoption} onChange={(e) => {handleChange(item.product._id,item.giftoption)}} />
   This order is a Gift
   {item.giftoption === true ?
   <><input
                          type="text"
                          placeholder="add a message to the gift"
                          required
                          name="message"
                          value={item.giftdescription}
                          onChange={(e) => setNewDescription(e.target.value)} /><button onClick={() => handleDescription(item.product._id, description)}>submit</button></>
                      : ''}
  
                </figure>
            </td>
            <td> 
                <button onClick={() =>
                    decreaseQuantity(item.product._id, item.quantity,item.price,item.shopname,item.productname,item.image_URL)
                  }>
                  -
            </button>
                <input type="number" value={item.quantity}readOnly />
                <button onClick={() =>
                    increaseQuantity(
                      item.product._id,
                      item.quantity,
                      item.product.stock,
                      item.price,
                      item.shopname,
                      item.productname,item.image_URL,
                     
                    )
                  }>
                  +
                </button>
            </td>
            <td> 
                <div class="price-wrap"> 
                    <var class="price"> {
                        item.product.currency
                      } {`${
                        item.price * item.quantity
                      }`}</var> 

                    <small class="text-muted"> {item.product.currency} {item.price} each </small> 
                </div> 
            </td>
            <td class="text-right"> 
            <a href="" class="btn btn-light" onClick={()=>deleteCartItems(item.product._id)}> Remove</a>
            </td>
        </tr>
        </tbody>))}
        </table>
        
        <div class="card-body border-top">
            <a href="#" class="btn btn-primary float-md-right" onClick={checkoutHandler}> Make Purchase <i class="fa fa-chevron-right"></i> </a>
            <a href="#" class="btn btn-light"> <Link to ="/products"><i class="fa fa-chevron-left"></i> Continue shopping</Link></a>
        </div>  
        </div> 
    </main>
    <aside class="col-md-3">
        <div class="card mb-3">
        </div>  
        <div class="card">
            <div class="card-body">
                    <dl class="dlist-align">
                    <dt>Total price:</dt>
                    <dd class="text-right">{totalprice}</dd>
                    </dl>
                    <hr />
                    
            </div> 
        </div>  
    </aside> 
</div>
}
</div> 
</section>
    </Fragment>
    );
}
export default Cart;
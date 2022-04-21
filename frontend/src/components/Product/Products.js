import { useSelector, useDispatch } from "react-redux";
import React,{ Fragment, useEffect,useState} from 'react';
import "./Products.css";
import { useParams} from "react-router-dom";
import {getProduct} from '../../actions/productAction';
import Product from '../Home/Product.js';
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import { getFavDetails } from "../../actions/favoriteAction";
import _ from 'underscore';
const Products = ({history}) => {
    const dispatch = useDispatch();
    //const price = 'price';
    const [price, setPrice] = useState([0,10000]);
    const [sortType, setSortType] = useState('price');
    const [outOfStock, setoutOfStock] = useState(0);
    const {user} = useSelector((state)=>state.auth)
    const email = user && user.length && user[0].email;
  const {favproducts} =useSelector((state)=>state.favdetails);
  const favid1 =_.pluck(favproducts,'productdetails');
  const favid =_.pluck(favid1,'_id');
  console.log(favid)
  const favkeyword ='undefined';
    //const [checked, setChecked] = React.useState(0);
    const handleChange = () => {
      if(outOfStock === 0){
      setoutOfStock(1);
      }
      else{
        setoutOfStock(0);
        }
    };
    const {
        products,
        loading,
        error,
        productsCount,
       // filteredProductsCount,
      } = useSelector((state) => state.products);
      let {keyword} = useParams();
      //const keyword = match.params.keyword;
      useEffect(() => {
        dispatch(getProduct(keyword,price,sortType,outOfStock));
        if (email) {
          dispatch(getFavDetails(favkeyword,email));
        }
      }, [dispatch,keyword,price,sortType,outOfStock,email]);
      const priceHandler = (event, newPrice,one) => {
        setPrice(newPrice);
      };
      //useEffect(() => {
        //const sortArray = type => {
         // const types = {
        //  price: 'price',
           // stock: 'stock',
          //};
          //const sortProperty = types[type];
          //const sorted = [...products].sort((a, b) => b[sortProperty] - a[sortProperty]);
          //setData(sorted);
        //};
    
       // sortArray(sortType);
      //}, [sortType]); 
console.log("products",products);
return(
    <Fragment>
<div className="container" id ="container">
{products && 
    products.map((product) => (
      <Product product={product} favid= {favid} history={history} />
    ))}
  </div>

  <div className="App"style={{color: 'black',"width": "127px"}} >
  <Typography style={{color: 'black',"width": "127px"}}></Typography>
      <select style={{color: 'black',"width": "127px"}} onChange={(e) => setSortType(e.target.value)}>
      <option value="null">setsortType</option>
        <option value="price">price</option>
        <option value="stock">stock</option>
        <option value="salescount">salescount</option>
      </select>
    </div>
   <div >
  <label style={{"color": "black", "top":"170px","left":"10px", "font-size":"13px",}} className="checkedbox" for="excludeoutofstock"> 
   <input style={{"color": "black", "top":"20px","font-size":"13px",}} id="excludeoutofstock" type="checkbox" checked={outOfStock} onChange={(e) => {handleChange()}} />
   include Out of stock
   </label>
   </div>
   <div className="filterBox" style={{"color": "black","top":"260px","left":"12px"}}>
            <Typography style={{"color": "black","top":"230px","left":"1px"}}>Set Price Range</Typography>
            <Slider
              style={{"color": "black","left":"1px"}}
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={10000}
            /> </div>

  </Fragment>);}

  export default Products;
import React, { Fragment,useEffect,useState} from "react";
import {Redirect} from "react-router-dom";
//import "./Cart.css";
import OrderDetails from "./OrderDetails";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails} from "../../actions/orderAction";
import { Typography } from "@material-ui/core";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import moment from 'moment';
import {ListGroup} from "react-bootstrap";
import { Spinner, Row, Col, Image } from 'react-bootstrap';
import Pagination from "react-js-pagination";
export const Mypurchases = ({history}) =>
{
    const {user} = useSelector((state)=> state.auth);
    const {orderItems,ordersCount} = useSelector((state) => state.getorder);
    const email = user && user.length && user[0].email;
    const dispatch = useDispatch();
    const [resultsperpage,setResultsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const alert = useAlert();
    useEffect(() => {
      if(email)
      {
        dispatch(getOrderDetails(email,resultsperpage,currentPage));
      }
      }, [dispatch,email,resultsperpage,currentPage]);
      const setCurrentPageNo = (e) => {
        setCurrentPage(e);
      };
      const setResultsPerPageNo = (e) => {
        setCurrentPage(1);
        setResultsPerPage(e.target.value);
      };

return (
    <Fragment>
       <section class="section-pagetop bg">

<div class="container">
            <h2 class="title-page">orders Details</h2>
        </div> 
        </section>
        <p style={{textAlign: 'right', fontWeight: 'bold'}}>No.of orders per page</p>
        <div style={{textAlign: 'right', fontWeight: 'bold'}}>
            <select
  value={resultsperpage}
  name='orderperpage'
  onChange={e => setResultsPerPageNo(e)}>
  <option value="null">Selectordersperpage</option>
  <option value="2">2</option>
  <option value="5">5</option>
  <option value="10">10</option>
</select>
</div>
<br></br>
        {
               orderItems && orderItems.length ? orderItems.map(item =>
                        <ListGroup key={item._id} className="order_item">
                          <ListGroup.Item className="order_item_heading"> <span className="order_id"><b>Order ID:</b> {item._id}</span><span className="total"><b>Total:</b> {item.totalprice}</span><b>Date:</b> {moment(item.orderdate).format('DD MMM YYYY')} </ListGroup.Item>
                          {item.orderdetails && item.orderdetails.length ? <ListGroup.Item>
                                <Row style={{textAlign: 'center', fontWeight: 'bold'}}>
                                    <Col xs={2} style={{color:'tomato'}}>
                                        Image
                                    </Col>
                                    <Col xs={2} style={{color:'tomato'}}>Name</Col>
                                    <Col xs={2} style={{color:'tomato'}}>Quantity</Col>
                                    <Col xs={2} style={{color:'tomato'}} >Total</Col>
                                    <Col xs={4} style={{color:'tomato'}}>Gift</Col>
                                    
                                </Row>
                            </ListGroup.Item> : ''
                          }
                          {item.orderdetails && item.orderdetails.map(orderdetail => 
                            <ListGroup.Item key={orderdetail.product}>
                                <Row style={{textAlign: 'center'}}>
                                    <Col xs={2}  style={{cursor: 'pointer'}}>
                                        <Image src={orderdetail.image_URL} style={{objectFit: 'cover', width: '50px', height: '50px', marginLeft: 'auto', marginRight: 'auto', display: 'block'}} />
                                    </Col>
                                    <Col xs={2}><Link style={{color:'black'}} to ={`/product/${orderdetail.product}`}>{orderdetail.productname}</Link></Col>
                  
                                    <Col xs={2}>{orderdetail.quantity}</Col>
                                    <Col xs={2}>{orderdetail.currency} {orderdetail.price * orderdetail.quantity}</Col>
                                    {orderdetail && orderdetail.giftoption === true ? 
                                    <Col xs={4} style={{color:'black'}}>Message : {orderdetail.giftdescription} </Col> :
                                    ''}
                                </Row>
                            </ListGroup.Item>
                            )
                          }
                        </ListGroup>
                    ) :
                    <p>No Purchases found</p>
            }
          
         {resultsperpage < ordersCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultsperpage}
                totalItemsCount={ordersCount}
                onChange={setCurrentPageNo} 
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        
        <div class="card-body border-top">
            <a href="#" class="btn btn-light"> <Link to ="/products"><i class="fa fa-chevron-left"></i>view shopping products </Link></a>
        </div> 
    </Fragment>
    );
}

export default Mypurchases;
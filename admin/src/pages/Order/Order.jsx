import "./Order.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext.jsx";
import { assets } from "../../assets/assets.js";

const Order = () => {
  const { allOrders,statusHandler } = useContext(StoreContext);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {allOrders
          .filter(
            (order) => Array.isArray(order.items) && order.items.length > 0,
          )
          .map((order, index) => (
            <div className="order-item" key={index}>
              <img src={assets.parcel_icon} alt="" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return item.name + " X " + item.quantity;
                    } else {
                      return item.name + " X " + item.quantity + ",";
                    }
                  })}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      " " +
                      order.address.state +
                      " " +
                      order.address.country +
                      " " +
                      order.address.zipcode +
                      " ,"}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items : {order.items.length}</p>
              <p>Total amount : {order.amount}</p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                <option value="Food Processing">Food Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery"> Out for delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Order;

import "./MyOrders.css";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { fetchOrders, orderData } = useContext(StoreContext);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orderData.map((order, index) => {
          return (
            <div className="my-orders-order" key={index}>
              <div>
                <img src={assets.parcel_icon} alt="" />
                <p> Order Id : {order._id}</p>
              </div>

              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + " X " + item.quantity;
                  } else {
                    return item.name + " X " + item.quantity + " ,";
                  }
                })}
              </p>
              <p>Rs {order.amount}.00</p>
              <p>Items : {order.items.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b>{order.status}</b>
              </p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;

import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { food_list } from "../assets/assets";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);
  const [orderData, setOrderData] = useState([]);


  const fetchFoodList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    setFoodList(response.data.data);
  };


  const loadCartData = async (token) => {
    const response = await axios.post(`${url}/api/cart/get`, {}, { headers: { token } });
    setCartItems(response.data.cartData);
  };



  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if(token){
      await axios.post(`${url}/api/cart/add`,{ itemId },
        {
          headers: {token},
        }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if(token){
      await axios.post(`${url}/api/cart/remove`,{ itemId },
        {
          headers: {token},
        }
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (!itemInfo) {
          continue;
        }
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };


const fetchOrders = async () => {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } },
    );
    setOrderData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);


  useEffect(() => {
    async function fetchData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    fetchData();
  }, []);

  const contextValue = {
    food_list,
    addToCart,
    removeFromCart,
    cartItems,
    setCartItems,
    getTotalCartAmount,
    url,
    token,
    setToken,
    fetchOrders,
    orderData, 
    setOrderData
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;

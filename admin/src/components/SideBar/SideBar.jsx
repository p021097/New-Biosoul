import React, { useContext } from "react";
import "./SideBar.css";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const SideBar = () => {
  const { isSuperAdmin } = useContext(StoreContext);
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/order" className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        {isSuperAdmin && (
          <NavLink to="/authorize" className="sidebar-option">
            <img src={assets.order_icon} alt="" />
            <p>Authorize</p>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default SideBar;

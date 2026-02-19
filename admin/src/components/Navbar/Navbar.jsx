import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = () => {
  const { adminLogout, adminToken, adminProfile } = useContext(StoreContext);
  return (
    <div className="navbar">
      <img className="logo" src={assets.bsfb_logo} alt="" />
      {/* <img className="profile" src={assets.profile_image} alt="" /> */}
      {!adminToken ? (
        <></>
      ) : (
        <div className="navbar-profile">
          <img src={assets.profile_image} alt="" />
          <ul className="nav-profile-dropdown">
            {/* <li>
              <img src={assets.bag_icon} alt="" />
              <p>My Orders</p>
            </li> */}
            {/* <hr /> */}
            <li onClick={adminLogout}>
              <img src={assets.logout_icon} alt="" />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;

import { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";

const LoginPopup = ({ setShowLogin, role = "user" }) => {
  const { url, setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const isCompany = role === "company";

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Login/Register function
  const onLogin = async (e) => {
    e.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += isCompany ? "/api/user/login-admin" : "/api/user/login";

      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        if (isCompany) {
          const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
          window.location.href = adminUrl;
          return;
        }
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin({ open: false, role: "user" });
        toast.success("Login Successful");
      } else {
        toast.error(response.data.message, "Error");
      }
    } else {
      newUrl += "/api/user/register";
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin({ open: false, role: "user" });
        toast.success("Register Successful");
      } else {
        toast.error(response.data.message, "Error");
      }
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} action="" className="login-popup-container">
        <div className="login-popup-title">
          <h2>{isCompany ? "Company Login" : currState}</h2>
          <img
            onClick={() => setShowLogin({ open: false, role: "user" })}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" || isCompany ? (
            <></>
          ) : (
            <input
              type="text"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Your name"
              required
            />
          )}
          <input
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            placeholder="Your email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {isCompany ? (
          <p className="login-popup-note">
            To register, please contact the administrator.
          </p>
        ) : currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;

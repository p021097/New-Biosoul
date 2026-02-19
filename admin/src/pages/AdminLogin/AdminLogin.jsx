import React, { useContext, useState } from "react";
import "./AdminLogin.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets.js";

const initialForm = { name: "", email: "", password: "" };

const AdminLogin = () => {
  const { adminLogin, createAdminRequest, frontendURL } =
    useContext(StoreContext);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (mode === "login") {
      await adminLogin({ email: form.email, password: form.password });
    } else {
      const created = await createAdminRequest(form);
      if (created) {
        setForm(initialForm);
        setMode("login");
      }
    }
  };

  return (
    <div className="admin-login-page">
      <div>
        <img src={assets.bsfb_logo} alt="" />
      </div>
      <div>
        <form action="" onSubmit={onSubmit} className="admin-login-card">
          <h2>Admin Panel</h2>
          <p>
            {mode === "login"
              ? "Login to continue"
              : "Create new admin request"}
          </p>
          {mode === "request" && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Name"
              required
            />
          )}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            required
          />
          <button type="submit">
            {mode === "login" ? "Login" : "Submit Request"}
          </button>
          {mode === "login" ? (
            <>
              <p>
                Need admin access?{" "}
                <span onClick={() => setMode("request")}>Create New Admin</span>
              </p>
              <p>
                Go to shopping dashboard{" "}
                <span onClick={() => (window.location.href = frontendURL)}>
                  Click here
                </span>
              </p>
            </>
          ) : (
            <>
              <p>
                Already approved?{" "}
                <span onClick={() => setMode("login")}>Back to Login</span>
              </p>
              <p>
                Go to shopping dashboard{" "}
                <span onClick={() => (window.location.href = frontendURL)}>
                  Click here
                </span>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

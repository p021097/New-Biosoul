import React, { useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import SideBar from "./components/SideBar/SideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Order from "./pages/Order/Order";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authorize from "./pages/Authorize/Authorize";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import { StoreContext } from "./Context/StoreContext";

const App = () => {
  const { adminToken, isSuperAdmin } = useContext(StoreContext);
  
  return (
    <div>
      <ToastContainer />
      {!adminToken ? (
        <AdminLogin />
      ) : (
        <>
          <Navbar />
          <hr />
          <div className="app-content">
            <SideBar />
            <Routes>
              <Route path="/add" element={<Add />} />
              <Route path="/list" element={<List />} />
              <Route path="/order" element={<Order />} />
              <Route path="/authorize" element={isSuperAdmin ? <Authorize /> : <Navigate to="/add" replace/>} />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;

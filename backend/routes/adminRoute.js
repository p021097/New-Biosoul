import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  adminLogin,
  approveAdminRequest,
  listAdminRequests,
  listAdmins,
  rejectAdminRequests,
  requestAdminSignUp,
  restoreAdminAccess,
  revokeAdminAccess,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/admin-signup", requestAdminSignUp);
adminRouter.post("/login", adminLogin);
adminRouter.get("/requests", adminAuth, listAdminRequests);
adminRouter.get("/list", adminAuth, listAdmins);
adminRouter.post("/requests/approve", adminAuth, approveAdminRequest);
adminRouter.post("/requests/reject", adminAuth, rejectAdminRequests);
adminRouter.post("/revoke", adminAuth, revokeAdminAccess);
adminRouter.post('/restore', adminAuth, restoreAdminAccess)

export default adminRouter;

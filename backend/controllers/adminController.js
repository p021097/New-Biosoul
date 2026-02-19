import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import adminModel from "../models/adminModel.js";
import adminRequestModel from "../models/adminRequestModel.js";

// Create Admin Token
const createAdminToken = (id) =>
  jwt.sign(
    {
      id,
      type: "admin",
    },
    process.env.JWT_SECRET,
  );

// Request Admin Signup
const requestAdminSignUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ status: false, message: "All fields required" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ status: false, message: "Invalid email" });
    }
    if (!validator.isLength(password, { min: 8 })) {
      return res.json({
        status: false,
        message: "Password must be at least 8 characters",
      });
    }
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.json({ status: false, message: "Admin already exists" });
    }
    const existingPending = await adminRequestModel.findOne({
      email,
      status: "pending",
    });
    if (existingPending) {
      return res.json({
        status: false,
        message: "Admin approval request is already pending",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await adminRequestModel.create({
      name,
      email,
      password: hashedPassword,
      status: "pending",
    });
    return res.json({
      status: true,
      message: "Admin account created, please wait for admin approval",
    });
  } catch (error) {
    return res.json({ status: false, message: "Error submitting request" });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    // const email = req.body.email?.trim().toLowerCase();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        status: false,
        message: "Email and password are required",
      });
    }

    const admin = await adminModel.findOne({ email });

    if (!admin) {
      const pendingOrLatestRequest = await adminRequestModel
        .findOne({ email })
        .sort({ createdAt: -1 });

      if (pendingOrLatestRequest?.status === "pending") {
        return res.json({
          status: false,
          message: "Admin approval is pending. Please contact administrator.",
        });
      }

      if (pendingOrLatestRequest?.status === "rejected") {
        return res.json({
          status: false,
          message: "Admin request was rejected. Please contact administrator.",
        });
      }

      return res.json({ status: false, message: "Admin not found" });
    }

    // approved admin flow
    if (!admin.isActive) {
      return res.json({
        status: false,
        message:
          "Your access has been restricted. Please contact administrator",
      });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.json({ status: false, message: "Invalid credentials" });
    }

    const token = createAdminToken(admin._id);
    return res.json({
      status: true,
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        isSuperAdmin: admin.isSuperAdmin,
      },
    });
  } catch (error) {
    return res.json({ status: false, message: "Error in admin login" });
  }
};

// Lists admin requests
const listAdminRequests = async (req, res) => {
  try {
    const requests = await adminRequestModel.find({}).sort({ createdAt: -1 });
    return res.json({
      status: true,
      data: requests,
      message: "Admin requests fetched successfully",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Error fetching admin requests",
    });
  }
};

// Lists Admins
const listAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({}, { password: 0 }).sort({
      createdAt: -1,
    });
    return res.json({
      success: true,
      data: admins,
      message: "Fetched all the admins",
    });
  } catch (error) {
    return res.json({ success: false, message: "Error fetching admins" });
  }
};

// Approve admin
const approveAdminRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await adminRequestModel.findById(requestId);

    if (!requestId || request.status !== "pending") {
      return res.json({ success: false, message: "Pending request not found" });
    }

    const existingAdmin = await adminModel.findOne({ email: request.email });
    if (existingAdmin) {
      return res.json({
        success: false,
        message: "Admin already exist for this email",
      });
    }

    await adminModel.create({
      name: request.name,
      email: request.email,
      password: request.password,
      isActive: true,
      isSuperAdmin: false,
    });

    request.status = "approved";
    request.reviewedBy = req.adminId;
    request.reviewedAt = new Date();
    await request.save();

    return res.json({ success: true, message: "Admin approved successfully" });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error approving admin request",
    });
  }
};

// Reject admin approval
const rejectAdminRequests = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await adminRequestModel.findById(requestId);

    if (!request || request.status !== "pending") {
      return res.json({ success: false, message: "Pending request not found" });
    }

    request.status = "rejected";
    request.reviewedBy = req.adminId;
    request.reviewedAt = new Date();
    await request.save();
    return res.json({ success: true, message: "Admin request rejected" });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in Admin request reject",
    });
  }
};

// Revoke admin access
const revokeAdminAccess = async (req, res) => {
  try {
    const { adminId } = req.body;
    const requestor = await adminModel.findById(req.adminId);

    if (!requestor?.isSuperAdmin) {
      return res.json({
        success: false,
        message: "only super admin can revoke the access",
      });
    }

    const target = await adminModel.findById(adminId);
    if (!target) {
      return res.json({ success: false, message: "Admin not found" });
    }

    if (target.isSuperAdmin) {
      return res.json({
        success: false,
        message: "Super admin can not be revoked",
      });
    }

    target.isActive = false;
    await target.save();
    return res.json({ success: true, message: "Admin access revoked" });
  } catch (error) {
    return res.json({ success: false, message: "Error revoking admin access" });
  }
};

// restore the revoked admin access
const restoreAdminAccess = async (req, res) => {
  try {
    const { adminId } = req.body;
    const requestor = await adminModel.findById(req.adminId);

    if (!requestor?.isSuperAdmin) {
      return res.json({
        success: false,
        message: "Only super admin can restore access",
      });
    }
    const target = await adminModel.findById(adminId);
    if (!target) {
      return res.json({
        success: false,
        message: "Admin not found",
      });
    }
    if (target.isSuperAdmin) {
      return res.json({
        success: false,
        message: "Super Admin is always active",
      });
    }
    target.isActive = true;
    await target.save();
    return res.json({ success: true, message: "Admin access restored" });
  } catch (error) {
    return res.json({
      success: false,
      message: "Error in restoring admin access",
    });
  }
};

export {
  requestAdminSignUp,
  adminLogin,
  listAdmins,
  listAdminRequests,
  approveAdminRequest,
  rejectAdminRequests,
  revokeAdminAccess,
  restoreAdminAccess,
};

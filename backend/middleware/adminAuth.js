import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
  const token =
    req.body?.token ||
    req.headers.authorization?.replace("Bearer ", "") ||
    req.headers.token;
  if (!token) {
    return res.json({ status: false, message: "Admin token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== "admin") {
      return res.json({ status: false, message: "Admin access required" });
    }
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res.json({ status: false, message: "Invalid token" });
  }
};

export default adminAuth;

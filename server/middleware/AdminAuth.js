const User = require("../model/user.model");

// Middleware to check if user is an Admin or Main
const isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(req.user.id);
  if (!user || (user.role !== "admin" && user.role !== "main")) {
    return res.status(403).json({ error: "Forbidden: Access denied" });
  }

  next();
};
const isMain = (req, res, next) => {
  if (!req.user || req.user.role !== "main") {
    return res.status(403).json({ error: "Forbidden: Only main users can perform this action" });
  }
  next();
};

module.exports = { isAdmin, isMain };

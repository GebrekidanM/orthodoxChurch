const User = require("../model/user.model");

const isAdmin = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  const user = await User.findById(req.user.id);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};

module.exports = { isAdmin };

const mongoose = require("mongoose");

const validateId = (req, res, next) => {
  const invalidIds = [];

  // Loop through all request parameters and validate those ending with 'Id'
  for (const key in req.params) {
    if (key.toLowerCase().endsWith("id")) {
      const value = req.params[key];
      if (!mongoose.Types.ObjectId.isValid(value)) {
        invalidIds.push({ field: key, value });
      }
    }
  }

  if (invalidIds.length > 0) {
    return res.status(400).json({
      error: "Invalid ID(s) provided.",
      invalidIds,
    });
  }

  next();
};

module.exports = validateId;

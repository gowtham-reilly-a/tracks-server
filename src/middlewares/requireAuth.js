const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ status: "fail", message: "Please log in" });

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (err)
      return res.status(401).json({ status: "fail", message: "Please log in" });

    const user = await User.findById(payload.userId);

    req.user = user;

    next();
  });
};

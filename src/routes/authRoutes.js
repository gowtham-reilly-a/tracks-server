const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const router = express.Router();

router
  .post("/signup", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = new User({ email, password });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      res.status(200).json({
        status: "success",
        data: { token, email, password },
      });
    } catch (err) {
      let message;

      switch (err.code) {
        case 11000:
          message =
            "Already an account exist with this email. Email should be unique.";
          break;
        default:
          message = "Something went wrong";
      }
      res.status(400).json({
        status: "fail",
        message,
      });
    }
  })
  .post("/signin", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(401).json({
          status: "fail",
          message: "Please provide email and password",
        });

      const user = await User.findOne({ email });

      if (!user)
        return res.status(401).json({
          status: "fail",
          message: "Incorrect email or password",
        });

      await user.comparePassword(password);

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

      res.status(200).json({
        status: "success",
        data: {
          token,
          email,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }
  });

module.exports = router;

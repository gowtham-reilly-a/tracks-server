const express = require("express");
const mongoose = require("mongoose");
const requireAuth = require("../middlewares/requireAuth");
const Track = mongoose.model("Track");

const router = express.Router();

router.use(requireAuth);

router
  .route("/tracks")
  .get(async (req, res) => {
    try {
      const tracks = await Track.find({ userId: req.user._id });
      res.status(200).json({
        status: "success",
        data: tracks,
      });
    } catch (err) {
      res.status(422).json({
        status: "fail",
        message: err.message,
      });
    }
  })
  .post(async (req, res) => {
    try {
      const { name, locations } = req.body;

      if (!name || !locations)
        return res.status(422).json({
          status: "fail",
          message: "Missing fields: name or locations",
        });

      const track = new Track({ name, locations, userId: req.user._id });

      await track.save();

      res.status(200).json({
        status: "success",
        data: track,
      });
    } catch (err) {
      res.status(422).json({
        status: "fail",
        message: err.message,
      });
    }
  });

module.exports = router;

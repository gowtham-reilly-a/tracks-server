require("./models/user");
require("./models/track");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const trackRoutes = require("./routes/trackRoutes");
const requireAuth = require("./middlewares/requireAuth");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

app.use(authRoutes);
app.use(trackRoutes);

const mongoDbUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoDbUri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => console.log("Handled mongodb connection promise"));

mongoose.connection.on("connected", () =>
  console.log("Connected to database successfully!")
);
mongoose.connection.on("error", (err) =>
  console.error("Error connecting to database", err)
);

app.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    status: "success",
    data: { email: req.user.email },
  });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});

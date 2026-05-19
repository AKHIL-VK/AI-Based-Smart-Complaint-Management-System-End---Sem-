require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err.message);
    console.log("👉 Tip: Make sure your current IP address is whitelisted in MongoDB Atlas!");
  });

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
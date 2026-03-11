const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8090;

// root endpoint
app.get("/", (req, res) => {
  res.send("Node DevOps App is running");
});

// health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

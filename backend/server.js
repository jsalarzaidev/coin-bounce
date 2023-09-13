const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");

const app = express();

dbConnect();

app.get("/", (req, res) =>
  res.json({ msg: "Hello World! and this is backend" }),
); // browser connect

app.listen(PORT, console.log(`backend is running on port: ${PORT}`));

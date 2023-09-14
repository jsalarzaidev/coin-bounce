const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");

const app = express();

app.use(router);

dbConnect();

// define all endpoints
app.listen(PORT, console.log(`backend is running on port: ${PORT}`));

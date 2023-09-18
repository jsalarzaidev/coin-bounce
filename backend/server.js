const express = require("express");
const dbConnect = require("./database/index");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

//middleware
app.use(express.json());

app.use(router);

dbConnect();

app.use(errorHandler);

// define all endpoints
app.listen(PORT, console.log(`backend is running on port: ${PORT}`));

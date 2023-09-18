const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// create endpoint for testing
/*
router.get("/test", (req, res) =>
  res.json({ msg: "working Imo fino and fine fine!!" }),
); // browser connect
*/

// user
// ---

// register
router.post("/register", authController.register);

// login
router.post("/login", authController.login);
// logout
// refresh
// -----
// blog
// -----
// CRUD
// create
// read all blogs
// read blog by id
// update
// delete
// ------
// comment
// ------
// create comment
// read comments by id

module.exports = router;

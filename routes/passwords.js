const express = require("express");
const Password = require("../models/Password");
const router = express.Router();

// Middleware to check if user is authenticated
router.use((req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/");
  }
  next();
});

// Render the home page (password manager)
router.get("/", async (req, res) => {
  const passwords = await Password.find({ userId: req.session.userId });
  res.render("home", { passwords });
});

// Add a new password
router.post("/add", async (req, res) => {
  const { website, username, password } = req.body;
  const newPassword = new Password({
    userId: req.session.userId,
    website,
    username,
    password,
  });
  await newPassword.save();
  res.redirect("/passwords");
});

// Delete a password
router.post("/delete/:id", async (req, res) => {
  await Password.findByIdAndDelete(req.params.id);
  res.redirect("/passwords");
});

module.exports = router;

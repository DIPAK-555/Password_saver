const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Render the login page
router.get("/", (req, res) => {
  res.render("login", { error: null });
});

// Handle login form submission
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && user.password === password) {
    req.session.userId = user._id; // Set session
    res.redirect("/passwords");
  } else {
    res.render("login", { error: "Invalid credentials" });
  }
});

// Render the registration page
router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

// Handle registration form submission
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User({ username, password });
    await user.save();
    req.session.userId = user._id; // Set session
    res.redirect("/passwords");
  } catch (err) {
    res.render("register", { error: "Username already exists" });
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
});

module.exports = router;

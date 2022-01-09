const express = require("express");

const router = express.Router();

const { auth} = require("../middlewares/auth");

// Controller
const {
  register,
  login,
  resetPassword,
  sendResetPassword,
  confirmAccount
} = require("../controllers/auth");
const { updateProfile, getProfile, getAllUsers, deleteUser } = require("../controllers/user");
// Get addUser controller user here ...

// Route
router.post("/login", login);
router.post("/register", register);
router.get("/user", auth, getProfile)
router.patch("/user/:id", auth, updateProfile);
router.delete("/user/:id", auth, deleteUser);
router.get("/users", auth, getAllUsers);
router.post("/confirm/:id/:token", confirmAccount)
router.post("/reset-password", sendResetPassword);
router.patch("/reset-password/:id/:token", resetPassword);
module.exports = router;

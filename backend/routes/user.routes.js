const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  getUser,
} = require("../controllers/user.controller");
const { userAuthenticate } = require("../middlewares/auth");

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", signOut);

router.get("/", userAuthenticate, getUser);

router.get("/auth", userAuthenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authenticated",
    user: req.user,
  });
});

module.exports = router;

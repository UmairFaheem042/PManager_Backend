const express = require("express");
const router = express.Router();

const { upload } = require("../middlewares/multer");

const {
  createDomain,
  getAllDomain,
  getSingleDomain,
  deleteDomain,
  updateDomain,
  searchDomain,
} = require("../controllers/domain.controller");
const { userAuthenticate } = require("../middlewares/auth");

// router.use(userAuthenticate);

router.get("/", userAuthenticate, getAllDomain);

// router.post("/create", userAuthenticate, createDomain);
router.post(
  "/create",
  userAuthenticate,
  upload.fields([{ name: "image", maxCount: 1 }]),
  createDomain
);
router.get("/search", userAuthenticate, searchDomain);

router.get("/:domainId", userAuthenticate, getSingleDomain);
router.delete("/delete/:domainId", userAuthenticate, deleteDomain);
router.put("/update/:domainId", userAuthenticate, updateDomain);

router.post("/search", userAuthenticate, searchDomain);

module.exports = router;

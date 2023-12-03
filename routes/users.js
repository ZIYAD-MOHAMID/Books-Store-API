const express = require("express");
const router = express.Router();
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifytoken");
const {
  updateUser,
  getAllUsers,
  getUser,
  deleteUser,
} = require("../controller/userController");

router.route("/").get(verifyTokenAndAdmin, getAllUsers);
router
  .route("/:id")
  .put(verifyTokenAndAuthorization, updateUser)
  .get(verifyTokenAndAuthorization, getUser)
  .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;

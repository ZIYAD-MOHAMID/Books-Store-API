const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifytoken");
const {
  getAllAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteauthor,
} = require("../controller/authorController");

router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createAuthor);
router
  .route("/:id")
  .get(getAuthor)
  .put(verifyTokenAndAdmin, updateAuthor)
  .delete(verifyTokenAndAdmin, deleteauthor);

module.exports = router;

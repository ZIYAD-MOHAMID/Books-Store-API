const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifytoken");
const {
  getBook,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controller/bookController");

router.route("/").get(getAllBooks).post(verifyTokenAndAdmin, createBook);
router
  .route("/:id")
  .get(getBook)
  .put(verifyTokenAndAdmin, updateBook)
  .delete(verifyTokenAndAdmin, deleteBook);

module.exports = router;

const asyncHandler = require("express-async-handler");
const { Book, validatePostBook, validatePutBook } = require("../models/Book");

/**
 * @desc       Get all books
 * @route      /api/books
 * @method     GET
 * @access     public
 */
const getAllBooks = asyncHandler(async (req, res) => {
  //// Comparioson Query Operators
  // find({ price: 10 })
  // find({ price: { $eq: 10 } }) === equal
  // find({ price: { $ne: 10 } }) === not equal
  // find({ price: { $lt: 10 } }) === less than
  // find({ price: { $lte: 10 } }) === less than and equal
  // find({ price: { $gt: 10 } }) === greter than and equal
  // find({ price: { $gte: 10 } }) === greter than and equal
  // find({ price: { $in: [8, 9] } }) === all item have 8 or 9
  // find({ price: { $nin: [8, 9] } }) ===  not in

  const { minPrice, maxPrice } = req.query;
  let Books;
  minPrice & maxPrice
    ? (Books = await Book.find({
        price: { $gte: minPrice, $lte: maxPrice },
      }).populate("author", ["_id", "firstName", "lastName"]))
    : (Books = await Book.find().populate("author", [
        "_id",
        "firstName",
        "lastName",
      ]));

  res.status(200).json(Books);
});

/**
 * @desc       Get book
 * @route      /api/books/:id
 * @method     GET
 * @access     public
 */
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate("author");
  book
    ? res.status(200).json(book)
    : res.status(404).json({ message: "Book not found" });
});

/**
 * @desc       Create book
 * @route      /api/books
 * @method     post
 * @access     private (only admin)
 */
const createBook = asyncHandler(async (req, res) => {
  const { error } = validatePostBook(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
    cover: req.body.cover,
  });
  const result = await book.save();
  res.status(201).json(result);
});

/**
 * @desc       Update book
 * @route      /api/books/:id
 * @method     PUT
 * @access     private (only admin)
 */
const updateBook = asyncHandler(async (req, res) => {
  const { error } = validatePutBook(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        price: req.body.price,
        cover: req.body.cover,
      },
    },
    { new: true }
  );
  res.status(201).json(book);
});

/**
 * @desc       Delete book
 * @route      /api/books/:id
 * @method     DELETE
 * @access     private (only admin)
 */
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    await Book.findByIdAndDelete(book);
    return res.status(200).json({ message: "author has been DELETED" });
  }
  return res.status(400).json({ message: "author not found" });
});

module.exports = {
  getBook,
  getAllBooks,
  createBook,
  updateBook,
  deleteBook,
};

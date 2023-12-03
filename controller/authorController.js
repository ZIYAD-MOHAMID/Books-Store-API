const asyncHandler = require("express-async-handler");
const {
  Author,
  validatePostAuthor,
  validatePutAuthor,
} = require("../models/Author");

/**
 * @desc       Get all authors
 * @route      /api/authors
 * @method     GET
 * @access     public
 */
// router.get("/", async (req, res) => {
//   //   const authorList = await Author.find().sort({ firstName: (1/-1) });
//   //   const authorList = await Author.find()
//   //     .sort({ firstName: 1 })
//   //     .select("firstName lastName -_id");
//   try {
//     const authorList = await Author.find();
//     res.status(200).json(authorList);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Samthing is wrong" });
//   }
// });
const getAllAuthors = asyncHandler(async (req, res) => {
  const { pageNumber } = req.query;
  const authorsPerPage = 2;

  const authorList = await Author.find()
    .skip((pageNumber - 1) * authorsPerPage)
    .limit(authorsPerPage);
  res.status(200).json(authorList);
});

/**
 * @desc       Get author
 * @route      /api/authors/:id
 * @method     GET
 * @access     public
 */
const getAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  author
    ? res.status(200).json(author)
    : res.status(404).json({ message: "Author not found" });
});

/**
 * @desc       Create author
 * @route      /api/authors
 * @method     post
 * @access     private (only admin)
 */
const createAuthor = asyncHandler(async (req, res) => {
  const { error } = validatePostAuthor(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    image: req.body.image,
  });
  const result = await author.save();
  res.status(201).json(result);
});

/**
 * @desc       Update author
 * @route      /api/authors/:id
 * @method     PUT
 * @access     private (only admin)
 */
const updateAuthor = asyncHandler(async (req, res) => {
  const { error } = validatePutAuthor(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  const author = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },
    { new: true }
  );
  res.status(201).json(author);

  //const author = authors.find((author) => author.id === parseInt(req.params.id));
  //   if (author) {
  //     authors[req.params.id - 1] = { ...authors[req.params.id - 1], ...req.body };
  //     return res.status(200).json({ message: "author has been update" });
  //   }
  //   return res.status(400).json({ message: "author not found" });
});

/**
 * @desc       Delete author
 * @route      /api/authors/:id
 * @method     DELETE
 * @access     private (only admin)
 */
const deleteauthor = asyncHandler(async (req, res) => {
  //   const author = authors.find(
  //     (author) => author.id === parseInt(req.params.id)
  //   );
  //   authors = authors.filter((author) => author.id !== parseInt(req.params.id));
  const author = await Author.findById(req.params.id);
  if (author) {
    await Author.findByIdAndDelete(author);
    return res.status(200).json({ message: "author has been DELETED" });
  }
  return res.status(400).json({ message: "author not found" });
});

module.exports = {
  getAllAuthors,
  getAuthor,
  createAuthor,
  updateAuthor,
  deleteauthor,
};

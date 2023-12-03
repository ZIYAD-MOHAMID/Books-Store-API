const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const {
  User,
  validateRegisterUser,
  validateLoginUser,
} = require("../models/User");

/**
 * @desc       Register New User
 * @route      /api/auth/register
 * @method     POST
 * @access     public
 */
const regester = asyncHandler(async (req, res) => {
  const { error } = validateRegisterUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ message: "User is alredy Registered" });
  }

  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);
  user = new User({
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
  });

  const result = await user.save();
  const token = user.generateToken();
  const { password, ...other } = result._doc;
  res.status(201).json({ ...other, token });
});

/**
 * @desc       Login User
 * @route      /api/auth/login
 * @method     POST
 * @access     public
 */
const login = asyncHandler(async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  if (!user || !passwordMatch) {
    return res.status(400).json({ message: "invalid Email Or Password" });
  }

  // const token = jwt.sign(
  //   { id: user._id, username: user.username },
  //   process.env.JWT_SECRET_KEY,
  //   {
  //     expiresIn: "1d",
  //   }
  // );
  const token = user.generateToken();
  const { password, ...other } = user._doc;
  res.status(200).json({ ...other, token });
});

module.exports = { regester, login };

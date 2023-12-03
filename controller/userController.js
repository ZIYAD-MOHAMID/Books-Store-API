const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * @desc       Update User
 * @route      /api/users/:id
 * @method     PUT
 * @access     private (only admin & user himselft)
 */
const updateUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  let updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
    },
    { new: true }
  ).select("-password");
  res.status(200).json(updateUser);
});

/**
 * @desc       Get All Users
 * @route      /api/users
 * @method     GET
 * @access     private (only admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

/**
 * @desc       Get User
 * @route      /api/users/:id
 * @method     GET
 * @access     private (only admin & user himselft)
 */
const getUser = asyncHandler(async (req, res) => {
  const users = await User.findById(req.params.id).select("-password");
  res.status(200).json(users);
});

/**
 * @desc       delete User
 * @route      /api/users/:id
 * @method     DELETE
 * @access     private (only admin & user himselft)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findOneAndDelete(req.params.id);
    res.status(200).json({ message: "user has been deleted successfully" });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

module.exports = { updateUser, getAllUsers, getUser, deleteUser };

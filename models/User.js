const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 150,
      unique: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Generate Token
UserSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, isAdmin: this.isAdmin },
    process.env.JWT_SECRET_KEY
  );
};

// validation
const validateRegisterUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(150).required().email(),
    username: Joi.string().trim().min(5).max(150).required(),
    password: Joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
};
const validateLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(150).required().email(),
    password: Joi.string().trim().min(5).required(),
  });
  return schema.validate(obj);
};
const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().min(5).max(150).email(),
    username: Joi.string().trim().min(5).max(150),
    password: Joi.string().trim().min(5),
  });
  return schema.validate(obj);
};
const validateChangePassword = (obj) => {
  const schema = Joi.object({
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};

const User = mongoose.model("User", UserSchema);
module.exports = {
  User,
  validateUpdateUser,
  validateRegisterUser,
  validateLoginUser,
  validateChangePassword,
};

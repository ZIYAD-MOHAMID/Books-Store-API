const mongoose = require("mongoose");
const Joi = require("joi");

const AuthorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    image: {
      type: String,
      default: "defult-avatar.png",
    },
  },
  {
    timestamps: true,
  }
);

const validatePostAuthor = (obj) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(10).required(),
    lastName: Joi.string().trim().min(3).max(10).required(),
    nationality: Joi.string().trim().min(3).max(20).required(),
    image: Joi.string().min(5),
  });
  return schema.validate(obj);
};
const validatePutAuthor = (obj) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).max(10),
    lastName: Joi.string().trim().min(3).max(10),
    nationality: Joi.string().trim().min(3).max(20),
    image: Joi.string().min(5),
  });
  return schema.validate(obj);
};

const Author = mongoose.model("Author", AuthorSchema);
module.exports = { Author, validatePutAuthor, validatePostAuthor };

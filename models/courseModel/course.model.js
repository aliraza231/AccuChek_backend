const mongoose = require('mongoose');
const Joi = require('joi');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  discription: {
    type: String,
    required: true,
    minlength: 10,
  },
  points: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }, 
  image: {
    type: String,
    
  },
});

// Joi schema for validation
const courseJoiSchema = Joi.object({
  name: Joi.string().min(3).required(),
  id: Joi.number().required(),
  discription: Joi.string().min(10).required(),
  points: Joi.number().required(),
  status: Joi.boolean().required(),
  duration: Joi.string().required(),
  url: Joi.string().required(),
  image: Joi.string(),
});

// const Course = mongoose.model('cources', courseSchema);
const Course = mongoose.model('cources', courseSchema);
module.exports = {
  Course,
  courseJoiSchema, // Export the Joi schema for reuse
};

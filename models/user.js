/**
 * User model.
 *
 * @author Melina Cirverius
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * Creates a schema for a new user.
 */
const newUserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [10, 'Your password needs to be at least 10 characters long.']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Creates a model for a user with the schema
const User = mongoose.model('User', newUserSchema)

// Exports model
module.exports = User
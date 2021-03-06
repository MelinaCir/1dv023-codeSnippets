/**
 * User Router.
 *
 * @author Melina Cirverius
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/userController')

// Routes paths to controller actions.
router
  .get('/register', controller.register)
  .post('/create', controller.create)
  .get('/login', controller.login)
  .post('/login', controller.loginPost)
  .get('/logout', controller.logout)

// Exports module.
module.exports = router

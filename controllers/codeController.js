/**
 * Code controller.
 *
 * @author Melina Cirverius
 * @version 1.0.0
 */

'use strict'

const Code = require('../models/CodeSnippet')

const codeController = {}

/**
 * Renders the index page that displays all code snippets in db.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express middleware function.
 */
codeController.index = async (req, res, next) => {
  try {
    const codeData = {
      codes: (await Code.find({}))
        .map(snippet => ({
          id: snippet._id,
          code: snippet.code,
          user: snippet.user
        }))
    }

    res.render('code/index', { codeData })
  } catch (error) {
    next(error)
  }
}

/**
 * Renders the page for new code snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.new = (req, res) => {
  if (req.session.loggedIn) {
    res.render('code/new')
  } else {
    res.sendStatus(403)
  }
}

/**
 * Creates a new code snippet in the database.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.create = async (req, res) => {
  if (req.session.loggedIn) {
    try {
      const codeSnippet = new Code({
        code: req.body.code,
        user: req.session.loggedIn
      })
      await codeSnippet.save()

      req.session.flash = {
        type: 'success',
        text: 'The code snippet was successfully created.'
      }
      res.redirect('/code')
    } catch (error) {
      return res.render('code/new', {
        validationErrors: [error.message] || [error.errors.value.message],
        value: req.body.username
      })
    }
  } else {
    res.sendStatus(403)
  }
}

/**
 * Renders the page for editing a code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.edit = async (req, res) => {
  try {
    if (req.session.loggedIn && req.session.loggedIn === req.body.user) {
      const snippet = await Code.findOne({ _id: req.params.id })
      const codeData = {
        id: snippet._id,
        code: snippet.code,
        author: snippet.user
      }
      res.render('code/edit', { codeData })
    } else {
      req.session.flash = {
        type: 'fail',
        text: 'You must be logged in as this user to edit!'
      }
      res.redirect('/code')
    }
  } catch (error) {
    req.session.flash = {
      type: 'fail',
      text: error.message
    }
    res.redirect('../')
  }
}

/**
 * Updates a code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.update = async (req, res) => {
  try {
    if (req.session.loggedIn && req.session.loggedIn === req.body.author) {
      const updated = await Code.updateOne({ _id: req.body.id }, {
        code: req.body.code
      })
      if (updated.nModified === 1) {
        req.session.flash = {
          type: 'success',
          text: 'The code snippet was updated successfully!'
        }
        res.redirect('/code')
      } else {
        req.session.flash = {
          type: 'fail',
          text: 'The code snippet failed to update'
        }
      }
      res.redirect('../')
    } else {
      res.sendStatus(403)
    }
  } catch (error) {
    req.session.flash = {
      type: 'fail',
      text: error.message
    }
    res.redirect('/')
  }
}

/**
 * Renders the page to delete a code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.remove = async (req, res) => {
  try {
    const snippet = await Code.findOne({ _id: req.params.id })
    if (req.session.loggedIn && req.session.loggedIn === snippet.user) {
      const codeData = {
        id: snippet._id,
        code: snippet.code,
        author: snippet.user
      }
      res.render('code/delete', { codeData })
    } else {
      req.session.flash = {
        type: 'fail',
        text: 'You must be logged in as this user to delete snippets!'
      }
      res.redirect('/code')
    }
  } catch (error) {
    req.session.flash = {
      type: 'fail',
      text: error.message
    }
    res.redirect('../')
  }
}

/**
 * Deletes a code snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.delete = async (req, res) => {
  try {
    if (req.session.loggedIn && req.session.loggedIn === req.body.author) {
      await Code.deleteOne({ _id: req.body.id })

      req.session.flash = {
        type: 'success',
        text: 'Code snippet was deleted.'
      }
      res.redirect('/code')
    } else {
      res.sendStatus(403)
    }
  } catch (error) {
    req.session.flash = {
      type: 'fail',
      text: error.message
    }
    res.redirect('../')
  }
}

// Exports module.
module.exports = codeController

import express from 'express'
import { googleLogin, login, logout, signup } from '~/controllers/auth.controller.ts'
import { body } from 'express-validator'
import User from '~/models/User.model.ts'

const router = express.Router()

const signupValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .not()
    .isEmpty()
    .withMessage('Please enter an email')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value })
      if (user) {
        throw new Error('Email already exists')
      }
    })
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .not()
    .isEmpty()
    .withMessage('Please enter a password')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.repeatPassword) {
        throw new Error('Passwords do not match')
      }
      return true
    })
]

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .not()
    .isEmpty()
    .withMessage('Please enter an email')
    .normalizeEmail()
    .custom((value, { req }) => {
      const user = User.findOne({ email: value })
      if (!user) {
        throw new Error('Invalid email or password')
      }
      return true
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .not()
    .isEmpty()
    .withMessage('Please enter a password')
    .trim()
]

router.post('/login', loginValidator, login)

router.post("/google", googleLogin)

router.post('/signup', signupValidator, signup)

router.post('/logout', logout)

export default router

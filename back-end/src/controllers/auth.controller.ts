import { errorHandler, HttpError } from '~/utils/error.ts'
import { NextFunction, Request, Response } from 'express'
import User from '~/models/User.model.ts'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  const { username, email, password } = req.body as { username: string; email: string; password: string }

  // Check for validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const error = errorHandler(422, errors.array()[0].msg)
    return next(error)
  }

  const hashedPassword = bcrypt.hashSync(password.toString(), 12)

  const newUser = new User({ username, email, password: hashedPassword })

  try {
    await newUser.save()
    res.status(201).json({ message: 'Sign up successfully!' })
  } catch (err) {
    const error = errorHandler(500, 'Sign up failed!')
    return next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as { email: string; password: string }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = errorHandler(422, errors.array()[0].msg)
    return next(error)
  }

  const user = await User.findOne({ email })

  if (!user) {
    return next(errorHandler(404, 'Invalid email or password!'))
  }

  try {
    const isMatch = await bcrypt.compare(password.toString(), user.password.toString())
    if (!isMatch) {
      return next(errorHandler(404, 'Invalid password!'))
    }
    const token = jwt.sign({ userId: user.id.toString(), email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '3h',
      algorithm: 'HS256'
    })

    res.status(200).json({ user, token, userId: user.id, message: 'Login successful!' })
  } catch (err) {
    const error = errorHandler(500, 'Login failed!')
    console.log(err)
    return next(error)
  }
}

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, username, googleFotoUrl } = req.body as { email: string; username: string; googleFotoUrl: string }
  const user = await User.findOne({ email })
  if (user) {
    const token = jwt.sign({ isAdmin: user.isAdmin , userId: user.id.toString(), email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '3h',
      algorithm: 'HS256'
    })

    res.status(200).json({user ,token, userId: user.id, message: 'Login successful!' })
  } else {
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
    const hashedPassword = await bcrypt.hash(generatedPassword, 12)

    const newUser = new User({
      username: username.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),

      email,
      password: hashedPassword,
      profileImage: googleFotoUrl
    })
    try {
      await newUser.save()
      const token = jwt.sign(
        { userId: newUser.id.toString(), email: newUser.email, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '3h',
          algorithm: 'HS256'
        }
      )

      res.status(200).json({user: newUser, token, userId: newUser.id, message: 'Sign in successfully!' })
    } catch (err) {
      const error = errorHandler(500, 'Sign in failed!')
      return next(error)
    }
  }
}

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logout route works!' })
}

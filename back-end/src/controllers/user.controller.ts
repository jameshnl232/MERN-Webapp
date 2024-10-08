import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import User from '~/models/User.model.ts'
import { errorHandler } from '~/utils/error.ts'
import bcrypt from 'bcrypt'

export const test = (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'User is authenticated' })
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id
  const user = await User.findById(userId)
  if (!user) {
    return next(errorHandler(404, 'User not found!'))
  }
  res.status(200).json({ user })
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  const user = await User.findById(req.userId)
  if (!user) {
    return next(errorHandler(404, 'User not found!'))
  }

  if (user.isAdmin === false) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0
    const limit = parseInt(req.query.limit as string) || 9
    const sortDirection = req.query.order === 'asc' ? 1 : -1

    const users = await User.find({ _id: { $ne: req.userId } })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user.toObject()
      return rest
    })

    const totalUsers = await User.countDocuments()

    if (!users) {
      return next(errorHandler(404, 'No users found!'))
    }

    const now = new Date()

    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    const lastMonthUsers = await User.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments()

    res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers ,message: 'Users fetched successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'An error occurred! Try again later!'))
  }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id
  if (userId !== req.userId) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, 'Password must be at least 6 characters'))
    }
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'))
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'))
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, 'Username can only contain letters and numbers'))
    }
  }

  const { username, email, password, profileImage } = req.body as {
    username: string
    email: string
    password: string
    profileImage: string
  }

  const hashedPassword = bcrypt.hashSync(password.toString(), 12)

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: username,
          email: email,
          password: hashedPassword,
          profileImage: profileImage
        }
      },
      { new: true }
    )

    if (!user) {
      return next(errorHandler(404, 'User not found!'))
    }

    res.status(200).json({ user, message: 'User updated successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'User update failed!'))
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.id
  const user = await User.findById(req.userId)

  

  if (user && !user.isAdmin) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  try {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
      return next(errorHandler(404, 'User not found!'))
    }
    res.status(200).json({ message: 'User deleted successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'User deletion failed!'))
  }
}

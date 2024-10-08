import { NextFunction, Request, Response } from 'express'
import Post from '~/models/Post.model.ts'
import User from '~/models/User.model.ts'
import { errorHandler } from '~/utils/error.ts'

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const startIndex = parseInt(req.query.startIndex as string) || 0
    const limit = parseInt(req.query.limit as string) || 9
    const sortDirection = req.query.sort === 'asc' ? 1 : -1

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const query = {} as { [key: string]: any }

    if (req.query.category) {
      query.category = { $regex: req.query.category, $options: 'i' }
    }

    if (req.query.userId) {
      query.author = req.query.userId
    }

    if (req.query.slug) {
      query.slug = req.query.slug
    }

    if (req.query.postId) {
      query._id = req.query.postId
    }

    if (req.query.searchTerm) {
      query.$or = [
        {
          title: { $regex: req.query.searchTerm, $options: 'i' }
        },
        {
          content: { $regex: req.query.searchTerm, $options: 'i' }
        }
      ]
    }

    const posts = await Post.find({ ...query })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .populate('author')

    const totalPosts = await Post.countDocuments()

    const lastMonthPosts = await Post.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments()

    if (!posts) {
      return next(errorHandler(404, 'No posts found!'))
    }
    res.status(200).json({ posts, totalPosts, lastMonthPosts, message: 'Posts fetched successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'An error occurred! Try again later!'))
  }
}

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  if (req.userId === null) {
    return next(errorHandler(401, 'Not authenticated!'))
  }

  const user = await User.findById(req.userId)
  if (!user) {
    return next(errorHandler(404, 'User not found!'))
  }

  if (user.isAdmin === false) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  const { title, content, image, category } = req.body as {
    title: string
    content: string
    image: string 
    category: string 
  }

  if (!title || !content || !category) {
    return next(errorHandler(400, 'Please fill in all fields!'))
  }

  const exsitPost = await Post.findOne({ title })
  if (exsitPost) {
    return next(errorHandler(400, 'Post with this title already exists!'))
  }

  const slug = title
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[^a-zA-Z0-9-]/g, '-')

  const newPost = new Post({
    title,
    content,
    image,
    category,
    slug,
    author: user.id
  })

  try {
    await newPost.save()
    user.posts.push(newPost.id)
    await user.save()
    res.status(201).json({ post: newPost, message: 'Post created successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'An error occurred! Try again later!'))
  }
}

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  if (req.userId === null) {
    return next(errorHandler(401, 'Not authenticated!'))
  }

  const user = await User.findById(req.userId)
  if (!user) {
    return next(errorHandler(404, 'User not found!'))
  }

  if (user.isAdmin === false) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  const postId = req.params.id

  const { title, content, image, category } = req.body as {
    title: string
    content: string
    image: string
    category: string
  }



  const slug = title
    .toLowerCase()
    .split(' ')
    .join('-')
    .replace(/[^a-zA-Z0-9-]/g, '-')

  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $set: {
          title,
          content,
          image,
          category,
          slug
        }
      },
      { new: true }
    )
    if (!post) {
      return next(errorHandler(404, 'Could not update post!'))
    }
    res.status(200).json({ post, message: 'Post updated successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'An error occurred! Try again later!'))
  }
}

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  if (req.userId === null) {
    return next(errorHandler(401, 'Not authenticated!'))
  }

  const user = await User.findById(req.userId)
  if (!user) {
    return next(errorHandler(404, 'User not found!'))
  }

  if (user.isAdmin === false) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  const postId = req.params.id
  try {
    const post = await Post.findByIdAndDelete(postId)
    if (!post) {
      return next(errorHandler(404, 'Post not found!'))
    }
    const user = await User.findById(post.author)
    if (!user) {
      return next(errorHandler(404, 'User not found!'))
    }
    user.posts.filter((p) => p.toString() !== postId)
    await user.save()
    res.status(200).json({ message: 'Post deleted successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'An error occurred! Try again later!'))
  }
}

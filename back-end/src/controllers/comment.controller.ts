import { Request, Response, NextFunction } from 'express'
import Comment from '../models/Comment.model.ts'
import { errorHandler } from '~/utils/error.ts'
import User from '~/models/User.model.ts'
import Post from '~/models/Post.model.ts'

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postId, content, userId } = req.body as { postId: string; content: string; userId: string }

  const user = await User.findById(userId)
  const post = await Post.findById(postId)

  if (userId !== req.userId || !user) {
    return next(errorHandler(401, 'Not authorized!'))
  }

  if (!post) {
    return next(errorHandler(404, 'Post not found!'))
  }

  if (!content) {
    return res.status(400).json({ success: false, message: 'Write something!' })
  }

  let comment = new Comment({ postId, content, userId })
  try {
    user.comments.push(comment.id)
    post.comments.push(comment.id)
    await comment.save()
    await post.save()
    await user.save()
    const populatedComment = await comment.populate('userId', ['username', 'profileImage'])
    return res.status(201).json({ comment: populatedComment, message: 'Comment created successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'Could not create comment!'))
  }
}

export const likeComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params.id
  const comment = await Comment.findById(commentId)
  if (!comment) {
    return next(errorHandler(400, 'Comment not found!'))
  }

  const userIndex = comment.likes.indexOf(req.userId)
  if (userIndex === -1) {
    comment.likes.push(req.userId)
    comment.numberOfLikes++
  } else {
    comment.likes.splice(userIndex, 1)
    comment.numberOfLikes--
  }

  try {
    await comment.save()
    return res.status(200).json({ comment })
  } catch (err) {
    return next(errorHandler(500, 'Could not like comment!'))
  }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params.id

  const comment = await Comment.findById(commentId)
  const user = await User.findById(req.userId)

  if (!comment) {
    return next(errorHandler(404, 'Comment not found!'))
  }

  if (comment.userId.toString() !== req.userId || !user || !user.isAdmin) {
    return next(errorHandler(403, 'Not authorized!'))
  }

  const { content } = req.body as { content: string }

  if (!content) {
    return res.status(400).json({ success: false, message: 'Write something!' })
  }

  try {
    const updatedComment = await Comment.findByIdAndUpdate(commentId, { $set: { content } }, { new: true })
    return res.status(200).json({ comment: updatedComment, message: 'Comment updated successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'Could not update comment!'))
  }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params.id

  const comment = await Comment.findById(commentId)
  const user = await User.findById(req.userId)

  if (!comment) {
    return next(errorHandler(404, 'Comment not found!'))
  }

  const postId = comment.postId
  const post = await Post.findById(postId)

  if (!post) {
    return next(errorHandler(404, 'Post not found!'))
  }

  if (comment.userId.toString() !== req.userId || !user || !user.isAdmin) {
    return next(errorHandler(403, 'Not authorized!'))
  }

  try {
    await Comment.findByIdAndDelete(commentId)
    post.comments.filter((c) => c.toString() !== commentId)
    await post.save()
    user.comments.filter((c) => c.toString() !== commentId)
    await user.save()

    return res.status(200).json({ message: 'Comment deleted successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'Could not delete comment!'))
  }
}

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params.postId as string

  const startIndex = parseInt(req.query.startIndex as string) || 0
  const limit = parseInt(req.query.limit as string) || 5

  const totalComments = await Comment.countDocuments()
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMonthAgo }
  })

  try {
    const comments = await Comment.find({ postId: postId })
      .populate('userId', ['username', 'profileImage'])
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
    return res
      .status(200)
      .json({ comments, lastMonthComments, totalComments, message: 'Comments fetched successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'Could not get comments!'))
  }
}

export const getAllComments = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.query.postId as string

  const startIndex = parseInt(req.query.startIndex as string) || 0
  const limit = parseInt(req.query.limit as string) || 5

  const totalComments = await Comment.countDocuments()
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
  const lastMonthComments = await Comment.countDocuments({
    createdAt: { $gte: oneMonthAgo }
  })

  const query = {} as { [key: string]: string }

  if (postId) {
    query.postId = postId
  }

  try {
    const comments = await Comment.find(query)
      .populate('userId', ['username', 'profileImage'])
      .populate('postId', ['slug'])
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 })
    return res
      .status(200)
      .json({ comments, lastMonthComments, totalComments, message: 'Comments fetched successfully!' })
  } catch (err) {
    return next(errorHandler(500, 'Could not get comments!'))
  }
}

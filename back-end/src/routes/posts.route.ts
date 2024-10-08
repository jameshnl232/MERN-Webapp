import express from 'express'
import { createPost, getPosts, updatePost, deletePost } from '~/controllers/post.controller.ts'
import { is_auth } from '~/middlewares/is-auth.ts'

const router = express.Router()

router.get('/posts', getPosts)

router.post('/create', is_auth, createPost)


//edit post
router.put('/update/:id', is_auth, updatePost)

//delete post
router.delete('/delete/:id', is_auth, deletePost)



export default router

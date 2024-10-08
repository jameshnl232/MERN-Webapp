import { is_auth } from '~/middlewares/is-auth.ts';
import { createComment, updateComment, deleteComment, getComments, likeComment, getAllComments } from '~/controllers/comment.controller.ts';
import express from 'express';

const router = express.Router()

router.get('/test', (req, res) => {
  res.json({ message: 'Hello from the server!' })
})


router.post('/create', is_auth, createComment);

router.put("/likeComment/:id", is_auth, likeComment);

router.put('/update/:id', is_auth, updateComment);

router.delete('/delete/:id', is_auth, deleteComment);

//router.get('/comments/:postId', getComments);

router.get('/comments', getAllComments);


export default router;
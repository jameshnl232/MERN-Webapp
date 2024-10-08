import express from 'express'
import { deleteUser, getUser, getUsers, test, updateUser } from '~/controllers/user.controller.ts'
import { is_auth } from '~/middlewares/is-auth.ts'

const router = express.Router()

//router.get('/test', is_auth, test)

router.get("/users", is_auth, getUsers)

router.get('/:id', is_auth, getUser)

router.put('/:id', is_auth, updateUser)

router.delete('/delete/:id', is_auth, deleteUser)

//authenticate routes

export default router

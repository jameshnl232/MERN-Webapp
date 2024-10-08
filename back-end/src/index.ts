import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import path from 'path'

//imort routes
import userRoutes from '~/routes/users.route.ts'
import authRoutes from '~/routes/auth.routes.ts'
import postRoutes from '~/routes/posts.route.ts'
import commentRoutes from '~/routes/comments.route.ts'
import { HttpError } from './utils/error.ts'

const port = process.env.PORT
const app = express()
const admin = process.env.DB_ADMIN
const password = process.env.DB_PASSWORD

//adding cors middleware
const corsOptions = {
  methods: 'GET, POST, PUT, DELETE',
  origin: '*',
  allowHeaders: 'Content-Type, Authorization'
}

app.use(cors(corsOptions))

//json data
app.use(express.json())

app.use('/api/comment', commentRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/front-end/dist')))

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'front-end', 'dist', 'index.html'))
})

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error!'
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})

mongoose
  .connect(
    `mongodb+srv://${admin}:${password}@mern-blog-site.xbvyt.mongodb.net/mern?retryWrites=true&w=majority&appName=Mern-blog-site`
  )
  .then(() => {
    console.log('Connected to database!')
    app.listen(port, () => {
      console.log(`Server is running on port ${port}!`)
    })
  })
  .catch((err: Error) => console.log(err))

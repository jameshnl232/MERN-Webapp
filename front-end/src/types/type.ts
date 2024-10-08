export type User = {
  _id: string
  username: string
  email: string
  password: string
  profileImage?: string
  createdAt: string
  updatedAt: string
  isAdmin: boolean
  posts: string[]
}

export type Post = {
  _id: string
  title: string
  content: string
  image: string
  createdAt: string
  updatedAt: string
  slug: string
  author: User
  category: string 
}

export type Comment = {
  _id: string
  content: string
  postId: Post
  userId: User
  likes: any[]
  numberOfLikes: number
  createdAt: string
  updatedAt: string
}

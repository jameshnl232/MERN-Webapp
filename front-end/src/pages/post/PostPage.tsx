import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Post as BlogPost, Post } from '../../types/type'
import { Button, Spinner } from 'flowbite-react'
import CommentSection from './CommentSection'
import PostCard from '../../components/PostCard'

type Props = {}

export default function PostPage({}: Props) {
  const params = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [recentPosts, setRecentPosts] = useState<Post[] | null>(null)



  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string[]>([])

  let postContent
  let postTitle
  let postImage
  if (post) {
    postContent = post.content
    postTitle = post.title
    postImage = post.image
  }


  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/post/posts?slug=${params.slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (response.ok) {
          setPost(data.posts[0])
          setLoading(false)
        }
      } catch (err) {
        setError(['Could not fetch post! Try again later!'])
        setLoading(false)
      }
    }

    fetchPost()
  }, [params.slug])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/posts?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentPosts(data.posts)
        }
      } catch (err) {
        setError(['Could not fetch recent posts! Try again later!'])
      }
    }

    fetchRecentPosts()
  }, [])

  if (loading)
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='xl' />
      </div>
    )

  if (error.length > 0) {
    return (
      <div className='w-full text-center'>
        <h1 className='text-2xl text-red-500'>{error[0]}</h1>
      </div>
    )
  }

  if(!post){
    return
  }



  return (
    <div className='mx-auto flex min-h-screen max-w-6xl flex-col p-3 dark:text-gray-100'>
      <h1 className='mx-auto mt-10 max-w-2xl p-3 text-center font-serif text-3xl lg:text-4xl'>{post && post.title}</h1>
      <Link to={`/search?category=${post && post.category}`} className='mt-5 self-center'>
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <div className='flex h-auto w-full justify-center'>
        <img src={postImage} alt={postTitle} className='mt-10 max-h-[600px] w-full object-cover p-3 text-center' />
      </div>
      <div className='mx-auto flex w-full max-w-2xl justify-between border-b border-slate-500 p-3 text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>
      <div
        className='post-content mx-auto w-full max-w-2xl p-3'
        dangerouslySetInnerHTML={{ __html: postContent as string }}
      ></div>
      <CommentSection postId={post._id} />

      <div className='flex flex-col gap-2'>
        <h1 className='text-center text-2xl sm:text-4xl'>Recent posts</h1>
        <div className='mt-5 flex flex-wrap justify-center gap-5'>
          {recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
    </div>
  )
}

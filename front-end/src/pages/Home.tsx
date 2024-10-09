import { Link } from 'react-router-dom'
import HeroSection from '../components/Hero/HeroSection'
import PostCard from '../components/PostCard'

import { Post } from '../types/type'
import { useEffect, useState } from 'react'

export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null)

  const [_loading, setLoading] = useState(false)
  const [_error, setError] = useState<string[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/post/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (response.ok) {
          setPosts(data.posts)
          setLoading(false)
        }
      } catch (err) {
        setError(['Could not fetch posts! Try again later!'])
      }
    }
    fetchPosts()
  }, [])

  return (
    <>
      <HeroSection />
      <div className='min-h-screen dark:text-gray-100'>
        <div className='mx-auto flex h-full min-h-screen w-full flex-wrap items-start justify-center gap-8 p-3 py-7'>
          {posts && posts.length > 0 && (
            <div className='flex flex-col justify-center gap-6'>
              <h2 className='text-center text-2xl font-bold md:text-4xl'>Recent Posts</h2>
              <div className='flex flex-wrap justify-center gap-4'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
              <Link to={'/search'} className='text-center text-lg text-teal-500 hover:underline'>
                View all posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

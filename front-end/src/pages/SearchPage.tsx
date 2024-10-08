import { Button, Label, Select, TextInput } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Post } from '../types/type'
import PostCard from '../components/PostCard'
import { useNavigate } from 'react-router-dom'

type Props = {}

export default function SearchPage({}: Props) {
  const [formData, setFormData] = useState({
    search: '',
    sort: 'desc',
    category: ''
  })
  const location = useLocation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string[]>([])
  const navigate = useNavigate()
  const [showMore, setShowMore] = useState(true)

  useEffect(() => {
    if (location.search) {
      const search = new URLSearchParams(location.search)
      const searchQuery = search.get('searchTerm') || ''
      const sortQuery = search.get('sort') || 'desc'
      const categoryQuery = search.get('category') || ''
      if (searchQuery || sortQuery || categoryQuery) {
        setFormData({
          ...formData,
          search: searchQuery,
          sort: sortQuery,
          category: categoryQuery
        })
      }
      const fetchPosts = async () => {
        try {
          setLoading(true)
          const response = await fetch(
            `/api/post/posts?searchTerm=${searchQuery}&sort=${sortQuery}&category=${categoryQuery}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              }
            }
          )
          const data = await response.json()
          if (response.ok) {
            setPosts(data.posts)
            console.log(data.posts)
            setLoading(false)
            if (data.posts.length < 9) {
              setShowMore(false)
            }
          }
        } catch (err) {
          setError(['Could not fetch posts! Try again later!'])
        }
      }

      fetchPosts()
    }
    
  }, [location.search])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.search || formData.sort || formData.category) {
      const urlParams = new URLSearchParams(location.search)
      urlParams.set('searchTerm', formData.search)
      urlParams.set('sort', formData.sort)
      urlParams.set('category', formData.category)
      const searchQuery = urlParams.toString()
      navigate(`/search?${searchQuery}`)
    }
  }

  const handleShowMore = async () => {
    const startIndex = posts.length
    try {
      const response = await fetch(
        `/api/post/posts?searchTerm=${formData.search}&sort=${formData.sort}&category=${formData.category}&startIndex=${startIndex}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        setPosts([...posts, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (err) {
      setError(['Could not fetch posts! Try again later!'])
    }
  }

  if (loading) {
    return <p className='min-h-screen text-center'>Loading...</p>
  }

 

  if (error.length > 0) {
    return <p className='min-h-screen text-center'>{error[0]}</p>
  }

  return (
    <div className='flex min-h-screen w-full flex-wrap'>
      <form
        className='side-bar w-full border-r-[5px] border-gray-300 shadow-sm sm:min-h-screen sm:w-1/4'
        onSubmit={handleSubmit}
      >
        <div className='px-2'>
          <Label className='text-2xl font-semibold'>Search</Label>
          <TextInput
            placeholder='Search'
            name='search'
            id='search'
            value={formData.search}
            onChange={(e) => setFormData({ ...formData, search: e.target.value })}
          />
        </div>
        <div className='px-2'>
          <Label className='text-2xl font-semibold'>Category</Label>
          <TextInput
            placeholder='Category'
            name='category'
            id='category'
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>
        <div className='px-2'>
          <Label className='text-2xl font-semibold'>Sort</Label>
          <Select value={formData.sort} onChange={(e) => setFormData({ ...formData, sort: e.target.value })}>
            <option value='desc'>Latest</option>
            <option value='asc'>Oldest</option>
          </Select>
        </div>
        <div className='mx-2'>
          <Button type='submit' className='mt-2' outline>
            Apply Filters
          </Button>
        </div>
      </form>
      <div className='py-10 sm:w-3/4'>
        {posts.length === 0 && <p className='text-center'>No posts found!</p>}

        <div className='flex flex-wrap items-start justify-center'>
          {posts && posts.length > 0 && (
            <div className='flex flex-wrap justify-center gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          )}
        </div>
        {showMore && (
          <div className='mt-5 flex justify-center'>
            <Button outline onClick={handleShowMore}>
              Show more
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Post } from '../../types/type'
import { useAppSelector } from '../../redux/store'
import { Button, Modal, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import showToast from '../../utils/toast'

type Props = {
  className?: string
}

export default function DashboardPosts({ className }: Props) {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const userId = useAppSelector((state) => state.auth.userId)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string[]>([])
  const [showMore, setShowMore] = useState(true)
  const [postToDelete, setPostToDelete] = useState('')

  const [showModal, setShowModal] = useState(false)


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/post/posts?userId=${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (response.ok) {
          setPosts(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
          setLoading(false)
        }
      } catch (err) {
        setError(['Could not fetch posts! Try again later!'])
      }
    }

    if (user && user.isAdmin) {
      fetchPosts()
    }
  }, [userId])

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`/api/post/delete/${postToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postToDelete))
        setShowModal(false)
        showToast('Deleted post!', 'success')
      } else {
        setError([data.message])
      }
    } catch (err) {
      setError(['Could not delete post! Try again later!'])
    }
  }

  const handleShowMore = () => {
    const startIndex = posts.length
    const fetchmorePosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/post/posts?userId=${userId}&startIndex=${startIndex}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (response.ok) {
          setPosts((prevPosts) => [...prevPosts, ...data.posts])
          if (data.posts.length < 9) {
            setShowMore(false)
          }
          setLoading(false)
        }
      } catch (err) {
        setError(['Could not fetch posts! Try again later!'])
      }
    }
    fetchmorePosts()
  }

  if (loading) {
    return <p className='text-center'>Loading...</p>
  }

  if (error.length > 0) {
    return <p className='text-center'>{error[0]}</p>
  }

  return (
    <>
      <div
        className={
          className +
          ' ' +
          'table-auto overflow-x-scroll p-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 md:mx-auto'
        }
      >
        {posts.length > 0 ? (
          <Table hoverable className='w-full shadow-md'>
            <Table.Head>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>

              <Table.HeadCell>
                <span className='sr-only'>Edit</span>
              </Table.HeadCell>
              <Table.HeadCell>
                <span className='sr-only'>Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {posts.map((post) => (
                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(post.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className='h-10 w-20 bg-gray-500 object-cover' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.title}</Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className='cursor-pointer text-red-600 hover:underline'
                      onClick={() => {
                        setShowModal(true)
                        setPostToDelete(post._id)
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/edit-post/${post._id}`}>
                      <span className='cursor-pointer text-blue-600 hover:underline'> Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>No posts found!</p>
        )}
        {showMore && (
          <div className='mt-5 flex justify-center'>
            <Button outline onClick={handleShowMore}>
              Show more
            </Button>
          </div>
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
          <Modal.Header />
          <Modal.Body>
            <div className='text-center'>
              <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
              <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                Are you sure you want to delete this post?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeletePost}>
                  Yes, I'm sure
                </Button>
                <Button color='gray' onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  )
}

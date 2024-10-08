import { useEffect, useState } from 'react'
import { Comment } from '../../types/type'
import { useAppSelector } from '../../redux/store'
import { Button, Modal, Table } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import showToast from '../../utils/toast'
import { Link } from 'react-router-dom'

type Props = {
  className?: string
}

export default function DashboardComments({ className }: Props) {
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const userId = useAppSelector((state) => state.auth.userId)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string[]>([])
  const [showMore, setShowMore] = useState(true)
  const [commentToDelete, setCommentToDelete] = useState('')

  const [showModal, setShowModal] = useState(false)

  console.log(comments)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/comment/comments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json()
        if (response.ok) {
          setComments(data.comments)
          if (data.comments.length < 5) {
            setShowMore(false)
          }
          setLoading(false)
        }
      } catch (err) {
        setError(['Could not fetch comments! Try again later!'])
      }
    }

    if (user && user.isAdmin) {
      fetchComments()
    }
  }, [userId])

  const handleDeleteComment = async () => {
    if (!commentToDelete) {
      return
    }

    try {
      const response = await fetch(`/api/comment/delete/${commentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const updatedComments = comments.filter((c) => c._id !== commentToDelete)
        setComments(updatedComments)
        setShowModal(false)
        showToast('Comment deleted successfully!', 'success')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const response = await fetch(`/api/comment/comments?startIndex=${startIndex}`)
      const data = await response.json()
      if (response.ok) {
        setComments([...comments, ...data.comments])
        if (data.comments.length < 5) {
          setShowMore(false)
        }
      }
    } catch (err) {
      console.log(err)
    }
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
        {comments.length > 0 ? (
          <Table hoverable className='w-full shadow-md'>
            <Table.Head>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Content</Table.HeadCell>
              <Table.HeadCell>NumberOfLikes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>

              <Table.HeadCell>
                <span className='sr-only'>Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {comments.map((comment) => (
                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <span>{comment.content}</span>
                  </Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${comment.postId.slug}`}>{comment.postId.slug}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      className='cursor-pointer text-red-600 hover:underline'
                      onClick={() => {
                        setShowModal(true)
                        setCommentToDelete(comment._id)
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p>No comments found!</p>
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
                Are you sure you want to delete this comment?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteComment}>
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

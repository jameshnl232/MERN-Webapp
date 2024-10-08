import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../redux/store'
import { User } from '../../types/type'
import { useEffect, useState } from 'react'
import { Comment } from '../../types/type'
import PostComment from './PostComment'
import { Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

type Props = {
  postId: string
}

export default function CommentSection({ postId }: Props) {
  const user = useAppSelector<User | null>((state) => state.auth.user)
  const token = useAppSelector<string | null>((state) => state.auth.token)
  const [content, setContent] = useState<string>('')
  const [comment, setComment] = useState<Comment | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showMore, setShowMore] = useState(true)

  const [showModal, setShowModal] = useState<boolean>(false)
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrors([])

    if (!user) {
      return
    }

    if (content.length > 200) {
      setErrors(["Comment can't be more than 200 characters!"])
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          postId,
          content: content,
          userId: user._id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setComment(data.comment)
        setComments([...comments, data.comment])
        setContent('')
        setLoading(false)
      }
    } catch (err) {
      setErrors(['Could not create comment!'])
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/comments?postId=${postId}&limit=5`)
        const data = await response.json()
        if (response.ok) {
          setComments(data.comments)
          if (data.comments.length < 5) {
            setShowMore(false)
          }
        }
      } catch (err) {
        console.log(err)
      }
    }

    fetchComments()
  }, [postId])

  const handleShowMore = async () => {
    const startIndex = comments.length
    try {
      const response = await fetch(`/api/comment/comments?postId=${postId}&startIndex=${startIndex}`)
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

  const handleLike = async (comment: Comment) => {
    if (!user) {
      navigate('/login')
    }

    if (!comment) {
      console.log('No comment found!')
      return
    }

    try {
      const response = await fetch(`/api/comment/likeComment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (response.ok) {
        const updatedComments = comments.map((c) =>
          c._id === comment._id
            ? {
                ...c,
                likes: data.comment.likes,
                numberOfLikes: data.comment.numberOfLikes
              }
            : c
        )
        setComments(updatedComments)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete = async (commentToDelete: string | null) => {
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
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleEdit = (comment: Comment, content: string) => {
    const updatedComments = comments.map((c) => (c._id === comment._id ? { ...c, content } : c))
    setComments(updatedComments)
  }

  return (
    <div className='mx-auto mt-20 w-full max-w-2xl p-3'>
      {user ? (
        <>
          <div className='flex items-center gap-x-3 text-sm text-gray-500'>
            <p>Signed in as {user.email}</p>
            <div className='flex items-center'>
              <img src={user.profileImage} alt='profile' className='h-8 w-8 rounded-full bg-center object-cover' />
              <Link className='text-xs text-cyan-600 hover:underline' to='/dashboard?tab=profile'>
                @{user.username}
              </Link>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              className='mt-3 h-24 w-full rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:bg-gray-800 dark:text-gray-100'
              placeholder='Write a comment...'
              onChange={(e) => setContent(e.target.value)}
              value={content}
            ></textarea>
            <p className='text-xs text-gray-500'>{200 - content.length} characters remaining</p>
            {errors && errors.length > 0 && <p className='w-full text-center text-sm text-red-600'>{errors[0]}</p>}

            <button
              type='submit'
              className='mt-3 w-full rounded-lg bg-cyan-600 py-2 text-gray-100 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-600'
            >
              Comment
            </button>
          </form>
          {comments.length > 0 ? (
            <>
              <div className='my-5 flex items-center gap-1 text-sm dark:text-gray-300'>
                <h2>Comments</h2>
                <div className='border border-gray-400 p-1'>{comments.length}</div>
              </div>
              {comments.map((comment) => (
                <PostComment
                  key={comment._id}
                  comment={comment}
                  user={user}
                  onEdit={handleEdit}
                  onLike={handleLike}
                  onDelete={(id) => {
                    setCommentToDelete(id)
                    setShowModal(true)
                  }}
                />
              ))}
              {showMore  && (
                <div className='mt-5 flex justify-center'>
                  <Button outline onClick={handleShowMore}>
                    Show more
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className='mt-5 text-center text-gray-500'>No comments yet!</p>
          )}
        </>
      ) : (
        <div className='flex items-center gap-x-3 text-sm text-gray-500'>
          <p>Sign in to comment</p>
          <Link className='text-xs text-cyan-600 hover:underline' to='/login'>
            Sign in
          </Link>
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
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>
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
  )
}

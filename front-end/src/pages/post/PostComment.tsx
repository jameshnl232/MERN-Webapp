import { Link } from 'react-router-dom'
import { Comment, User } from '../../types/type'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useAppSelector } from '../../redux/store'
import { useState } from 'react'
import { Button, Textarea } from 'flowbite-react'

type Props = {
  comment: Comment
  onLike: (comment: Comment) => void
  onDelete: (id: string) => void
  onEdit: (comment: Comment, content: string) => void
  user: User
}

export default function PostComment({ comment, onDelete, onLike, onEdit, user }: Props) {
  const currentUser = useAppSelector<User | null>((state) => state.auth.user)
  const token = useAppSelector<string | null>((state) => state.auth.token)
  const [edit, setEdit] = useState(false)
  const [content, setContent] = useState(comment.content)

  const handleEdit = () => {
    setEdit(!edit)
    setContent(comment.content)
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/comment/update/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          content
        })
      })

      if(response.ok){
        const data = await response.json()
        onEdit(comment, data.comment.content)
        setEdit(false)
      }

    } catch (error) {
      console.log(error)
      setEdit(false)
    }
  }

  return (
    <div key={comment._id} className='mt-3 flex items-center gap-3 border-b p-4 dark:border-gray-400'>
      <div className='flex-shrink-0'>
        <img src={comment.userId.profileImage} alt='profile' className='h-8 w-8 rounded-full bg-center object-cover' />
      </div>
      <div className='flex flex-1 flex-col items-start'>
        <div className='flex w-full justify-between'>
          <p>{comment.userId.username}</p>
          <span className='text-xs italic text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {edit ? (
          <>
            <Textarea className='mb-2' value={content} onChange={(e) => setContent(e.target.value)} />
            <div className='flex justify-end gap-2 text-xs'>
              <Button type='button' outline size='xs' gradientDuoTone='purpleToBlue' onClick={handleSave}>
                Save
              </Button>
              <Button type='button' outline size='xs' gradientDuoTone='purpleToBlue' onClick={() => setEdit(false)}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <p className='h-auto text-gray-500'>{comment.content}</p>
        )}
        <div className='flex w-full items-center justify-between gap-1'>
          <div className='flex items-center gap-1 text-sm'>
            <span className='dark:text-gray-300'>{comment.numberOfLikes}</span>
            <button
              onClick={() => onLike(comment)}
              className='flex items-center gap-x-2 text-gray-500 hover:text-cyan-600'
            >
              <FaThumbsUp
                className={`cursor-pointer ${user && comment.likes.includes(user._id) && 'text-blue-500'} `}
              />
            </button>
          </div>
          {(currentUser && currentUser._id === comment.userId._id) || currentUser?.isAdmin ? (
            <div className='flex gap-2 text-sm'>
              <button onClick={() => onDelete(comment._id)} className='text-gray-500 hover:text-red-600'>
                Delete
              </button>
              <button onClick={handleEdit} className='text-gray-500 hover:text-blue-600'>
                Edit
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

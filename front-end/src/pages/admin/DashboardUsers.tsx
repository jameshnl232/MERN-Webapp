import { Button, Modal, Table } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { User } from '../../types/type'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { useAppSelector } from '../../redux/store'
import showToast from '../../utils/toast'

type Props = {
  className?: string
}

export default function DashboardUsers({ className }: Props) {
  const user = useAppSelector((state) => state.auth.user)
  const [users, setUsers] = useState<User[]>([])
  const token = useAppSelector((state) => state.auth.token)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string[]>([])
  const [showMore, setShowMore] = useState(true)
  const [userToDelete, setUserToDelete] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users)
          if (data.users.length < 9) {
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
  }, [user])

  const handleShowMore = () => {
    //fetch more posts
    const startIndex = users.length
    const fetchMoreUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/user/users?&startIndex=${startIndex}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          setUsers((prevUsers) => [...prevUsers, ...data.users])
          if (data.users.length < 9) {
            setShowMore(false)
          }
          setLoading(false)
        }
      } catch (err) {
        setError(['Could not fetch users! Try again later!'])
      }
    }
    fetchMoreUsers()
  }

  const handleDeleteUser = async () => {
    //delete post
    try {
      const response = await fetch(`/api/user/delete/${userToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.errors)
      } else {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userToDelete))
        setShowModal(false)
        showToast('User deleted successfully!', 'success')
      }
    } catch (err) {
      setError(['Could not delete user! Try again later!'])
    }
  }

  if (loading) {
    return <p className='w-full text-center'>Loading...</p>
  }

  if (error.length > 0) {
    return <p className='w-full text-center'>{error[0]}</p>
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
        {users.length > 0 ? (
          <Table hoverable className='w-full shadow-md'>
            <Table.Head>
              <Table.HeadCell>Created at</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>

              <Table.HeadCell>
                <span className='sr-only'>Delete</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {users.map((user) => (
                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/user/${user._id}`}>
                      <img src={user.profileImage} alt={user.username} className='h-10 w-20 bg-gray-500 object-cover' />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.isAdmin ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>
                    <span
                      className='cursor-pointer text-red-600 hover:underline'
                      onClick={() => {
                        setShowModal(true)
                        setUserToDelete(user._id)
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
          <p>No users found!</p>
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
                Are you sure you want to delete this user?
              </h3>
              <div className='flex justify-center gap-4'>
                <Button color='failure' onClick={handleDeleteUser}>
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

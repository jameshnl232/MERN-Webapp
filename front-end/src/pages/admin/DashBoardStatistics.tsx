import { useEffect, useState } from 'react'
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi'
import { Button, Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/store'
import { Comment, Post, User } from '../../types/type'

type Props = {
  className?: string
}

export default function DashboardComp({ className }: Props) {
  const [users, setUsers] = useState<User[] | null>([])
  const [comments, setComments] = useState<Comment[] | null>([])
  const [posts, setPosts] = useState<Post[] | null>([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalComments, setTotalComments] = useState(0)
  const [lastMonthUsers, setLastMonthUsers] = useState(0)
  const [lastMonthPosts, setLastMonthPosts] = useState(0)
  const [lastMonthComments, setLastMonthComments] = useState(0)
  const currentUser = useAppSelector((state) => state.auth.user)

  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/users?limit=5`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        const data = await res.json()
        if (res.ok) {
          setUsers(data.users)
          setTotalUsers(data.totalUsers)
          setLastMonthUsers(data.lastMonthUsers)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/post/posts?limit=5`)
        const data = await res.json()
        if (res.ok) {
          setPosts(data.posts)
          setTotalPosts(data.totalPosts)
          setLastMonthPosts(data.lastMonthPosts)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchComments = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/comment/comments?limit=5`)
        const data = await res.json()
        if (res.ok) {
          setComments(data.comments)
          setTotalComments(data.totalComments)
          setLastMonthComments(data.lastMonthComments)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (currentUser && currentUser.isAdmin) {
      fetchUsers()
      fetchPosts()
      fetchComments()
    }
  }, [currentUser])
  return (
    <div className={className + ' ' + 'p-3 md:mx-auto'}>
      <div className='flex flex-wrap justify-center gap-4'>
        <div className='flex w-full flex-col gap-4 rounded-md p-3 shadow-md dark:bg-slate-800 md:w-72'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-md uppercase text-gray-500'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='rounded-full bg-teal-600 p-3 text-5xl text-white shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex w-full flex-col gap-4 rounded-md p-3 shadow-md dark:bg-slate-800 md:w-72'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-md uppercase text-gray-500'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='rounded-full bg-indigo-600 p-3 text-5xl text-white shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex w-full flex-col gap-4 rounded-md p-3 shadow-md dark:bg-slate-800 md:w-72'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-md uppercase text-gray-500'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='rounded-full bg-lime-600 p-3 text-5xl text-white shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='flex items-center text-green-500'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='mx-auto flex flex-wrap justify-center gap-4 py-3'>
        <div className='flex w-full flex-col rounded-md p-2 shadow-md dark:bg-gray-800 md:w-auto'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='p-2 text-center'>Recent users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img src={user.profileImage} alt='user' className='h-10 w-10 rounded-full bg-gray-500' />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex w-full flex-col rounded-md p-2 shadow-md dark:bg-gray-800 md:w-auto'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='p-2 text-center'>Recent comments</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=comments'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell className='w-96'>
                      <p className='line-clamp-2'>{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex w-full flex-col rounded-md p-2 shadow-md dark:bg-gray-800 md:w-auto'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='p-2 text-center'>Recent posts</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img src={post.image} alt='user' className='h-10 w-14 rounded-md bg-gray-500' />
                    </Table.Cell>
                    <Table.Cell className='w-96'>{post.title}</Table.Cell>
                    <Table.Cell className='w-5'>{post.category}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  )
}

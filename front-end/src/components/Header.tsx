import { Avatar, Button, DarkThemeToggle, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Luong from '~/assets/Luong.png'
import { AiOutlineSearch } from 'react-icons/ai'
import { useAppDispatch, useAppSelector } from '../redux/store'

import { logoutProfile } from '../redux/features/auth/auth.slices'
import showToast from '../utils/toast'
import useTokenExpiry from '../hooks/useTokenExpiry '
import { useEffect, useState } from 'react'

export default function Header() {
  const path = useLocation().pathname
  const user = useAppSelector((state) => state.auth.user)
  const token = useAppSelector((state) => state.auth.token)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const location = useLocation()

  useEffect(() => {
    if (location.search) {
      const search = new URLSearchParams(location.search)
      setSearchTerm(search.get('searchTerm') || '')
    }
  }, [location.search])

  //log out if token expires
  useTokenExpiry(token)

  const handleLogout = () => {
    dispatch(logoutProfile())
    showToast('Logged out successfully', 'success')
    navigate('/')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchTerm) {
      const urlParams = new URLSearchParams(location.search)
      urlParams.set('searchTerm', searchTerm)
      const searchQuery = urlParams.toString()
      navigate(`/search?${searchQuery}`)
    }
  }

  return (
    <>
      <Navbar className='sticky top-0 z-[100] border-b-2 dark:bg-black'>
        <Link to='/' className='self-center whitespace-nowrap text-sm font-bold dark:text-white sm:text-xl'>
          <div className='flex items-center justify-center'>
            <img src={Luong} className='h-10 w-10 rounded-full' alt='Luong' />
            <div className='text-sm sm:text-lg'>
              <span className='rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-2'>Luong's </span>
              <span className='text-blue-500'>Blog</span>
            </div>
          </div>
        </Link>
        <form onSubmit={handleSubmit}>
          <TextInput
            type='text'
            rightIcon={AiOutlineSearch}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search...'
            required
            className='hidden lg:inline'
          ></TextInput>
        </form>
        <Button className='h-10 w-12 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
        <div className='flex gap-2 md:order-2'>
          <DarkThemeToggle className='duration-2000 transition-colors ease-out' />
          {user ? (
            <Dropdown
              label={<Avatar alt='User settings' img={user.profileImage} rounded />}
              arrowIcon={false}
              inline
              className='z-[100]'
            >
              <Dropdown.Header>
                <span className='block text-sm'>{user.username}</span>
                <span className='block truncate text-sm font-medium'>{user.email}</span>
              </Dropdown.Header>
              {user && user.isAdmin && (
                <Link to='/dashboard?tab=dashboard'>
                  <Dropdown.Item>Dashboard</Dropdown.Item>
                </Link>
              )}
              <Link to='/dashboard?tab=profile'>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          ) : (
            <Link to='/login'>
              <Button className='md:order-2' gradientMonochrome='info' outline>
                Login
              </Button>
            </Link>
          )}{' '}
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link to='/'>Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'} as={'div'}>
            <Link to='/about'>About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/contact'} as={'div'}>
            <Link to='/contact'>Contact</Link>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}

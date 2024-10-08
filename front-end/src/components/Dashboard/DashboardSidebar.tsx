import { Sidebar } from 'flowbite-react'
import { HiUser, HiArrowSmRight, HiDocumentText } from 'react-icons/hi'
import { HiOutlineDesktopComputer } from 'react-icons/hi'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HiUsers } from 'react-icons/hi'


import { useAppDispatch, useAppSelector } from '../../redux/store'
import { logoutProfile } from '../../redux/features/auth/auth.slices'
import showToast from '../../utils/toast'
import { jwtDecode } from 'jwt-decode'

type Props = {
  className?: string
}

export default function DashboardSidebar({ className }: Props) {
  const location = useLocation()
  const [tab, setTab] = useState<string | null>(null)
  const user = useAppSelector((state) => state.auth.user)

  const token = useAppSelector((state) => state.auth.token)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  //log out if token expires
  useEffect(() => {
    if (token) {
      const { exp } = jwtDecode(token) as { exp: number }

      const currentTime = Date.now() / 1000

      const timeUntilExpiry = (exp - currentTime) * 1000
      const timeout = setTimeout(() => {
        dispatch(logoutProfile())
        showToast('Session expired, please log in again', 'error')
        navigate('/')
      }, timeUntilExpiry)

      return () => clearTimeout(timeout)
    }
  }, [token])

  const handleLogout = () => {
    dispatch(logoutProfile())
    showToast('Logged out successfully', 'success')
    navigate('/')
  }

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <Sidebar aria-label='Default sidebar example' className={className}>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-2'>
          {user && user.isAdmin && (
            <>
              <Link to='/dashboard?tab=dashboard'>
                <Sidebar.Item
                  as='div'
                  icon={HiOutlineDesktopComputer}
                  active={tab === 'dashboard'}
                  label=''
                  labelColor=''
                >
                  Dashboard
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=posts'>
                <Sidebar.Item as='div' icon={HiDocumentText} active={tab === 'posts'} label='' labelColor=''>
                  Posts
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=users'>
                <Sidebar.Item as='div' icon={HiUsers} active={tab === 'users'} label='' labelColor=''>
                  Users
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=comments'>
                <Sidebar.Item as='div' icon={HiDocumentText} active={tab === 'comments'} label='' labelColor=''>
                  Comments
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              as='div'
              icon={HiUser}
              active={tab === 'profile'}
              label={user?.isAdmin ? 'admin' : 'user'}
              labelColor='dark'
            >
              Profile
            </Sidebar.Item>
          </Link>

          <Sidebar.Item
            onClick={handleLogout}
            as='div'
            href='#'
            icon={HiArrowSmRight}
            label=''
            labelColor='dark'
            className='cursor-pointer'
          >
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

import { useEffect, useState } from 'react'
import { useLocation,  } from 'react-router-dom'
import DashboardSidebar from '../../components/Dashboard/DashboardSidebar'
import DashboardProfile from '../../components/Dashboard/DashboardProfile'
import DashboardPosts from './DashboardPosts'
import DashboardUsers from './DashboardUsers'
import DashBoardStatistics from './DashBoardStatistics'
import {  useAppSelector } from '../../redux/store'

import useTokenExpiry from '../../hooks/useTokenExpiry '
import DashboardComments from './DashboardComments'

type Props = {}

export default function Dashboard({}: Props) {
  const location = useLocation()
  const [tab, setTab] = useState<string | null>(null)
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)

  //log out if token expires
 useTokenExpiry(token)

  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <div className='flex min-h-screen w-full flex-col dark:text-gray-100 sm:flex-row'>
      {/* sidebar */}
      <div className='min-h-full min-w-[25%] shadow-2xl'>
        <DashboardSidebar className='h-full w-full' />
      </div>

      {/* main content */}
      {/*Profile */}
      {tab === 'profile' && <DashboardProfile className='min-h-full w-full' />}

      {/* Posts */}
      {user && user.isAdmin && tab === 'posts' && <DashboardPosts className='min-h-full w-full' />}

      {/* Users */}
      {user && user.isAdmin && tab === 'users' && <DashboardUsers className='min-h-full w-full' />}

      {/* Comments */}
      {user && user.isAdmin && tab === 'comments' && <DashboardComments className='min-h-full w-full' />}

      {/* Dashboard */}
      {user && user.isAdmin && tab === 'dashboard' && <DashBoardStatistics className='min-h-full w-full' />}


    </div>
  )
}

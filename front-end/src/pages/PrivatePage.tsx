import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../redux/store'

type Props = {}

export default function PrivatePage({}: Props) {
  const user = useAppSelector((state) => state.auth.user)

  return <>{user ? <Outlet /> : <Navigate to='/login' />}</>
}

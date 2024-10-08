import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../../redux/store'
type Props = {}

export default function OnlyIsAdminPrivatePage({}: Props) {
  const user = useAppSelector((state) => state.auth.user)

  return <>{user && user.isAdmin ? <Outlet /> : <Navigate to='/login' />}</>
}

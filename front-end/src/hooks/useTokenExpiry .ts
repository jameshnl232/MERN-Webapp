import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutProfile } from '../redux/features/auth/auth.slices'
import showToast from '../utils/toast'

const useTokenExpiry = (token: string | null) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
  }, [token, dispatch, navigate])
}

export default useTokenExpiry

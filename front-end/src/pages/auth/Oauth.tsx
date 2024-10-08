import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { Button } from 'flowbite-react'
import { app } from '../../firebase'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../redux/store'
import { signIn } from '../../redux/features/auth/auth.slices'
import showToast from '../../utils/toast'

type Props = {}

export default function Oauth({}: Props) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleGoogleAuth = async () => {
    const auth = getAuth(app)
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider)

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: resultsFromGoogle.user?.displayName,
          email: resultsFromGoogle.user?.email,
          googleFotoUrl: resultsFromGoogle.user?.photoURL
        })
      })
      const data = await response.json()
      if (response.ok) {
        dispatch(signIn(data))
        showToast(data.message, 'success')
        return navigate('/')
      } else {
        console.error(data.message)
      }
    } catch (error) {
      console.error(error)
      showToast('An error occured, try again later!', 'error')
    }
  }

  return (
    <Button
      type='button'
      className='bg-gradient-to-tl from-slate-300 via-yellow-400 to-orange-600'
      outline
      onClick={handleGoogleAuth}
    >
      <span className='flex items-center justify-center'>
        {' '}
        <svg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' width='30' height='30' viewBox='0 0 48 48'>
          <path fill='#4caf50' d='M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z'></path>
          <path fill='#1e88e5' d='M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z'></path>
          <polygon fill='#e53935' points='35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17'></polygon>
          <path
            fill='#c62828'
            d='M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z'
          ></path>
          <path
            fill='#fbc02d'
            d='M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z'
          ></path>
        </svg>{' '}
      </span>{' '}
      <div className='flex items-center justify-center'>Login with Google</div>
    </Button>
  )
}

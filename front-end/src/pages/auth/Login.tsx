import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react'
import { Form, Link, useNavigate } from 'react-router-dom'
import plants from '~/assets/plants.jpeg'
import { validateLoginForm } from '../../utils/validation'
import Oauth from './Oauth'
import { useAppDispatch } from '../../redux/store'
import { useState } from 'react'
import { signIn } from '../../redux/features/auth/auth.slices'
import showToast from '../../utils/toast'

type Props = {}

export default function Login({}: Props) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const dispatch = useAppDispatch()

  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateLoginForm({ email: formData.email, password: formData.password })
    setErrors(validationErrors)

    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors([data.message])
        setLoading(false)
      } else {
        showToast(data.message, 'success')
        dispatch(signIn(data))
        setLoading(false)
        return navigate('/')
      }
    } catch (error) {
      setErrors(['An error occured, try again later!'])
    }
  }

  return (
    <div className='grid min-h-screen grid-cols-1 place-items-center pt-5 dark:text-gray-100 sm:grid-cols-2'>
      <div className='order-2 hidden h-5/6 w-5/6 sm:inline'>
        <div
          className='h-full w-full rounded-lg bg-cover bg-center'
          style={{ backgroundImage: `url(${plants})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
      </div>
      <div className='h-5/6 w-5/6'>
        <Card className='h-full w-full py-10'>
          <Card className='text-center'>
            <h2 className='text-2xl font-bold'>Login to your account</h2>
            <p className=''>Fill in the form to login to your account.</p>
          </Card>
          <Form method='post' className='flex h-full w-full flex-col gap-y-5' noValidate onSubmit={handleSubmit}>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='email' value='Your email' />
              </div>
              <TextInput
                name='email'
                id='email'
                onChange={handleChange}
                type='email'
                placeholder='name@gmail.com'
                required
                shadow
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='password' value='Your password' />
              </div>
              <TextInput
                placeholder='********'
                onChange={handleChange}
                name='password'
                id='password'
                type='password'
                required
                shadow
              />
            </div>

            <Button
              type='submit'
              className='mt-5 bg-gradient-to-r from-violet-600 to-indigo-600'
              outline
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner className='mr-2' size='sm' />
                  <span>Loading...</span>
                </>
              ) : (
                'Login'
              )}
            </Button>
            <Oauth />
          </Form>
          <div className='flex justify-center gap-2'>
            <span className='dark:text-gray-100'>Don't have an account?</span>
            <Link to='/signup' className='text-blue-500 hover:underline'>
              Sign up here.
            </Link>
          </div>
          {errors && errors.length > 0 ? (
            <Alert className='' color='failure'>
              {errors[0]}
            </Alert>
          ) : null}
        </Card>
      </div>
    </div>
  )
}

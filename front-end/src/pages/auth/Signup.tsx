import { Alert, Button, Card, Label, Spinner, TextInput } from 'flowbite-react'
import { Form, Link, useNavigate } from 'react-router-dom'
import waves from '~/assets/waves.jpeg'
import { validateSignupForm } from '../../utils/validation'
import Oauth from './Oauth'
import { useState } from 'react'
import showToast from '../../utils/toast'

type Props = {}

export default function Signup({}: Props) {
  const navigate = useNavigate()
 const [loading, setLoading] = useState(false)
 const [errors, setErrors] = useState<string[]>([])

  const [formData, setFormData] = useState({ email: '', password: '', repeatPassword: '' })
  const username = formData.email.split('@')[0]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validationErrors = validateSignupForm({
      email: formData.email,
      password: formData.password,
      repeatPassword: formData.repeatPassword
    })
    setErrors(validationErrors)

    try {
      setLoading(true)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username,
          repeatPassword: formData.repeatPassword
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors([data.message])
        setLoading(false)
      } else {
        showToast(data.message, 'success')
        setLoading(false)
        return navigate('/login')
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
          style={{ backgroundImage: `url(${waves})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        ></div>
      </div>
      <div className='min-h-5/6 w-5/6'>
        <Card className='my-5 h-full w-full'>
          <Card className='bg-gray-200 text-center'>
            <h2 className='text-2xl font-bold'>Register new account</h2>
            <p className=' '>Fill in the form to create a new account.</p>
          </Card>
          <Form method='post' className='flex h-full w-full flex-col gap-y-5' noValidate onSubmit={handleSubmit}>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='email' value='Your email' />
              </div>
              <TextInput
                name='email'
                id='email'
                type='email'
                placeholder='name@gmail.com'
                onChange={handleChange}
                required
                shadow
              />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='password' value='Your password' />
              </div>
              <TextInput name='password' id='password' type='password' onChange={handleChange} required shadow />
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='repeatPassword' value='Repeat password' />
              </div>
              <TextInput
                name='repeatPassword'
                id='repeatPassword'
                type='password'
                onChange={handleChange}
                required
                shadow
              />
            </div>
            <Button type='submit' className='bg-gradient-to-r from-violet-600 to-indigo-600' outline disabled={loading}>
              {loading ? (
                <>
                  <Spinner className='mr-2' size='sm' />
                  <span>Loading...</span>
                </>
              ) : (
                'Register'
              )}
            </Button>

            <Oauth />
          </Form>
          <div className='flex justify-center'>
            <span>Already have an account?</span>
            <Link to='/login' className='text-blue-500'>
              Login here
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

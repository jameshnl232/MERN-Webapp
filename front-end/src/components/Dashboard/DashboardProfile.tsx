import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { Alert, Button, Modal, Spinner, TextInput } from 'flowbite-react'
import { app } from '../../firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { Form, Link, useNavigate } from 'react-router-dom'
import { deleteProfile, logoutProfile, updateProfile } from '../../redux/features/auth/auth.slices'
import { validateUpdateForm } from '../../utils/validation'
import showToast from '../../utils/toast'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import useTokenExpiry from '../../hooks/useTokenExpiry '

type Props = {
  className?: string
}

export default function DashboardProfile({ className }: Props) {
  const user = useAppSelector((state) => state.auth.user)
  const userId = useAppSelector((state) => state.auth.userId)
  const token = useAppSelector((state) => state.auth.token)
  const imageRef = React.useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null)
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [imageFileUploading, setImageFileUploading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: user?.username,
    email: user?.email,
    password: '',
    profileImage: user?.profileImage
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)

  const dispatch = useAppDispatch()

  //log out if token expires
  useTokenExpiry(token)

  useEffect(() => {
    if (profileImage) {
      uploadImage()
    }
  }, [profileImage])

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setErrors([])

    if (formData.username === user?.username && formData.email === user?.email && !formData.password && !profileImage) {
      setErrors(['No changes made!'])
      return
    }

    if (imageFileUploading) {
      return
    }

    const validationErrors = validateUpdateForm({
      email: formData.email,
      username: formData.username
    })
    setErrors(validationErrors)

    try {
      setLoading(true)
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          profileImage: formData.profileImage
        })
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors([data.message])
        setLoading(false)
      } else {
        showToast(data.message, 'success')
        dispatch(updateProfile(data.user))
        setLoading(false)
      }
    } catch (error) {
      setErrors(['An error occured, try again later!'])
    }
  }

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = null
    if (e.target.files) {
      file = e.target.files[0]
    }
    if (file) {
      setProfileImage(file)
      setLocalImageUrl(URL.createObjectURL(file))
    }
  }

  const uploadImage = async () => {
    setImageUploadError(null)
    setImageFileUploading(true)

    const storage = getStorage(app)

    const fileName = profileImage && ((new Date().getTime() + profileImage.name) as string)
    const storageRef = fileName && ref(storage, fileName)
    const uploadTask = storageRef && uploadBytesResumable(storageRef, profileImage)
    if (uploadTask) {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setImageUploadProgress(+progress.toFixed(0))
        },
        (error) => {
          setImageUploadError("Couldn't upload image (file must be of type image and less than 2MB")
          setImageUploadProgress(null)
          setLocalImageUrl(null)
          setProfileImage(null)
          setImageFileUploading(false)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLocalImageUrl(downloadURL)
            setFormData({ ...formData, profileImage: downloadURL })
            setImageUploadProgress(null)
            setImageFileUploading(false)
          })
        }
      )
    } else {
      setImageUploadError("Couldn't upload image! (file must be less than 2MB")
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) {
        setErrors([data.message])
      } else {
        showToast(data.message, 'success')
        dispatch(deleteProfile())
        return navigate('/')
      }
    } catch (error) {
      setErrors(['An error occured, try again later!'])
    }
  }

  const handleLogout = () => {
    dispatch(logoutProfile())
    navigate('/')
  }

  return (
    <div className={className}>
      <div className='mx-auto flex h-full max-w-lg flex-col gap-y-10 py-5'>
        <h2 className='text-center text-4xl font-bold sm:text-6xl'>Profile</h2>

        <Form className='flex flex-col items-center justify-center gap-5' noValidate onSubmit={handleSubmit}>
          <input
            type='file'
            id='profileImage'
            name='profileImage'
            accept='image/*'
            className='hidden'
            onChange={handleUploadImage}
            ref={imageRef}
          />
          <div
            onClick={() => imageRef.current?.click()}
            className='relative h-40 w-40 cursor-pointer overflow-hidden rounded-full bg-cover shadow-md shadow-gray-400'
          >
            {imageUploadProgress && (
              <CircularProgressbar
                value={imageUploadProgress}
                text={`${imageUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }
                }}
              />
            )}
            <img
              src={localImageUrl || user?.profileImage}
              alt={user?.username}
              className={`h-full w-full rounded-full border-8 border-gray-400 bg-cover bg-center ${imageUploadProgress && imageUploadProgress < 100 && 'opacity-60'} `}
            />
          </div>
          {imageUploadError && (
            <Alert className='w-[80%]' color='failure'>
              {imageUploadError}
            </Alert>
          )}

          <TextInput
            className='min-w-[80%]'
            name='username'
            type='text'
            id='username'
            defaultValue={user?.username}
            placeholder={user?.username}
            onChange={handleFormDataChange}
            required
          ></TextInput>
          <TextInput
            className='min-w-[80%]'
            name='email'
            type='email'
            id='email'
            defaultValue={user?.email}
            placeholder={user?.email}
            onChange={handleFormDataChange}
            required
          ></TextInput>
          <TextInput
            name='password'
            className='min-w-[80%]'
            type='password'
            id='password'
            placeholder='********'
            onChange={handleFormDataChange}
            required
          ></TextInput>
          <Button
            className='min-w-[80%] bg-gradient-to-r from-violet-600 to-indigo-600'
            type='submit'
            outline
            disabled={loading}
          >
            {' '}
            {loading ? (
              <>
                <Spinner className='mr-2' size='sm' />
                <span>Loading...</span>
              </>
            ) : (
              'Save changes'
            )}
          </Button>
          {
            user?.isAdmin && (
              <Link to='/create-post' className='min-w-[80%]'>
                <Button type='button' className='w-full bg-gradient-to-r from-sky-600 to-orange-600' outline  >
                  Create Post 
                </Button>
              </Link>
            )
          }

          <div className='flex min-w-[80%] justify-between text-red-600'>
            <span className='cursor-pointer' onClick={() => setShowModal(true)}>
              Delete account
            </span>
            <span className='cursor-pointer' onClick={handleLogout}>
              Log out
            </span>
          </div>
          {errors && errors.length > 0 ? (
            <Alert className='min-w-[80%]' color='failure'>
              {errors[0]}
            </Alert>
          ) : null}
        </Form>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteAccount}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

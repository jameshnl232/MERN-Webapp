import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../redux/store'
import { Alert, Button, FileInput, Spinner, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill-new'
import 'react-quill/dist/quill.snow.css'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../../firebase'
import showToast from '../../utils/toast'

import useTokenExpiry from '../../hooks/useTokenExpiry '

type Props = {}

type formDataType = {
  title: string
  category: string
  image: string
  content: string
}

export default function UpdatePost({}: Props) {
  const token = useAppSelector((state) => state.auth.token)
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const postId = params.id

  const [formData, setFormData] = useState<formDataType>({
    title: '',
    category: '',
    image: '',
    content: ''
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [_imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageUploadError, setImageUploadError] = useState<string | null>(null)
  const [_imageFileUploading, setImageFileUploading] = useState<boolean>(false)

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  //log out if token expires
  useTokenExpiry(token)

  //get post
  useEffect(() => {
    try {
      setLoading(true)
      fetch(`/api/post/posts?postId=${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.posts) {
            const post = data.posts[0]
            setFormData({
              title: post.title,
              category: post.category,
              image: post.image,
              content: post.content
            })
            setLoading(false)
            setErrors([])
          } else {
            setErrors(['Could not fetch post!'])
          }
        })
    } catch (err) {
      setErrors(['Could not fetch post!'])
    }
  }, [postId, token])

  // Function to handle image upload
  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = null
    if (e.target.files) {
      file = e.target.files[0]
    }
    if (file) {
      setProfileImage(file)
      setImageUrl(URL.createObjectURL(file))
    }
  }

  // Function to handle image submit to firebase storage
  const handleSubmitImage = async () => {
    try {
      if (!profileImage) {
        setImageUploadError('Please select an image to upload')
        return
      }

      setImageUploadError(null)
      setImageFileUploading(true)

      const storage = getStorage(app)

      const fileName = profileImage && ((new Date().getTime() + profileImage.name) as string)
      const storageRef = fileName && ref(storage, fileName)
      const uploadTask = storageRef && uploadBytesResumable(storageRef, profileImage)
      if (uploadTask) {
        uploadTask.on(
          'state_changed',
          (_snapshot) => {},
          (_error) => {
            setImageUrl(null)
            setProfileImage(null)
            setImageUploadError("Couldn't upload image (file must be of type image and less than 2MB")
            setImageFileUploading(false)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageUrl(downloadURL)
              setFormData({ ...formData, image: downloadURL })
              setImageFileUploading(false)
              showToast('Image uploaded successfully!', 'success')
            })
          }
        )
      } else {
        setImageUploadError("Couldn't upload image! (file must be less than 2MB")
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (loading) {
    return <p className='text-center'>Loading...</p>
  }

  if (errors.length > 0) {
    return <p className='text-center'>{errors[0]}</p>
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await fetch(`/api/post/update/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        setLoading(false)
        setErrors([])
        showToast('Post updated successfully!', 'success')
        navigate(`/post/${data.post.slug}`)
      } else {
        setLoading(false)
        setErrors([data.message])
      }
    } catch (err) {
      setLoading(false)
      setErrors(['Could not update post!'])
    }
  }

  return (
    <>
      <div className='mx-auto h-screen min-h-screen max-w-3xl p-3'>
        <h1 className='my-7 text-center text-3xl font-semibold dark:text-gray-100'>Update a post</h1>
        <form className='flex h-[80%] flex-col gap-4' onSubmit={handleSubmit} noValidate>
          <div className='flex flex-col justify-between gap-4 sm:flex-row'>
            <TextInput
              type='text'
              placeholder='Title'
              required
              id='title'
              className='flex-1'
              defaultValue={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextInput
              type='text'
              placeholder='Category'
              required
              id='category'
              className='flex-1'
              defaultValue={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div className='flex items-center justify-between gap-4 border-4 border-dotted border-teal-500 p-3'>
            <FileInput accept='image/*' onChange={handleUploadImage} />
            <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleSubmitImage}>
              Upload image
            </Button>
          </div>
          {formData.image && <img src={formData.image} alt='image' className='h-40 w-full rounded-lg object-cover' />}
          {imageUploadError && (
            <Alert className='w-[80%]' color='failure'>
              {imageUploadError}
            </Alert>
          )}

          <ReactQuill
            value={formData.content}
            theme='snow'
            className='h-full overflow-y-auto dark:text-gray-100'
            placeholder='Write a blog'
            onChange={(value) => setFormData({ ...formData, content: value })}
          />

          <Button type='submit' gradientDuoTone='purpleToBlue' size='md'>
            {loading ? (
              <>
                <Spinner className='mr-2' size='sm' />
                <span>Loading...</span>
              </>
            ) : (
              'Update Post'
            )}
          </Button>
          {errors && errors.length > 0 ? (
            <Alert className='w-full' color='failure'>
              {errors[0]}
            </Alert>
          ) : null}
        </form>
      </div>
    </>
  )
}

import { toast } from 'react-toastify'

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default'
const showToast = (message: string, type: ToastType) => {
  const toastConfig = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light'
  } as {
    position: 'top-center'
    autoClose: number
    hideProgressBar: boolean
    closeOnClick: boolean
    pauseOnHover: boolean
    draggable: boolean
    progress: undefined
    theme: 'light'
  }

  switch (type) {
    case 'success':
      toast.success(message, toastConfig)
      break
    case 'error':
      toast.error(message, toastConfig)
      break
    case 'info':
      toast.info(message, toastConfig)
      break
    case 'warning':
      toast.warning(message, toastConfig)
      break
    case 'default':
      toast(message, toastConfig)
      break
    default:
      toast(message, toastConfig)
  }
}

export default showToast

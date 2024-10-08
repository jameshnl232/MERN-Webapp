import { useRouteError } from 'react-router-dom'

type ErrorResponse = {
  status: number
  data: string
  statusText: string
}

export default function ErrorPage() {
  const error = useRouteError() as ErrorResponse
  console.error(error)

  return (
    <div className='flex min-h-screen items-center justify-center text-center text-2xl'>
      <div className='flex-col font-semibold'>
        <h1 className='py-10 text-4xl'>Opps!</h1>
        <p className='py-10'>Sorry, an unexpected error has occured.</p>
        <i>{error.status}</i>
        <p>{error.statusText}</p>
      </div>
    </div>
  )
}

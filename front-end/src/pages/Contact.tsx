import { FaGithub } from 'react-icons/fa'
import { FaLinkedin } from 'react-icons/fa'
import { BiLogoGmail } from 'react-icons/bi'

export default function Contact() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='min-h-[30rem] min-w-[20rem] rounded-lg bg-gray-300/50 p-8 text-center shadow-md dark:bg-gray-300 dark:text-gray-800 dark:backdrop-blur-xl'>
        <h1 className='mb-4 text-4xl font-bold text-gray-800'>Contact me</h1>
        <ul className='flex flex-col justify-center gap-4 text-2xl'>
          <li className='flex items-center justify-center'>
            <a href='mailto: luongpower232@gmail.com' className='flex items-center gap-2'>
              <span> luongpower232@gmail.com </span>
              <BiLogoGmail />
            </a>
          </li>
          <li className='flex items-center justify-center'>
            <a href='https://github.com/jameshnl232' className='flex items-center gap-2'>
              <span>Github </span>
              <FaGithub />
            </a>
          </li>
          <li className='flex items-center justify-center'>
            <a href='https://www.linkedin.com/in/luong-hoang-ba2aa127b' className='flex items-center gap-2'>
              <span>Linkedin </span>
              <FaLinkedin />
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

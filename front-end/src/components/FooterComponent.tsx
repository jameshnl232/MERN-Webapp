import { Footer } from 'flowbite-react'
import { BsLinkedin, BsFacebook, BsGithub, BsInstagram, BsTwitter } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import Luong from '~/assets/Luong.png'

export function FooterComponent() {
  return (
    <Footer
      container
      className='rounded-b-none rounded-t-3xl border border-t-8 border-sky-800 bg-gray-200 dark:rounded-none dark:bg-black'
    >
      <div className='w-full'>
        <div className='grid w-full justify-between md:flex md:grid-cols-1 md:justify-between lg:grid-cols-2'>
          <div>
            <Link to='/' className='self-center whitespace-nowrap text-sm font-bold dark:text-white sm:text-xl'>
              <div className='mb-5 flex items-center justify-center gap-x-5'>
                <div className='h-full w-full'>
                  <img src={Luong} className='h-full w-full rounded-2xl' alt='Luong' />
                </div>
                <div className='flex h-full w-full items-start justify-center text-3xl sm:text-6xl md:text-4xl'>
                  <span className='rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-2'>Luong's </span>
                  <span className='text-blue-500'>Blog</span>
                </div>
              </div>
            </Link>
          </div>
          <div className='flex justify-center'>
            <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6'>
              <div>
                <Footer.Title title='about' />
                <Footer.LinkGroup col>
                  <Footer.Link href='/about'>About this blog</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title='Follow me' />
                <Footer.LinkGroup col>
                  <Footer.Link href='https://github.com/jameshnl232'>Github</Footer.Link>
                  <Footer.Link href='www.linkedin.com/in/luong-hoang-ba2aa127b'>Linkedin</Footer.Link>
                </Footer.LinkGroup>
              </div>
              <div>
                <Footer.Title title='Legal' />
                <Footer.LinkGroup col>
                  <Footer.Link href='#'>Privacy Policy</Footer.Link>
                  <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
                </Footer.LinkGroup>
              </div>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright href='#' by={`Luong's blog`} year={2024} />
          <div className='mt-4 flex space-x-6 sm:mt-0 sm:justify-center'>
            <Footer.Icon href='#' icon={BsFacebook} />
            <Footer.Icon href='https://www.instagram.com/dumpybird/' icon={BsInstagram} />
            <Footer.Icon href='https://x.com/dumpybird232' icon={BsTwitter} />
            <Footer.Icon href='https://github.com/jameshnl232' icon={BsGithub} />
            <Footer.Icon href='https://www.linkedin.com/in/luong-hoang-ba2aa127b' icon={BsLinkedin} />
          </div>
        </div>
      </div>
    </Footer>
  )
}

import { Outlet } from 'react-router-dom'
import Header from './components/Header'
import { FooterComponent } from './components/FooterComponent'
import ScrollToTop from './components/ScrollToTop'

export default function Root() {
  return (
    <>
      {/* Navigation */}
      <ScrollToTop />

      <Header />
      <main className='h-full w-full dark:bg-gray-950'>
        <Outlet />
      </main>
      <FooterComponent />
    </>
  )
}

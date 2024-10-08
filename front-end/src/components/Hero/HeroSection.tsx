import { View } from '@react-three/drei'
import { TextSplitter } from '../../utils/TextSplitter'
import { Bounded } from './Bounded'
import Scene from './Scene'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useStore } from '../../hooks/useStore'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import ViewCanvas from './ViewCanvas'

gsap.registerPlugin(useGSAP)

export default function HeroSection() {
  const ready = useStore((state) => state.ready)
  const onComputer = useMediaQuery('(min-width: 768px)', true)

  useGSAP(() => {
    if (!ready && onComputer) return

    const introTl = gsap.timeline({
      defaults: {
        duration: 1.5,
        ease: 'power4.out'
      }
    })

    introTl
      .set('.hero', { opacity: 1 })
      .from('.hero-header-word', { y: 100, opacity: 0, stagger: 0.2, duration: 1.5, delay: 1, ease: 'power4.out' }, 0)
      .from(
        '.text-side-heading .split-char',
        {
          scale: 1.3,
          y: 40,
          rotate: 25,
          opacity: 0,
          stagger: 0.05,
          ease: 'back.out(3)',
          duration: 0.5
        },
        '<+=1'
      )
      .from('.text-side-body', {
        opacity: 0,
        y: 20
      })
  }, [ready, onComputer])

  return (
    <Bounded className='hero relative mx-auto w-screen bg-pink-300 dark:bg-gray-950'>
      {onComputer && (
        <View className='hero-scene translate-x-50 translate-y-50 absolute right-0 top-0 hidden h-screen w-screen indent-1 md:block'>
          <Scene />
        </View>
      )}

      <div className='grid'>
        <ViewCanvas />

        <div className='grid h-screen items-center justify-center lg:items-end lg:justify-end'>
          <div className='grid items-center justify-center gap-y-2'>
            <h1 className='hero-header z-[80] font-oswald text-8xl font-black uppercase leading-[1] max-sm:inline-flex max-sm:flex-wrap md:text-[7rem] lg:text-[8rem]'>
              <TextSplitter className='hero-header-word  text-gray-900 dark:text-gray-100' text='Welcome to my blog'></TextSplitter>
            </h1>
          </div>

          <div className='text-side relative z-[80] grid h-full grid-cols-1 items-start justify-center gap-4 md:grid-cols-2 lg:items-center'>
            <div className='pl-2'>
              <div className='h2 text-side-heading text-balance text-5xl font-black uppercase text-pink-950 dark:text-yellow-300 lg:text-7xl'>
                <TextSplitter text='Where I share my thoughts'></TextSplitter>
              </div>
              <div className='text-side-body max-width-xl mt-4 text-balance font-oswald text-xl font-semibold text-gray-700 dark:text-gray-200 '>
                Hi there! I'm thrilled to have you here. This blog is a reflection of my journey—both in life and in
                tech. Whether it's sharing personal experiences, diving into the world of development, or discussing the
                latest tools and projects I’m working on, you’ll find a mix of everything that excites me!
              </div>
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  )
}

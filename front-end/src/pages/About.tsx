export default function About() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4'>
      <div className='max-w-3xl rounded-lg bg-gray-300/50 p-8 text-center shadow-md dark:bg-gray-300 dark:text-gray-800 dark:backdrop-blur-xl'>
        <h1 className='mb-4 text-4xl font-bold text-gray-800'>About This Blog</h1>
        <p className='mb-6 text-lg'>
          Hi there! I'm <span className='font-semibold text-cyan-600'>Luong</span>, and I'm thrilled to have you here.
          This blog is a reflection of my journey—both in life and in tech. Whether it's sharing personal experiences,
          diving into the world of development, or discussing the latest tools and projects I’m working on, you’ll find
          a mix of everything that excites me!
        </p>
        <p className='text-lg italic text-gray-600'>
          Stay a while, explore, and hopefully, you'll find something that resonates with you. Thanks for visiting, and
          I hope you enjoy the content!
        </p>
      </div>
    </div>
  )
}

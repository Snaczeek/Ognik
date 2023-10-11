import React from 'react'
import Header from '../components/Header'

export const HomePage = () => {
  return (
    
    <div id='main-app'>
      <Header />
      <div id=''>
      <div className='bg-gray-700'>
    <h1 className='font-bold text-4xl text-center p-8'>What is it for?</h1>
    <p className='pr-32 pl-32 text-center pb-12 text-lg'>The main purpose of Ognik is to provide a convenient environment for communication with friends. The application offers a range of features, such as sending messages, sharing files, adding friends, and real-time video conversations.</p>
</div>
<div className='bg-gray-600'>
    <h1 className='font-bold text-4xl text-center p-8'>Why was it created?</h1>
    <p className='pr-32 pl-32 text-center pb-12 text-lg'>I created Ognik to showcase my skills as a web app developer in terms of backend development, database management, and the implementation of secure authentication systems. I believe that Ognik perfectly reflects my passions and abilities, as well as my ability to create robust and scalable web applications.</p>
</div>
<div className='bg-gray-700'>
    <h1 className='font-bold text-4xl text-center p-8'>Technologies Used</h1>
    <p className='pr-32 pl-32 text-center pb-12 text-lg'>The application uses technologies such as Django as the backend, Django Rest Framework, Django Rest Framework Simple JWT for authentication, React.js as the frontend, WebSockets with Django Channels for real-time communication, and WebRTC for peer-to-peer video calls. You can find the source code on my GitHub <a href='https://github.com/Snaczeek/Ognik'>LINK</a>.</p>
</div>
<div className='bg-gray-600'>
    <h1 className='font-bold text-4xl text-center p-8'>Availability</h1>
    <p className='pr-32 pl-32 text-center pb-12 text-lg'>Please note that Ognik will be available until October 12th due to the expiration of free backend hosting on Google Cloud.</p>
</div>
      </div>
    </div>
  )
}

export default HomePage
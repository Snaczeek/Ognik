import React from 'react'
import Header from '../components/Header'

export const HomePage = () => {
  return (
    
    <div id='main-app'>
      <Header />
      <div className='text-slate-300'>
        <div className='bg-gray-700'>
            <h1 className='font-bold text-4xl text-center p-8'>What is it for?</h1>
            <p className='pr-32 pl-32 text-center pb-12 text-lg'>The main purpose of Ognik is to provide a convenient environment for communication with friends. The application offers a range of features, such as sending messages, sharing files, adding friends, and real-time video conversations.</p>
        </div>
        <div className='bg-gray-600'>
            <h1 className='font-bold text-4xl text-center p-8'>How to use it?</h1>
            <p className='pr-32 pl-32 text-center pb-12 text-lg'>Make sure that AdBlock is disabled, some adblockers will block WebSocket connection which is necessary for messaging and video calling, Make sure you have a connected microphone and webcam, and click on Login button and create an account.</p>
        </div>
        <div className='bg-gray-700'>
            <h1 className='font-bold text-4xl text-center p-8'>Technologies Used</h1>
            <p className='pr-32 pl-32 text-center pb-12 text-lg'>The application uses technologies such as Django as the backend, Django Rest Framework, Django Rest Framework Simple JWT for authentication, React.js as the frontend, WebSockets with Django Channels for real-time communication, and WebRTC for peer-to-peer video calls. You can find the source code on my GitHub <a href='https://github.com/Snaczeek/Ognik'>LINK</a>.</p>
        </div>
        <div className='bg-gray-600'>
            <h1 className='font-bold text-4xl text-center p-8'>Availability</h1>
            <p className='pr-32 pl-32 text-center pb-12 text-lg'>Please note that Ognik has limited disk space on AWS, messages will be removed after some time.</p>
        </div>
      </div>
    </div>
  )
}

export default HomePage
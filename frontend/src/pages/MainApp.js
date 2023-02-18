import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import FriendContext, {FriendProvider} from '../context/FriendContext'
import ChannelListContainer from '../components/ChannelListContainer'
import MainContainer from '../components/MainContainer'

const MainApp = () => {
 
  return (
    <div className='MainApp'>
      <FriendProvider>
          <ChannelListContainer />
          <MainContainer />
      </FriendProvider>
    </div>
  )
}

export default MainApp

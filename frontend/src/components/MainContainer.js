import React from 'react'
import MessageContainer from './MessageContainer'
import AddFriendContainer from './AddFriendContainer'
import FriendRequestListContainer from './FriendRequestListContainer'

import { Routes, Route } from 'react-router-dom'

const MainContainer = () => {
  
  return (
    <div className='main_container'>
      <Routes>
        <Route path="/friends/mcon/:username" element={<MessageContainer />} />
        <Route path="/friends/addFriend" element={<AddFriendContainer />} />
        <Route path="/friends/friendRequestList" element={<FriendRequestListContainer />} />
      </Routes>
    </div>
  )
}

export default MainContainer
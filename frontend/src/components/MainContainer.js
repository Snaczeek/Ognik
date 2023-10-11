import React, {useContext, useState, useEffect} from 'react'
import MessageContainer from './MessageContainer'
import AddFriendContainer from './AddFriendContainer'
import FriendRequestListContainer from './FriendRequestListContainer'

import { Routes, Route } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import FriendContext from '../context/FriendContext'
const MainContainer = () => {
  let {wsdata} = useContext(FriendContext)
  // let {WebSocket} = useContext(AuthContext)
  // let [messageWS, setMessageWS] = useState(null)

  // WebSocket.onmessage = function (e) {
  //   setMessageWS(e.data)
  // }
  // console.log("Main ws listener is working poggers")
  // console.log(messageWS)

  return (
    <div className='w-[85%] bg-gray-700'>
      <Routes>
        <Route path="/friends/mcon/:username" element={<MessageContainer asd={wsdata}/>} />
        <Route path="/friends/addFriend" element={<AddFriendContainer />} />
        <Route path="/friends/friendRequestList" element={<FriendRequestListContainer />} />
      </Routes>
    </div>
  )
}

export default MainContainer
import React from 'react'
import Sidebar from './Sidebar'
import FriendList from './FriendList'
import MainContainer from '../components/MainContainer'

import { Routes, Route } from 'react-router-dom'


export const ChannelListContainer = () => {
  return (
    <div className="inline-flex w-80 h-screen  bg-gray-800">
        <Sidebar />
        <Routes>
          <Route path="/friends/*" element={<FriendList />} />
        </Routes>
    </div>
  )
}

export default ChannelListContainer
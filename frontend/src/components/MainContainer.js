import React from 'react'
import MessageContainer from './MessageContainer'

import { Routes, Route } from 'react-router-dom'

const MainContainer = () => {
  return (
    <div className='main_container'>
        <Routes>
          <Route path="/friends/mcon/:username" element={<MessageContainer />} />
        </Routes>
    </div>
  )
}

export default MainContainer
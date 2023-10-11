import React, {useState, useEffect, useContext, createContext} from 'react'
import FriendContext from '../context/FriendContext'
import { Link } from 'react-router-dom';

const FriendListContext = createContext();

export const FriendList = () => {

    let {friends} = useContext(FriendContext)
    let i = 0

  return (
    <div className='w-[75%] overflow-y-auto scrollbar'>
      <Link to={"./addFriend"}><div className='add-friend-button'>Add Friend</div></Link>
      <div className='text-center p-4 text-gray-500'>Friends list</div>
      <div className=''>
        {friends.map(f => (
            <Link to={"./mcon/"+f} ><div key={i++}className='friend-container'>{f}</div></Link>
        ))}
      </div>
    </div>
  )
}

export default FriendList
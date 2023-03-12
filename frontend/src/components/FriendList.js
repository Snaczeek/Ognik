import React, {useState, useEffect, useContext, createContext} from 'react'
import FriendContext from '../context/FriendContext'
import { Link } from 'react-router-dom';

const FriendListContext = createContext();

export const FriendList = () => {

    let {friends} = useContext(FriendContext)
    let i = 0

  return (
    <div className='friends_list'>
      <Link to={"./addFriend"}><div className='add_friend_div'>Add Friend</div></Link>
      <div className='friends_list_title'>Friends list</div>
        {friends.map(f => (
            <Link to={"./mcon/"+f} ><div key={i++}className='friends_elem'>{f}</div></Link>
        ))}
    </div>
  )
}

export default FriendList
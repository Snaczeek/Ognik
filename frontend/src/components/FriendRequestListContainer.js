import React, {useState, useEffect, useContext, Navigate} from 'react'
import AuthContext from '../context/AuthContext'
// import FriendContext from '../context/FriendContext'
import configData from '../config.json'

const FriendRequestListContainer = () => {

  let [friendRequest, setfriendRequest] = useState([])
  let { WebSocket, authToken} = useContext(AuthContext) 
  
    // WebSocket.onmessage = function (e) {
    //     let data = JSON.parse(e.data)
    //     if(data.type == "friendRequest")
    //     {
    //         setTimeout(() => {
    //             getFriendRequest()
    //           }, 100);
    //     }
    //     // console.log(WSdata)
    // }

  let getFriendRequest = async () => {
    let response = await fetch(configData.BACKEND_URL+'users/friendrequest/getFriendRequest', {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      },
    })
    let data = await response.json()
    console.log(data)
    setfriendRequest(data)
  }

  let acceptFriendRequest = async (username) => {
    let response = await fetch(configData.BACKEND_URL+'users/friendrequest/acceptFriendRequest/' + username, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      },
    })
    window.location.reload()
    WebSocket.send(JSON.stringify({
      'friendName': username,
      'type': 'friend_request',
  }))
  }

  let declineFriendRequest = async (username) => {
    let response = await fetch(configData.BACKEND_URL+'users/friendrequest/declineFriendRequest/' + username, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      },
    })
    getFriendRequest()
  }

  useEffect(() => {
    getFriendRequest()
  }, [])

  return (
    <div className='friendrequest_container flex-col flex-grow'>
        <h1 className='text-3xl font-semibold text-[#d9e0eb] border-b-2 border-gray-900 p-4'>Your friend requests are here!</h1>
        <div className='overflow-y-scroll flex-grow scrollbar'>
          {friendRequest.map(r => (
            <div className='friend_request_elem w-full'>
                <p1 className='font-semibold'>{r.sender["username"]}</p1>
                <div className='ml-auto flex left-0'>
                  <button className='friend-request-elem-buttons bg-green-600 hover:bg-green-500 transition-all duration-150' onClick={() => acceptFriendRequest(r.sender["username"])}>Accept</button>
                  <button className='friend-request-elem-buttons bg-red-600 hover:bg-red-500 transition-all duration-150'onClick={() => declineFriendRequest(r.sender["username"])}>Decline</button>
                </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default FriendRequestListContainer
import React, {useState, useEffect, useContext, Navigate} from 'react'
import AuthContext from '../context/AuthContext'
// import FriendContext from '../context/FriendContext'

const FriendRequestListContainer = () => {

  let [friendRequest, setfriendRequest] = useState([])
  let { WebSocket, authToken} = useContext(AuthContext) 
  
    WebSocket.onmessage = function (e) {
        let data = JSON.parse(e.data)
        if(data.type == "friendRequest")
        {
            setTimeout(() => {
                getFriendRequest()
              }, 100);
        }
    }

  let getFriendRequest = async () => {
    let response = await fetch('http://localhost:8000/users/friendrequest/getFriendRequest', {
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
    let response = await fetch('http://localhost:8000/users/friendrequest/acceptFriendRequest/' + username, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      },
    })
    window.location.reload()
  }

  let declineFriendRequest = async (username) => {
    let response = await fetch('http://localhost:8000/users/friendrequest/declineFriendRequest/' + username, {
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
    <div className='friendrequest_container'>
        <text>Your friend requests are here!</text>
        {friendRequest.map(r => (
          <div className='friend_request_containers'>
              <p1>{r.sender["username"]}</p1>
              <button onClick={() => acceptFriendRequest(r.sender["username"])}>Accept</button>
              <button onClick={() => declineFriendRequest(r.sender["username"])}>Decline</button>
          </div>
        ))}
    </div>
  )
}

export default FriendRequestListContainer
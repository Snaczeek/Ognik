import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import FriendContext from '../context/FriendContext'

const AddFriendContainer = () => {

    let [users, setUsers] = useState([])
    let { WebSocket, authToken} = useContext(AuthContext)
    let {friends} = useContext(FriendContext)
    // friend_search
    let getUesrs = async (e) => {
        e.preventDefault();
        // alert(document.getElementById('friend_search').value);
        let username = document.getElementById('friend_search').value
        let response = await fetch('http://localhost:8000/users/friendrequest/getUsers/'+ username, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authToken.access)
            },
        })
        let data = await response.json()
        setUsers(data)
        console.log(Object.keys(data))
        if (Object.keys(data).length === 0){
            // console.log("worky")
            document.getElementById("friend_text").innerHTML = "Account not found"
        } 
        else{
            document.getElementById("friend_text").innerHTML = ""
        }
    }

    let sendFriendRequest = async (username) => {
        // ToDo Send Friend request using http post and websocket
        alert(username)

        //  friendrequest/sendFriendRequest/<str:friendName>
        let response = await fetch('http://localhost:8000/users/friendrequest/sendFriendRequest/'+ username, {
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authToken.access)
            },
        })
        let data = await response.json()
        console.log(data.status)
        if (data.status === "already exist"){
            alert("Friend request was already sended")
        }
        else
        {
            // Sending message to websocket (so that receivee can see friend request apear in real time)
            WebSocket.send(JSON.stringify({
                'friendName': username,
                'type': 'friend_request',
            }))
        }
    }


  return (
    <div className='friendadd_container'>
        <div className='friend_header_container'>
            <h1>You can add friends by searching their username</h1> <br/>
            <form onSubmit={getUesrs} className="friend_search" autoComplete="off"> 
                <input type="text" id="friend_search" placeholder="username"/>
                <button type="submit">Search</button>
            </form>
        </div>
            
        <ul className="friendadd_list">
            {/* <p1 id="friend_text">Looking for a friend?</p1> */}
            {users.map(user => (
                <div className="friend_container">
                    <text className='friend_container_username'>{user.username}</text>
                    {friends.includes(user.username) ? (
                        <text className="friend_container_UFWTP">You're friends with this person</text>
                    ): (
                        <button onClick={() => sendFriendRequest(user.username)}>Send Friend Request</button>
                    )}
                    
                </div>
            ))}
        </ul>
    </div>
  )
}

export default AddFriendContainer
import React, {useState, useEffect, useContext}  from 'react'
import {  useParams } from "react-router-dom";
import AuthContext from '../context/AuthContext'


const MessageContainer = () => {
  let { username } = useParams();
  let string = username.toString()

  let [messages, setMessages] = useState([])
  let {authToken, logoutUser} = useContext(AuthContext)

  // functions 'useEffect()' trigges on the first load 
  useEffect(() => {
    getMessages()
  }, [])

  function refreshPage() {
    window.location.reload(false);
  }

  // getting messages form django backend
  let getMessages = async () => {
    let respone = await fetch('http://localhost:8000/users/rooms/'+string, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      }
    }, [])

    let data = await respone.json()
    console.log(data)
    setMessages(data)
  }

  return (
    <div className='message_container'>
      <h1 onClick={refreshPage}>{username}</h1>
      <ul>
        {messages.map(f => (
            <div key={f.id}className='friends_elem'>{f.user.username}: {f.body}</div>
        ))}
      </ul>
      <div className='message_text_input'>
        <input type="text"></input>
        <button>Send</button>
      </div>
      
    </div>
  )
}

export default MessageContainer

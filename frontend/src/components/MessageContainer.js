import React, {useState, useEffect, useContext}  from 'react'
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import {  useParams } from "react-router-dom";
import AuthContext from '../context/AuthContext'


const MessageContainer = () => {
  let { username } = useParams();
  let string = username.toString()

  let [messages, setMessages] = useState([])
  let { WebSocket, authToken} = useContext(AuthContext)
  
  // functions 'useEffect()' trigges on the first load
  // and every time 'username' is updated 
  useEffect(() => {
    // Connecting to django web socket 
    // Passing url with acces token for jwt auth
    getMessages()
    WebSocket.onopen = () => {
      console.log('WebSocket Client Connected');
    }
    // Listener for upcoming messages from django
    // I dont think async is required, but who knows 
    WebSocket.onmessage = function (e) {
      let data = JSON.parse(e.data)
      // Console logging messages for debugging
      console.log('Data:', data)
      // If user recives chat_update prompt and is from friend 
      // whos chatroom is open: update messages 
      if(data.type === 'chat_update' && data.friend === string){
        console.log('chat')
        // 100ms delay is required, for some bizarre reasons
        // if there is no delay, getMessages() works every 3rd time
        setTimeout(() => {
          getMessages()
        }, 100);
      }
    }
    
  }, [username])
  
  // Getting messages form django backend
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
  
  // Sending messages to djnago
  let sendMessage = async (e) => {
    e.preventDefault()
    // Sending message to websocket
    // And passing friend name from url
    WebSocket.send(JSON.stringify({
      'message': 'message was sent',
      'friendName': string,
    }))
    await fetch('http://localhost:8000/users/rooms/send/'+string, {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      }, 
      body:JSON.stringify(e.target.message.value)
    })
    document.getElementById('mess').value = ''
    
    getMessages()
  }


  setTimeout(() => {
      const input = document.getElementById("mess");
      input.focus();
    }, 10);

  return (
    <div className='message_container'>
      <h1>{username}</h1>
      <ul>
        {messages.map(f => (
            <div key={f.id}className='friends_elem'>{f.user.username}: {f.body}</div>
        ))}
      </ul>
      <div className='message_text_input'>
        <form onSubmit={sendMessage}>
          <input type="text" id='mess' name="message" />
          <button type="submit">Send</button>
        </form>
      </div>
      
    </div>
  )
}

export default MessageContainer

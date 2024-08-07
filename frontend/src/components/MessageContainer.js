import React, {useState, useEffect, useContext, useRef}  from 'react'
import {  useParams } from "react-router-dom";
import AuthContext from '../context/AuthContext'
import ConControls from './ConControls';
import ConTest from './ConTest'
import configData from '../config.json'
import { MdOutlineFileUpload } from "react-icons/md";

const MessageContainer = () => {
  let [messageRTC, setMessageRTC] = useState(null)
  
  // Getting username from URL
  let { username } = useParams();
  let string = username.toString()


  const containerRef = useRef(null)

  // Creating messages var 
  // Getting messages from session storage for current friend
  // If session storage doesnt have any values it means:
  // 1: Theres is no messages in current chatroom
  // 2: or it is first load of chatroom
  // in any cases above, chatroom will send to django getMessages request
  let [messages, setMessages] = useState([]) 
  
  let newestMessage = useRef({})
  let oldestMessage = useRef({})

  // CurrentMessages contains messages from every friend that were loaded in current session
  let currentMessages = useRef({})

  let { WebSocket, authToken, user} = useContext(AuthContext)
  
  // Initializint empty list
  let updates = []
  // Checking if key 'update' exist in session storage
  // If not:
  if (sessionStorage.getItem("Updates") == null)
  {
    // Creating Key with empty list as value
    sessionStorage.setItem("Updates", JSON.stringify(updates))
  } 
  // Updating list with current values from session storage
  // so that list is up to date
  updates = sessionStorage.getItem("Updates")

  // functions 'useEffect()' trigges on the first load
  // and every time 'username' is updated 
  useEffect(() => {
    

    if (!currentMessages.current[`${string}`])
    {
      currentMessages.current[`${string}`] = [];
    }

    // Checking if messages are empty
    if (currentMessages.current[`${string}`].length == 0)
    {
      // If so, sending to django reqeust for new messages from database
      getMessages(40, "321" ,1)
    }
    else if(updates.includes(username))
    {
      // If not and update list contains friend username
      // It means friend send to this user message
      // and message var needs to be updated 

      // Removing friend from update list
      removeFromStorage(username)
      // Getting new messages 
      // (In Future there should be update function that will only get new messages, instead getting all messages from current chatroom) DONE
      getMessages(20, newestMessage.current[`${string}`].created, 2)
    }
    else
    {
      // else it means there was no updates/messages sent
      // so setting messages from currentMessages ref, stored before
      setMessages(currentMessages.current[`${string}`])
    }

    // 
    const handleScroll = () => {
      if (containerRef.current.scrollTop === 0) {
        getMessages(40, oldestMessage.current[`${string}`].created, 3, 2)
      }
    };

    containerRef.current.addEventListener('scroll', handleScroll);

    return () => {
      if (containerRef.current){
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };

  }, [username])
  
  WebSocket.onclose = () => {
    console.log("Websocket Client Disconnected");
    // window.location.reload()
  }

  WebSocket.onopen = () => {
    console.log('WebSocket Client Connected');
    WebSocket.send(JSON.stringify({
      'message': 'friend is connected',
      'friendName': string,
      'type': 'message_update',
    }))
  }
  // Listener for upcoming messages from django
  // I dont think async is required, but who knows 
  WebSocket.onmessage = function (e) {
    let data = JSON.parse(e.data)
    // Console logging messages for debugging
    // console.log('Data:', data)
    // console.log(JSON.parse(e.data))
    if(data.type === 'friendRequest' && data.friend != user.username)
    {
      window.location.reload()
    }
    // If user recives chat_update prompt and is from a friend 
    // whos chatroom is open: update messages 
    if(data.type === 'chat_update' && data.friend === string){
      // console.log('chat')
      // 100ms delay is required, for some bizarre reasons
      // if there is no delay, getMessages() works every 3rd time
      setTimeout(() => {
        if (newestMessage.current[`${string}`])
        {
          getMessages(20, newestMessage.current[`${string}`].created, 2)
        }
        else
        {
          getMessages(10, "321" ,1)
        }
      }, 300);
      // setMessageRTC(data)
      // isCalling(true)
    }
    else if (!updates.includes(data.friend) && data.friend !== user.username)
    {
        // If friend sent you messages 
        // and that friends chatroom wasnt open
        // saving that friend username to update list 
        pushToStorage(data.friend);          
    }
    else //if(data.type === "init_call" && data.friend === string)
    {
      // console.log("Your friends is calling")
      setMessageRTC(data)
      // isCalling(true)
      // isFcall(true)
    }
  }
  // Getting messages form django backend
  let getMessages = async (count = 1, date = "1987-07-18T20:59:26.076557Z", mode = 1, mode2 = 1) => {
    let respone = await fetch(configData.BACKEND_URL+`users/rooms/${string}/${count}/${date}/${mode}`, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      }
    }, [])
    
    let data = await respone.json()
    // console.log(data)
    
    // console.log(currentMessages.current)
    // console.log(currentMessages.current[`${string}`])
    
    // Adding messages to currentMessage ref
    addToMessages(data, mode2)
    
    // 
    setMessages(currentMessages.current[`${string}`])
    // console.log("newest: " + newestMessage.current[`${string}`].created)
    // console.log("oldest: " + oldestMessage.current[`${string}`].created)
  }
  
  // Function that adds messages to storage and 
  // Keep track of newest and oldest messages
  let addToMessages = (data, mode = 1) => {
    
    // Adding new message/s to ref 
    // mode 1 adding ms at the beginning of the list
    // mode 2 adding ms at the end of the list
    if (mode == 1)
    {
      currentMessages.current[`${string}`] = [...currentMessages.current[string], ...data];
    }
    else if (mode == 2)
    {
      currentMessages.current[`${string}`] = [...data, ...currentMessages.current[string]];
    }
    
    newestMessage.current[`${string}`] = currentMessages.current[`${string}`][currentMessages.current[`${string}`].length - 1];
    oldestMessage.current[`${string}`] = currentMessages.current[`${string}`][0];
  }

  
  // Sending messages to djnago
  let sendMessage = async (e) => {
    e.preventDefault()
    // Sending message to websocket
    // And passing friend name from url
    await fetch(configData.BACKEND_URL+'users/rooms/send/'+string, {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      }, 
      body:JSON.stringify(e.target.message.value)
    })
    WebSocket.send(JSON.stringify({
      'message': 'message was sent',
      'friendName': string,
      'type': 'message_update',
    }))
    document.getElementById('mess').value = ''
    
    // Checking if message exist in chatroom
    if (newestMessage.current[`${string}`])
    {
      getMessages(20, newestMessage.current[`${string}`].created, 2)
    }
    else
    {
      getMessages(10, "321" ,1)
    }

  }

  let getCSRFToken = async () => {
    let response = await fetch(configData.BACKEND_URL+`users/get-csrf-token`, {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      }
    }, [])
    let data = await response.json()
    // console.log(data)
    return data.csrfToken;
  }

  let uploadFile = async (e) => {
    // Getting token as far as I know is not currently requierd
    const csrfToken = await getCSRFToken()
    // Getting file from html input
    const file = e.target.files[0];

    // Creating form object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('csrfmiddlewaretoken', csrfToken);

    try{
      let response = await fetch(configData.BACKEND_URL+'users/rooms/sendfile/'+string, {
        method: 'POST',
        headers:{
          // 'Content-Type':'multipart/form-data',
          'Authorization':'Bearer ' + String(authToken.access),
          'X-CSRFToken': csrfToken
          // 'Access-Control-Allow-Origin': 'origin-or-null / wildcard'
        }, 
        body: formData
      })
  
      document.getElementById('file_input').value = null
  
      if (!response.ok) {
        // Parse the JSON error message
        let errorData = await response.json();
        let errorMessage = errorData.error || "An error occurred";
        throw new Error(errorMessage);
      }
  
      WebSocket.send(JSON.stringify({
        'message': 'message was sent',
        'friendName': string,
        'type': 'message_update',
      }))
  
      getMessages(20, newestMessage.current[`${string}`].created, 2)
    } catch (error){
      console.error("Upload failed:", error.message);
      alert("Upload failed: " + error.message);
    }
  }

  let downloadFile = (id) => {
    window.open(configData.BACKEND_URL+`users/rooms/download/${id}/${authToken.access}`, '_blank').focus()
  }

  function pushToStorage(value)
  {
    // Getting values from storage
    let array = JSON.parse(sessionStorage.getItem("Updates"))
    // Adding value to array
    array.push(value)
    updates = array
    // Overwrites current session storage with new one
    sessionStorage.setItem("Updates", JSON.stringify(array))
  }

  function removeFromStorage(value)
  {
    // getting data from session storage 
    let array = JSON.parse(sessionStorage.getItem("Updates"))
    // Getting index value of passed value (param)
    let index = array.indexOf(value)
    // If value exist in list
    if (index > -1)
    {
      // Removing that value from list
      array.splice(index, 1)
    }
    // Updating 'update' list and saving it to session storage too 
    updates = array
    sessionStorage.setItem("Updates", JSON.stringify(array))
  }

  let FileLinkComponent = (message) => {
    return (
      <div className='chat-elem'>
        <div className='inline-flex'>
          {message.message.user.username}: <div className='file_elem' onClick={() => downloadFile(message.message.file.id) }>{message.message.file.fileName} {formatFileSize(message.message.file.fileSize)}</div>
        </div>
      </div>
    )
  }

  const formatFileSize = (size) => {
    if (size < 1024) {
        return size + ' B';
    } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(2) + ' KB';
    } else {
        return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
};

  function MessageForRender()
  {
    if (messages.length == 0)
    {
      return <div className='chat-no-msg'>No Messages with @{username}</div>
    }
    else
    {
      return( 
        messages.map(f => f.isIncludeFile === false ? (<div className='chat-elem' key={f.id}>{f.user.username}: {f.body}</div>) : (<FileLinkComponent message={f}/>))
      )
    }
  }
  return (
    <div className='message_container flex flex-col flex-grow'>
      <div className='message_container_ui'>
        {/* <ConControls data={messageRTC} /> */}
        <ConTest data={messageRTC}/>
      </div>
      <div className='message_container_chat '>
        <ul className='message_list scrollbar' ref={containerRef}>
          <MessageForRender />
        </ul>
        <div className='message_text_input'>
          <form onSubmit={sendMessage} autoComplete="off">
            <input type="text" id='mess' name="message" autoFocus placeholder='type here'/>
            <label id='message_text_input-file' >
              <input type="file" id="file_input" name="file" onChange={uploadFile}/>
              <MdOutlineFileUpload />               
            </label>
          </form>
        </div>
      </div>
      
    </div>
  )
}

export default MessageContainer

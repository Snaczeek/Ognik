import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'

const TestPage = () => {
  let [messages, setMessages] = useState([])
  let {authToken} = useContext(AuthContext)

  // functions 'useEffect()' trigges on the first load 
  useEffect(() => {
    getMessages()
  }, [])

  // getting messages form django backend
  let getMessages = async () => {
    let respone = await fetch('http://localhost:8000/users/messages/', {
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':'Bearer ' + String(authToken.access)
      }
    })

    let data = await respone.json()
    setMessages(data)
  }


  return (
    <div>
      <h1>You are logged in! poggers</h1>
      
      <ul>
        {messages.map(m => (
            <li key={m.id}>{m.body}</li>
        ))}
      </ul>

    </div>
  )
}

export default TestPage

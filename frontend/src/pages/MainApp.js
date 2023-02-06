import React, {useState, useEffect, useContext} from 'react'
import AuthContext from '../context/AuthContext'
import FriendContext, {FriendProvider} from '../context/FriendContext'
import ChannelListContainer from '../components/ChannelListContainer'
import MainContainer from '../components/MainContainer'


const MainApp = () => {
  // let [messages, setMessages] = useState([])
  // let {authToken, logoutUser} = useContext(AuthContext)

  // // functions 'useEffect()' trigges on the first load 
  // useEffect(() => {
  //   getMessages()
  // }, [])

  // // getting messages form django backend
  // let getMessages = async () => {
  //   let respone = await fetch('http://localhost:8000/users/messages/', {
  //     method: 'GET',
  //     headers:{
  //       'Content-Type':'application/json',
  //       'Authorization':'Bearer ' + String(authToken.access)
  //     }
  //   })

  //   let data = await respone.json()
  //   setMessages(data)
  // }

  return (
    <div className='MainApp'>
      <FriendProvider>
        <ChannelListContainer />
        <MainContainer />
      </FriendProvider>
    </div>
  )
}

export default MainApp

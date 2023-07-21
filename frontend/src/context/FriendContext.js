import React from 'react'
import { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'


const FriendContext = createContext();

export default FriendContext

export const FriendProvider = ({children}) => {
    let [friends, setFriends] = useState([])
    let {authToken, WebSocket} = useContext(AuthContext) 
    let [wsdata, setWsdata] = useState()  

    WebSocket.onmessage = (e) => {
        let data = JSON.parse(e.data)
        console.log(data)
        setWsdata(data)
        // console.log(wsdata)
        if(data.type === "friendRequest")
        {
            getFriends()
            window.location.reload()
        }
    }

    let getFriends = async () =>{
        let response = await fetch('https://ognik-backend.duckdns.org/users/friends/', {
            method: "GET",
            headers:{
                'Content-Type':'application/json',
                'Authorization':'Bearer ' + String(authToken.access)
            }
        })

        let data = await response.json()
        let new_data = []
        
        // pushing only username's to new array
        for (let i = 0; i < data[0].friends.length; i++) {
            // console.log("test: " + data[0].friends[i].username + " " + i);
            new_data.push(data[0].friends[i].username)
        }
        setFriends(new_data)
    }

    useEffect(() => {
        getFriends()
    }, [])

    let contextData = {
        friends:friends,
        wsdata:wsdata
    }

  return (
    <FriendContext.Provider value={contextData}>
        {children}
    </FriendContext.Provider>
  )
}

import React, { useContext, useEffect } from "react";
import HomeIcon from "../assets/home.png";
import LogoutIcon from "../assets/logout.png";
import FriendRequestIcon from "../assets/notification.png" ;
import AuthContext from "../context/AuthContext";

import { Link } from 'react-router-dom';


export const Sidebar = () => {

    let { WebSocket, logoutUser, authToken} = useContext(AuthContext)

    // nie wiem czemu ale nie działa 
    WebSocket.onmessage = (e) => {
        let data = JSON.parse(e.data)
        if(data.type === "friendRequest")
        {
            getFriendRequest()
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
        console.log(data.length)
        if (data.length !== 0)
        {
            console.log("Debug Show Red Dot")
            document.getElementById("red_circle").removeAttribute("hidden");
        }
        else
        {
            console.log("empty")
            document.getElementById("red_circle").setAttribute("hidden", "")
        }
      }

      useEffect(() => {
        getFriendRequest()
      }, [])

    return (
        <div className="sidebar">
            <div className="sidebar_home-icon">
                <div className="home-icon_inner">
                    <Link to="./friends"><img src={HomeIcon} alt="home" /></Link>
                </div>
            </div>
            <div className="sidebar_FriendRequestIcon-icon">
                <div className="home-icon_inner">
                    <Link to="./friends/friendRequestList"><img src={FriendRequestIcon} alt="friend_request"  /></Link>
                </div>
                <div className="red_circle" hidden id="red_circle"></div>
            </div>
            <div className="sidebar_logout-icon">
                <div className="logout-icon_inner">
                    <img onClick={logoutUser} src={LogoutIcon} alt="home" width={30}/>
                </div>
            </div>
        </div>
  )
}

export default Sidebar;
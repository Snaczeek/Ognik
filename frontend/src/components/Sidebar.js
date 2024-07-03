import React, { useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { AiFillFire, AiOutlineUserAdd, AiOutlineLogout } from "react-icons/ai";
import configData from "../config.json"

import { Link } from 'react-router-dom';


export const Sidebar = () => {

    let { WebSocket, logoutUser, authToken} = useContext(AuthContext)

    WebSocket.onmessage = (e) => {
        let data = JSON.parse(e.data)
        // console.log(data)
        if(data.type === "friendRequest")
        {
            getFriendRequest()
            window.location.reload()
        }
    }

    let getFriendRequest = async () => {
        let response = await fetch(configData.BACKEND_URL+'users/friendrequest/getFriendRequest', {
          method: 'GET',
          headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + String(authToken.access)
          },
        })
        let data = await response.json()
        // console.log(data.length)
        if (data.length !== 0)
        {
            // console.log("Debug Show Red Dot")
            document.getElementById("red_circle").removeAttribute("hidden");
        }
        else
        {
            // console.log("empty")
            document.getElementById("red_circle").setAttribute("hidden", "")
        }
      }

      useEffect(() => {
        getFriendRequest()
      }, [])

      let exit = async () => {
        logoutUser()
        // const delay = ms => new Promise(
        //     resolve => setTimeout(resolve, ms)
        // );
        // await delay(1000)
        // window.location.reload()
        
      }

    return (
        <div className="sidebar">
            <div className="sidebar-icon group">
                <Link to="./friends"><AiFillFire size="48"/></Link>
                <span className="sidebar-tooltip group-hover:scale-100">Home</span>
            </div>
            <div className="sidebar-icon group">
                <Link to="./friends/friendRequestList"><AiOutlineUserAdd size="48"/></Link>
                <span className="sidebar-tooltip group-hover:scale-100">Friend requests</span>
                <div className="red-dot" hidden id="red_circle"></div>
            </div>
            <div className="sidebar-icon group">
                <AiOutlineLogout size="48" onClick={exit}/>
                <span className="sidebar-tooltip group-hover:scale-100">Logout</span>
            </div>
        </div>
  )
}

export default Sidebar;
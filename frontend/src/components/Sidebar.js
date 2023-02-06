import React, { useContext } from "react";
import HomeIcon from "../assets/home.png";
import LogoutIcon from "../assets/logout.png";
import AuthContext from "../context/AuthContext";

import { Link } from 'react-router-dom';


export const Sidebar = () => {
    let {logoutUser} = useContext(AuthContext)
    return (
        <div className="sidebar">
            <div className="sidebar_home-icon">
                <div className="home-icon_inner">
                    <Link to="./friends"><img src={HomeIcon} alt="home" /></Link>
                </div>
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
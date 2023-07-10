import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div className='header'>
        <Link to="/">Ognik</Link>
        <a>About</a>
        <a>Github</a>
        {user ? (
          <div id='header-login-button'><button><Link to="/test/friends">Open ognik</Link></button></div>
          ): (
            <div id='header-login-button'><Link to="/login"><button>Login</button></Link> </div>
            )}

        {/* {user && <h1>Hello {user.username}</h1>} */}
        {/* <Link to="/register">Register</Link> */}
    </div>
  )
}

export default Header

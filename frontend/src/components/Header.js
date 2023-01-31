import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div className='header'>
        <Link to="/">Home</Link>
        <Link to="/test">test</Link>
        {user ? (
          <button onClick={logoutUser}>Logout</button>
          ): (
            <Link to="/login"><button>Login</button></Link>
            )}

        {user && <h1>Hello {user.username}</h1>}
    </div>
  )
}

export default Header

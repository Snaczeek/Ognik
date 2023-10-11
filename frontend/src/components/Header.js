import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Header = () => {
  let {user, logoutUser} = useContext(AuthContext)
  return (
    <div className='bg-neutral-900 flex h-auto pl-28 pr-28 pt-5 pb-5 text-white'>
        <Link to="/" className='pl-3 pr-3 pt-1 hover:underline'>Ognik</Link>
        {/* <a className='pl-3 pr-3 pt-1'>About</a> */}
        <a className='pl-3 pr-3 pt-1 hover:underline' href='https://github.com/Snaczeek/Ognik'>Github</a>
        {user ? (
          <div className='ml-auto'><button className='header-button'><Link to="/test/friends">Open ognik</Link></button></div>
          ): (
            <div className='ml-auto'><Link to="/login"><button className='header-button'>Login</button></Link> </div>
            )}

        {/* {user && <h1>Hello {user.username}</h1>} */}
        {/* <Link to="/register">Register</Link> */}
    </div>
  )
}

export default Header

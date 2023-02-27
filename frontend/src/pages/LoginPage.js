// import HomePageCSS from "./../styles/Home.module.css";
import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext)
  return (
    <div>
      {/* login form */}
      <form onSubmit={loginUser}>
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
        <input type="submit" />
      </form>
    </div>
  )
}

export default LoginPage

import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
  return (
    <div id='login-page'>
        <div className='island-container'>
          <form onSubmit={loginUser} id='login-form'>
            <div className='login-form-input-container'>
              <label>username</label>
              <input type="text" name="username" placeholder="username" id='login-username'/>
            </div>

            <div className='login-form-input-container'>
              <label>password</label>
              <input type="password" name="password" placeholder="password" id='login-password'/>
            </div> 
            <p className='login-error-message'></p>
            <button>LOGIN</button>
            <p id='login-page-register-link'>Don't have an account yet? <Link to='/register' id='login-reg-link'>Register now</Link></p>
          </form>
        </div>
    </div>
  )
}

export default LoginPage

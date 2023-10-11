import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
  return (
    <div className='login-bg' id=''>
        <div className='login-island'>
          <form onSubmit={loginUser} id='' className='flex flex-col w-full'>
            <p className='text-center text-3xl font-bold tracking-wide mb-6 text-white'>Login</p>
            <div className='mb-5'>
              <label className='login-text'>username</label><br></br>
              <input type="text" name="username" placeholder="username" id='login-username' className='login-input'/>
            </div>

            <div className='mb-5'>
              <label className='login-text'>password</label><br></br>
              <input type="password" name="password" placeholder="password" id='login-password' className='login-input'/>
            </div> 

            <p className='login-error-message'></p>

            <button className='login-button'>LOGIN</button>

            <p className='mt-2 text-gray-400'>Don't have an account yet? <Link to='/register' id='' className='text-orange-700 hover:text-orange-500 transition-all duration-200'>Register now</Link></p>
          </form>
        </div>
    </div>
  )
}

export default LoginPage

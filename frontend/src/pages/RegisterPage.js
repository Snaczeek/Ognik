import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import configData from '../config.json'

const RegisterPage = () => {
    let {loginUser} = useContext(AuthContext)
    let register = async (e) => {
        e.preventDefault()
        // Getting input html objects
        let email = e.target.email
        let nickname = e.target.username
        let password = e.target.password
        let confirmPassword = e.target.confirmPassword
        
        // Getting html error objects
        const emailError = document.getElementById("error-email-input")
        const usernameError = document.getElementById("error-username-input")
        const passwordError = document.getElementById("error-password-input")
        const confirmPasswordError = document.getElementById("error-confirm-password-input")

        const formData = {
            username: e.target.username.value,
            password: e.target.password.value,
            email: e.target.email.value,
        }

        // Reseting error 
        email.style.borderStyle = "none"
        nickname.style.borderStyle = "none"
        password.style.borderStyle = "none"
        confirmPassword.style.borderStyle = "none"

        emailError.innerHTML = ""
        usernameError.innerHTML = ""
        confirmPasswordError.innerHTML = ""

        // Regex for checking email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        

        // Incorrect email
        if (!regex.test(email.value))
        {
            alert("incorrect email")
            email.style.borderStyle = "solid"
            email.style.borderColor = "red"
            emailError.innerHTML = "Incorrect email"
            return
        }

        // Incorrect password confirm
        if (password.value != confirmPassword.value)
        {
            alert("confirm password doesn't match up")
            password.style.borderStyle = "solid"
            confirmPassword.style.borderStyle = "solid"
            password.style.borderColor = "red"
            confirmPassword.style.borderColor = "red"
            confirmPasswordError.innerHTML = "Passwords doesn't match"
            return
        }

        let response = await fetch(configData.BACKEND_URL+'users/register', {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
        })
        let data = await response.json()

        // Incorrect Username
        if (data.error == "Username already exists")
        {
            alert("Username is already taken")
            nickname.style.borderStyle = "solid"
            nickname.style.borderColor = "red"
            usernameError.innerHTML = "Username is already taken"
            return
        }

        if (data.error == "Username is too long")
        {
            nickname.style.borderStyle = "solid"
            nickname.style.borderColor = "red"
            usernameError.innerHTML = "Username is to long"
            return
        }
        loginUser(e)
    }

  return (
    <div className='login-bg'>
        <div className='register-island'>
            <form onSubmit={register} autoComplete='off' id='register-form' className='flex flex-col w-full'>
                <p className='text-center font-bold text-white text-3xl'>Register</p>
                <div className='mb-3'>
                    <label className='login-text'>E-mail</label> <br/>
                    <input type="text" id='register-email' name='email' className='login-input' placeholder='e-mail'/> <br/>
                    <p id='error-email-input' className='login-error-message'></p>
                </div>

                <div className='mb-3'> 
                    <label className='login-text'>Username</label> <br/>
                    <input type="text" id='register-nickname' name='username' className='login-input' placeholder='username'/> <br/>
                    <p id='error-username-input' className='login-error-message'></p>
                </div>

                <div className='mb-3'>
                    <label className='login-text'>Password</label> <br/>
                    <input type="password" id='register-password' name='password' className='login-input' placeholder='password'/> <br/>
                    <p id='error-password-input' className='login-error-message'></p>
                </div>

                <div className='mb-3'>
                    <label className='login-text'>Confirm Password</label> <br/>
                    <input type="password" id='confirm-register-password' name='confirmPassword' className='login-input' placeholder='confirm password'/> <br/>
                    <p id='error-confirm-password-input' className='login-error-message'></p>
                </div>

                <button className='register-button'>SIGN UP</button>
            </form>   
        </div>
    </div>
  )
}

export default RegisterPage
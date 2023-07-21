import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

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
        email.style.borderColor = "black"
        nickname.style.borderColor = "black"
        password.style.borderColor = "black"
        confirmPassword.style.borderColor = "black"

        emailError.innerHTML = ""
        usernameError.innerHTML = ""
        confirmPasswordError.innerHTML = ""

        // Regex for checking email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        

        // Incorrect email
        if (!regex.test(email.value))
        {
            alert("incorrect email")
            email.style.borderColor = "red"
            emailError.innerHTML = "Incorrect email"
            return
        }

        // Incorrect password confirm
        if (password.value != confirmPassword.value)
        {
            alert("confirm password doesn't match up")
            password.style.borderColor = "red"
            confirmPassword.style.borderColor = "red"
            confirmPasswordError.innerHTML = "Passwords doesn't match"
            return
        }

        let response = await fetch('https://ognik-backend.duckdns.org/users/register', {
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
            nickname.style.borderColor = "red"
            usernameError.innerHTML = "Username is already taken"
            return
        }

        if (data.error == "Username is too long")
        {
            nickname.style.borderColor = "red"
            usernameError.innerHTML = "Username is to long"
            return
        }
        loginUser(e)
    }

  return (
    <div id='register-page'>
        <div className='island-container'>
            <form onSubmit={register} autoComplete='off' id='register-form'>
                <div className='register-form-inpur-container'>
                    <label>E-mail</label> <br/>
                    <input type="text" id='register-email' name='email' /> <br/>
                    <p id='error-email-input' className='register-error-message'></p>
                </div>

                <div className='register-form-inpur-container'> 
                    <label>Username</label> <br/>
                    <input type="text" id='register-nickname' name='username' /> <br/>
                    <p id='error-username-input' className='register-error-message'></p>
                </div>

                <div className='register-form-inpur-container'>
                    <label>Password</label> <br/>
                    <input type="password" id='register-password' name='password' /> <br/>
                    <p id='error-password-input' className='register-error-message'></p>
                </div>

                <div className='register-form-inpur-container'>
                    <label>Confirm Password</label> <br/>
                    <input type="password" id='confirm-register-password' name='confirmPassword' /> <br/>
                    <p id='error-confirm-password-input' className='register-error-message'></p>
                </div>

                <button>SIGN UP</button>
            </form>   
        </div>
    </div>
  )
}

export default RegisterPage
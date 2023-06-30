import React from 'react'

const RegisterPage = () => {

    let register = async (e) => {
        e.preventDefault()
        // Getting html objects
        let email = e.target.email
        let nickname = e.target.nickname
        let password = e.target.password
        let confirmPassword = e.target.confirmPassword
        
        const formData = {
            username: e.target.nickname.value,
            password: e.target.password.value,
            email: e.target.email.value,
        }

        email.style.borderColor = "black"
        nickname.style.borderColor = "black"
        password.style.borderColor = "black"
        confirmPassword.style.borderColor = "black"

        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!regex.test(email.value))
        {
            alert("incorrect email")
            email.style.borderColor = "red"
            return
        }

        if (password.value != confirmPassword.value)
        {
            alert("confirm password doesn't match up")
            password.style.borderColor = "red"
            confirmPassword.style.borderColor = "red"
            return
        }
        console.log("dziala poggertfs")

        let data = await fetch('http://localhost:8000/users/register', {
            method: "POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formData)
        })
        console.log(data)
    }

  return (
    <div id='register-page'>
        <div className='island-container'>
            <form onSubmit={register} autoComplete='off' id='register-form'>
                <label>E-mail</label> <br/>
                <input type="text" id='register-email' name='email' /> <br/>
                <label>Nickname</label> <br/>
                <input type="text" id='register-nickname' name='nickname' /> <br/>
                <label>Password</label> <br/>
                <input type="password" id='register-password' name='password' /> <br/>
                <label>Confirm Password</label> <br/>
                <input type="password" id='confirm-register-password' name='confirmPassword' /> <br/>
                <button>Register</button>
            </form>   
        </div>
    </div>
  )
}

export default RegisterPage
import { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import { w3cwebsocket as W3CWebSocket} from 'websocket';
import configData from '../config.json'

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({children}) => {
    
    // Checking if user has token in browser storage
    // if so then, parsing value into json format
    let [authToken, setAuthTokens] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    // decoding jwt token into useable block
    let [user, setUser] = useState(() => localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    
    let [loading, setLoading] = useState(true)
    // https://ognik-backend.duckdns.org/
    let url = configData.WS_URL+`ws/socket-server/`
    let [WebSocket, setWebSocket] = useState(() => localStorage.getItem('authToken') ? new W3CWebSocket(url + "?token=" + String(authToken.access)) : null)
    
    const navigate = useNavigate()
    
    // Must be in try block 
    // Because on first load Websocket ist set to NULL so .onclose property doesn't exist 
    try{
        // If Websocket connection was interruptedly closed
        // Refresh page 
        WebSocket.onclose = () => {
            console.log("AuthContext: Websocket Closed")
            // window.location.reload();
        }
    }catch(e){
    
    }
    
    // login function
    let loginUser = async (e ) => {
        try{
            e.preventDefault()
            // fetching credentials to django backend
           
                let response = await fetch(configData.BACKEND_URL+'users/token/', {
                    method: 'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
                })
                let data = await response.json()
            
            // if response form django is positive 
            // saving token data to browser storage (at this point user is logged)
            if(response.status === 200)
            {
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                if (!WebSocket){
                    setWebSocket(new W3CWebSocket(url + "?token=" + String(data.access)))
                }
                localStorage.setItem('authToken', JSON.stringify(data))
                navigate('/test/friends')  
                window.location.reload()             
            }
            else
            {
                document.getElementsByClassName('login-error-message')[0].innerHTML = 'Incorrect username or password'
                document.getElementById("login-username").style.borderStyle = "solid"   
                document.getElementById("login-username").style.borderColor = "rgb(185, 28, 28)"   
                document.getElementById("login-username").style.borderWidth = '3px' 
                document.getElementById("login-password").style.borderColor = "rgb(185, 28, 28)"   
                document.getElementById("login-password").style.borderWidth = '3px' 
                document.getElementById("login-password").style.borderStyle = "solid"   
            }
        }catch(e){
            alert('Backend is not available')
        }
    }
    
    // logout function
    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        
        // clearing users web storage
        localStorage.removeItem('authToken')
        navigate('/')
    }
    
    // updating access token
    let updateToken = async () => {
        try{

            // fetching refresh token to django backend
            let response = await fetch(configData.BACKEND_URL+'users/token/refresh/', {
                method: 'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                // if refresh token exist, send it
                // if not, send null
                body:JSON.stringify({'refresh': authToken?.refresh})
            })
            let data = await response.json()
    
            // saving new tokens
            if (response.status === 200){
                setAuthTokens(data)
                setUser(jwt_decode(data.access))
                localStorage.setItem('authToken', JSON.stringify(data))
            }else
            {
                logoutUser()
            }
            
            if(loading){
                setLoading(false)
            }
        }
        catch(e){
            setLoading(false)
            alert('Backend is not available')
        }
    }
    
    // context data for provider
    let contextData = {
        user:user,
        authToken:authToken,
        loginUser:loginUser,
        logoutUser: logoutUser,
        WebSocket:WebSocket,
    }
    
    useEffect(() => {
   
        
        // before children are rendered 
        // update token
        if(loading){
            updateToken()
        }
    

        // run updateToken() every 4 minutes
        let s4Minutes = 1000 * 60 * 4
        let interval = setInterval(() => {
            if(authToken){
                updateToken()
            }
        }, s4Minutes)
        return ()=> clearInterval(interval)
        
    }, [authToken, loading, WebSocket])
    
    // returnig contex data for children
    return (
        <AuthContext.Provider value={contextData}>
        {/* render children after loading is done */}
        {loading? null : children}
        {/* {children} */}
    </AuthContext.Provider>
    );
}
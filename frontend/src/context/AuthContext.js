import { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import { w3cwebsocket as W3CWebSocket} from 'websocket';

const AuthContext = createContext();

export default AuthContext

export const AuthProvider = ({children}) => {
    
    // Checking if user has token in browser storage
    // if so then, parsing value into json format
    let [authToken, setAuthTokens] = useState(() => localStorage.getItem('authToken') ? JSON.parse(localStorage.getItem('authToken')) : null)
    // decoding jwt token into useable block
    let [user, setUser] = useState(() => localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    
    
    let [loading, setLoading] = useState(true)
    
    
    let url = `ws://localhost:8000/ws/socket-server/`
    let [WebSocket, setWebSocket] = useState(() => localStorage.getItem('authToken') ? new W3CWebSocket(url + "?token=" + String(authToken.access)) : null)
    
    const navigate = useNavigate()
    


    // Must be in try block 
    // Because on first load Websocket ist set to NULL so .onclose property doesn't exist 
    try{
        // If Websocket connection was interruptedly closed
        // Refresh page 
        WebSocket.onclose = () => {
            console.log("AuthContext: Websocket Closed")
            window.location.reload();
        }
    }catch(e){
    
    }
    
    // login function
    let loginUser = async (e ) => {
        e.preventDefault()
        // fetching credentials to django backend
        let response = await fetch('http://localhost:8000/users/token/', {
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
            navigate('/test')               
        }
        else
        {
            alert("Hujnia z grzybami")
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
        // fetching refresh token to django backend
        let response = await fetch('http://localhost:8000/users/token/refresh/', {
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
    
    // context data for provider
    let contextData = {
        user:user,
        authToken:authToken,
        loginUser:loginUser,
        logoutUser: logoutUser,
        WebSocket:WebSocket
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
        {loading ? null : children}
    </AuthContext.Provider>
    );
}
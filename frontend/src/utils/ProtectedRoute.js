import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext';

// if user is not authenticated
// ProtectedRoute redirects to "/" path
const ProtectedRoute = () => {
    // getting user info
    const {user} = useContext(AuthContext)
    return user ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
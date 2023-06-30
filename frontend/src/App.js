import './App.css';
import Header from './components/Header';
import AuthContext, { AuthProvider } from './context/AuthContext';

import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MainApp from './pages/MainApp';
import RegisterPage from './pages/RegisterPage';


function App() {
  // let {user} = useContext(AuthContext)


  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<HomePage />} path="/"/>
            <Route element={<LoginPage />} path="/login"/>
            <Route element={<RegisterPage />} path="/register" />
            <Route element={<ProtectedRoute />}>
              <Route path='/test/*' element={<MainApp />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

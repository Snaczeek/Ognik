import './App.css';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext'

import { Routes, Route, BrowserRouter as Router } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute'

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<HomePage />} path="/"/>
            <Route element={<LoginPage />} path="/login"/>
            <Route element={<ProtectedRoute />}>
              <Route path='/test' element={<TestPage />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;

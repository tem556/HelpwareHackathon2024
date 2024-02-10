import logo from './logo.svg';
import './App.css';

import AdminHome from './admin/AdminHome';
import UserHome from './user/UserHome';

import Register from './login/Register'
import Login from './login/Login';

import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext'; // Import the AuthProvider
import ProtectedRoute from './auth/ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <AuthProvider>
        <Router>
          <Routes>  
            <Route exact path='/user/:userID' element={ <ProtectedRoute allowedRoles={['user', 'admin']}><UserHome />
            </ProtectedRoute>} />
            <Route exact path='/admin' element={
            <ProtectedRoute allowedRoles={['admin']}><AdminHome />
            </ProtectedRoute>
              } />
            <Route exact path='/register' element={<Register />} />
            <Route exact path='/*' element={<Login />} />
          </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
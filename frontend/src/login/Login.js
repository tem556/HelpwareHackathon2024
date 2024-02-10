import React, { useState } from 'react';

import { useAuth } from '../auth/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';

function Login() {
  // State variables for storing user input and login status
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Define auth
  const { login } = useAuth()

  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Function to handle the login process
  const handleLogin = async () => {
    try {
      // Attempt to fetch user data from the API
      const response = await fetch(`http://localhost:8000/api/v1/user/${username}`);
      if (!response.ok) throw new Error('Failed to login'); // Check for response failure
      
      const userData = await response.json();

      const userRole = userData.role.toLowerCase() === 'admin' ? 'admin' : 'user';
      login({ username, role: userRole }); // Set user context

      // Compare input password with fetched user's password
      if (userData.password === password) {
        // Navigate based on user role
        console.log(userData)
        if (userRole === 'admin') {
          console.log("reached after admin check")
          navigate(`/admin`); // Navigate to admin dashboard
        } else {
          navigate(`/user/${userData.id}`, { state: { userData } }); // Navigate to user profile
        }
      } else {
        setError('Invalid username or password'); // Set error for incorrect credentials
      }
    } catch (error) {
      setError('Failed to login'); // Handle any errors during the login process
      console.error('Login error:', error.message);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '400px', width: '100%' }}>
        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item>
            <Typography variant="h4">Login</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="National ID"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // Update username state on change
            />
          </Grid>
          <Grid item>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update password state on change
            />
          </Grid>
          {error && (
            <Grid item>
              <Typography variant="body1" style={{ color: 'red' }}>{error}</Typography> 
            </Grid>
          )}
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleLogin}>
              Login
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Don't have an account? <Link to="/register" style={{ color: 'blue' }}>Register</Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default Login;

import React from 'react';
import { Paper, Typography, Avatar, Box, IconButton } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material'; // Using PersonIcon for a more relevant icon
import { useNavigate } from 'react-router-dom'; // For navigation

function Mini(props) {
  // Destructure props to directly access person
  const { person } = props;
  const userData = person;

  // Sample data, replace with props or state as needed
  const { name, imageUrl, personId } = person;

  const navigate = useNavigate(); // Access the navigate function to perform navigation

  // Function to handle view click (navigate to the user's profile)
  const handleViewClick = () => {
    navigate(`../user/${personId}`, { state: { userData } });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 300, padding: 2, boxSizing: 'border-box' }}>
      <Paper elevation={3} sx={{ 
        padding: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        position: 'relative', // Position relative for absolute positioning of children
      }}>
        <Avatar src={imageUrl} sx={{ width: 56, height: 56, marginBottom: 1 }} />
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          {name}
        </Typography>
        <IconButton 
          aria-label="view" 
          onClick={handleViewClick} 
          sx={{ 
            position: 'absolute', // Position the icon button absolutely
            bottom: 8, // Distance from bottom
            right: 8, // Distance from right
            padding: 0,
          }}
        >
          <PersonIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}

export default Mini;

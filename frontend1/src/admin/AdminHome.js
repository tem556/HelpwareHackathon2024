import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Search as SearchIcon, CameraAlt as CameraIcon } from '@mui/icons-material';
import Mini from './Mini';

// Constants for API endpoints and allowed file types
const USERS_API_URL = 'http://localhost:8000/api/v1/admin/users';
const UPLOAD_IMAGE_API_URL = 'http://localhost:8000/api/v1/admin/user/img';
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

function AdminHome() {
  // State hooks for managing component data
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Effect hook for fetching user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(USERS_API_URL);
        if (!response.ok) throw new Error('Failed to fetch data');
        console.log(response)
        const data = await response.json();
        setPeople(data);
      } catch (error) {
        handleError(error.message); // Handle fetch errors
      }
    };

    fetchData();
  }, []);

  // Handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Upload image file to server
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && ALLOWED_FILE_TYPES.includes(file.type)) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch(UPLOAD_IMAGE_API_URL, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        console.log(data.name)
         
        setSearchQuery(data.name);

        if (!response.ok) throw new Error('Failed to upload file');
        // Success handling can be done here
      } catch (error) {
        handleError(error.message); // Handle upload errors
      }
    } else {
      handleError('Invalid file type. Please select a valid image file.');
    }
    
  };

  // Filter people based on search query
  console.log(people)
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close the error dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle displaying errors
  const handleError = (message) => {
    setError(message);
    setOpenDialog(true);
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <div style={{ flexGrow: 1 }}>Helpware</div>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: 5, paddingLeft: 10 }}>
            <InputBase
              placeholder="Find patient…"
              inputProps={{ 'aria-label': 'search' }}
              style={{ flex: 1 }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <IconButton color="inherit" aria-label="upload picture" component="span">
                <CameraIcon style={{ color: '#333' }} />
              </IconButton>
            </label>
          </div>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', paddingTop: 2 }}>
        {filteredPeople.map((person) => (
          <Mini key={person.id} person={person} />
        ))}
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <div style={{ color: 'red', textAlign: 'center' }}>Error: {error}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminHome;

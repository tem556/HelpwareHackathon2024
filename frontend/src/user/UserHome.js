import React, { useRef, useState, useEffect } from 'react';
import { Typography, Grid, TextField, Button, IconButton, Paper } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

function HomeUser() {
  const location = useLocation();
  const userData = location.state?.userData;

  // State hooks for managing user data
  const [editableData, setEditableData] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const fileInputRef = useRef(null);

  // Effect hook to update preview image URL
  useEffect(() => {
    if (userData && userData.image) {
      const base64ImageUrl = `data:image/jpeg;base64,${userData.image}`;
      setPreviewImageUrl(base64ImageUrl);
    }
  }, [userData]);

  // Function to handle changes in text fields
  const handleChange = (field, value) => {
    setEditableData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Function to handle edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Function to save changes
  const handleSaveChanges = () => {
    console.log('Sending PUT request with updated data:', editableData);
    setIsEditing(false);
    handleSubmit();
  };

  // Function to cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditableData(userData); // Reset editableData to userData
  };

  // Function to handle image change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Function to render text fields
  const renderTextField = (label, field) => (
    <Grid item xs={6}>
      <TextField
        label={label}
        value={editableData ? editableData[field] : ''}
        onChange={(e) => handleChange(field, e.target.value)}
        disabled={!isEditing}
        variant="outlined"
        size="small"
        fullWidth
        style={{ borderRadius: '8px', marginBottom: '10px' }}
      />
    </Grid>
  );

  // Function to render edit button
  const renderEditButton = (onImage = false) => (
    !isEditing || onImage ? (
      <IconButton size="small" style={{ position: 'absolute', top: '5px', right: '5px' }} onClick={onImage ? triggerFileInput : handleEdit}>
        <Edit fontSize="small" />
      </IconButton>
    ) : null
  );

  // Function to handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();
    Object.keys(editableData).forEach(key => {
      if (key === 'image' && typeof editableData[key] === 'string') {
        // Skip or handle image string data if necessary
      } else {
        console.log(key, editableData[key])
        formData.append(key, editableData[key]);
      }
    });

    // Additional handling for image upload if needed

    try {
      const response = await fetch(`http://localhost:8000/api/v1/user/${userData.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          // Ensure appropriate headers are set if needed
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result); // Handle success
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={4} style={{ maxWidth: '900px', width: '100%' }}>
        {/* User Information Section */}
        <Grid item xs={6} style={{ maxWidth: '450px' }}>
          <Paper elevation={3} style={{ padding: '15px', height: '100%', position: 'relative' }}>
            {renderEditButton()}
            <Typography variant="h6" gutterBottom style={{ marginBottom: '20px' }}>User Information</Typography>
            <Grid container spacing={2} direction="column">
              {renderTextField('Name', 'name')}
              {renderTextField('Age', 'age')}
              {renderTextField('Weight', 'weight')}
              {renderTextField('Height', 'height')}
              {renderTextField('Blood Type', 'blood_type')}
              {renderTextField('Allergies', 'allergies')}
              {renderTextField('Surgeries', 'surgeries')}
              {renderTextField('Other', 'other')}
              <Grid item style={{ marginTop: '10px' }}>
                {isEditing && (
                  <>
                    <Button variant="contained" color="primary" onClick={handleSaveChanges} style={{ marginRight: '8px' }}>
                      Save
                    </Button>
                    <Button variant="outlined" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        {/* Image Preview Section */}
        <Grid item xs={6} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Paper elevation={3} style={{ padding: '15px', borderRadius: '8px', textAlign: 'center', position: 'relative', width: '300px', height: '400px', paddingTop: '50px' }}>
            {/* Input for image upload */}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            {/* Preview of the uploaded image */}
            <img
                src={previewImageUrl}
                alt="Preview"
                style={{ width: '90%', height: '280px', objectFit: 'cover', borderRadius: '4px', cursor: 'pointer', margin: 'auto', marginBottom: '10px' }}
            />
            {renderEditButton(true)}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

export default HomeUser;

// Importing necessary dependencies from React and Material-UI
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  Paper
} from '@mui/material';

// Define the Register component
function Register() {
  // State variables for user information
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [surgeries, setSurgeries] = useState('');
  const [otherConditions, setOtherConditions] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // State variables for image handling
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Hook to enable navigation
  const navigate = useNavigate();

  // State variable for controlling dialog visibility
  const [openDialog, setOpenDialog] = useState(false);

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to open dialog
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  // Function to close dialog
  const handleClose = () => {
    setOpenDialog(false);
    setImage(null);
    setImagePreview(null);
  };

  // Function to save medical details
  const handleSave = () => {
    // Save the state of all fields here
    console.log({
      name,
      age,
      nationalId,
      password,
      bloodType,
      allergies,
      surgeries,
      otherConditions,
      height,
      weight,
      image
    });
    handleClose(); // Close the dialog without submitting the form
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all required fields including the image are filled
    if (!name || !age || !nationalId || !password || !bloodType || !allergies || !surgeries || !otherConditions || !height || !weight || !image) {
      alert("All fields including the picture are required.");
      return;
    }

    // Create form data for submission
    const formData = new FormData();
    formData.append('id', nationalId);
    formData.append('name', name);
    formData.append('age', age);
    formData.append('weight', weight);
    formData.append('height', height);
    formData.append('blood_type', bloodType);
    formData.append('allergies', allergies);
    formData.append('surgeries', surgeries);
    formData.append('other_conditions', otherConditions);
    formData.append('password', password);
    formData.append('image', image);
    formData.append('status', 0);

    try {
      // Submit form data to the server
      const response = await fetch(`http://localhost:8000/api/v1/user/${nationalId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
      // Navigate to login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Load saved medical data when component mounts
  useEffect(() => {
    // Simulate loading saved data from an API
    const savedMedicalData = {
      bloodType: 'O+',
      allergies: 'Pollen',
      surgeries: 'Appendectomy',
      otherConditions: 'None',
      height: '180',
      weight: '75'
    };

    // Set state with saved data
    setBloodType(savedMedicalData.bloodType);
    setAllergies(savedMedicalData.allergies);
    setSurgeries(savedMedicalData.surgeries);
    setOtherConditions(savedMedicalData.otherConditions);
    setHeight(savedMedicalData.height);
    setWeight(savedMedicalData.weight);
  }, []);

  // JSX to render the registration form
  return (
    <div style={{ backgroundColor: '#f0f0f0', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '500px', width: '100%' }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center" direction="column">
          <Grid item xs={12}>
            <Typography variant="h4">Sign Up</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Age"
              type="number"
              variant="outlined"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="National ID"
              variant="outlined"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Add Medical Details
            </Button>
          </Grid>
          <Dialog open={openDialog} onClose={handleClose}>
            <DialogTitle>Medical Details</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your medical details.
              </DialogContentText>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="height"
                    label="Height"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="dense"
                    id="weight"
                    label="Weight"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="bloodType"
                    label="Blood Type"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="allergies"
                    label="Allergies"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="surgeries"
                    label="Surgeries"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={surgeries}
                    onChange={(e) => setSurgeries(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="dense"
                    id="otherConditions"
                    label="Other Conditions"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={otherConditions}
                    onChange={(e) => setOtherConditions(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </Dialog>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="outlined" component="span">
                Upload Picture
              </Button>
            </label>
          </Grid>
          {imagePreview && (
            <Grid item xs={12}>
              <img src={imagePreview} alt="Preview" style={{ width: '100%', maxWidth: '200px', marginTop: '10px' }} />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Sign Up
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">Already have an account? <Link to="/login" style={{ color: 'blue' }}>Login</Link></Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

// Export the Register component as default
export default Register;

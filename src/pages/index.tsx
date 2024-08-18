import { useState } from 'react';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import DynamicForm from '../components/DynamicForm';

const HomePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2', // Change color to match your theme
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#e0f7fa', // Light background color for the logo
              borderRadius: '50%',
              width: 50,
              height: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            VA
          </Typography>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              marginLeft: 2,
              fontWeight: 'bold',
              color: '#1976d2', // Change color to match your theme
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            }}
          >
            Vaccination Application
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleFormVisibility}
          sx={{ borderRadius: 20, paddingX: 4, paddingY: 2 }}
        >
          {isFormVisible ? 'Hide Form' : 'Add Form'}
        </Button>
      </Box>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
          width: '100%', // Take full width of the container
          maxWidth: 1200, // Maximum width of the Paper component
          margin: 'auto', // Center horizontally
          marginLeft: '-20px', // Move the Paper component more to the left
          transform: 'translateX(-20px)', // Adjust for additional left movement
        }}
      >
        {isFormVisible && <DynamicForm />}
      </Paper>
    </Container>
  );
};

export default HomePage;

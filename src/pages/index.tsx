import { useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import DynamicForm from '../components/DynamicForm';

const HomePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Vaccination Application</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleFormVisibility}
        >
          Add
        </Button>
      </Box>
      {isFormVisible && <DynamicForm />}
    </Container>
  );
};

export default HomePage;

import { useState, useEffect } from 'react';
import { Container, Button, Typography, Box, Paper } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import DynamicForm from '../components/DynamicForm';
import { AddedRecord } from '@/types/api';
import { fetchRecords } from '../utils/axios'; // Import the fetchRecords function

const HomePage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [records, setRecords] = useState<AddedRecord[]>([]);

  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleAddRecord = (record: AddedRecord) => {
    setRecords(prevRecords => [...prevRecords, { ...record, id: prevRecords.length + 1 }]);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'locationState', headerName: 'State', width: 150 },
    { field: 'locationCountry', headerName: 'Country', width: 150 },
    { field: 'centre', headerName: 'Centre', width: 150 },
    { field: 'centreAddress', headerName: 'Centre Address', width: 200 },
    { field: 'patient', headerName: 'Patient', width: 150 },
    { field: 'patientAge', headerName: 'Age', width: 100 },
    { field: 'patientContact', headerName: 'Contact', width: 150 },
    { field: 'slot', headerName: 'Slot', width: 150 },
    { field: 'slotDate', headerName: 'Date', width: 150 },
    { field: 'slotTime', headerName: 'Time', width: 150 },
    { field: 'availableSlots', headerName: 'Available Slots', width: 150 }
  ];

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const fetchedRecords = await fetchRecords();
        setRecords(fetchedRecords);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    loadRecords();
  }, []); // Load records only on initial render

  return (
    <Container>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
        <Box display="flex" alignItems="center">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              backgroundColor: '#e0f7fa',
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
              color: '#1976d2',
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
          backgroundColor: '#fafafa', // Light grey background color
          width: '100%',
          maxWidth: 1200,
          margin: 'auto',
          marginLeft: '-20px',
          transform: 'translateX(-20px)',
        }}
      >
        {isFormVisible && <DynamicForm onAddRecord={handleAddRecord} />}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={records as GridRowsProp}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]} // Optional: Add page size options if needed
          />
        </div>
      </Paper>
    </Container>
  );
};

export default HomePage;

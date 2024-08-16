import { useEffect, useState } from 'react';
import { Button, MenuItem, Select, InputLabel, FormControl, Drawer, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import { fetchLocations, fetchCentres, fetchPatients, fetchVaccinationSlots } from '../utils/axios';
import { Location, Centre, Patient, VaccinationSlot } from '../types/api';
import { SelectChangeEvent } from '@mui/material/Select';
import { AddedRecord } from '../types/api'

const DynamicForm = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [slots, setSlots] = useState<VaccinationSlot[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | ''>('');
  const [selectedCentre, setSelectedCentre] = useState<number | ''>('');
  const [selectedPatient, setSelectedPatient] = useState<number | ''>('');
  const [selectedSlot, setSelectedSlot] = useState<number | ''>('');
  const [selectedDetails, setSelectedDetails] = useState<Location | null>(null);
  const [selectedCentreDetails, setSelectedCentreDetails] = useState<Centre | null>(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<VaccinationSlot | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [addedRecords, setAddedRecords] = useState<AddedRecord[]>([]);


  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locs = await fetchLocations();
        setLocations(locs);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    loadLocations();
  }, []);

  useEffect(() => {
    const loadCentres = async () => {
      if (selectedLocation !== '') {
        try {
          const locationId = Number(selectedLocation);
          if (!isNaN(locationId)) {
            const fetchedCentres = await fetchCentres(locationId);
            setCentres(fetchedCentres);
          } else {
            setCentres([]);
          }
        } catch (error) {
          console.error("Error fetching centres:", error);
          setCentres([]);
        }
      } else {
        setCentres([]);
      }
    };

    loadCentres();
  }, [selectedLocation]);

  useEffect(() => {
    const loadPatients = async () => {
      if (selectedCentre !== '') {
        try {
          const pats = await fetchPatients();
          const filteredPatients = pats.filter(p => p.centre === Number(selectedCentre));
          setPatients(filteredPatients);
        } catch (error) {
          console.error("Error fetching patients:", error);
        }
      } else {
        setPatients([]);
      }
    };

    loadPatients();
  }, [selectedCentre]);

  useEffect(() => {
    const loadSlots = async () => {
      if (selectedPatient !== '') {
        try {
          const slts = await fetchVaccinationSlots();
          const filteredSlots = slts.filter(s => s.patient === Number(selectedPatient));
          setSlots(filteredSlots);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      } else {
        setSlots([]);
      }
    };

    loadSlots();
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedLocation) {
      const locationDetails = locations.find(loc => loc.id === Number(selectedLocation)) || null;
      setSelectedDetails(locationDetails);
    } else {
      setSelectedDetails(null);
    }
  }, [selectedLocation, locations]);

  useEffect(() => {
    if (selectedCentre) {
      const centreDetails = centres.find(centre => centre.id === Number(selectedCentre)) || null;
      setSelectedCentreDetails(centreDetails);
    } else {
      setSelectedCentreDetails(null);
    }
  }, [selectedCentre, centres]);

  useEffect(() => {
    if (selectedPatient) {
      const patientDetails = patients.find(patient => patient.id === Number(selectedPatient)) || null;
      setSelectedPatientDetails(patientDetails);
    } else {
      setSelectedPatientDetails(null);
    }
  }, [selectedPatient, patients]);

  useEffect(() => {
    if (selectedSlot) {
      const slotDetails = slots.find(slot => slot.id === Number(selectedSlot)) || null;
      setSelectedSlotDetails(slotDetails);
    } else {
      setSelectedSlotDetails(null);
    }
  }, [selectedSlot, slots]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value as number | '';
    setter(value);
  };

  const handleAdd = () => {
    if (selectedLocation && selectedCentre && selectedPatient && selectedSlot) {
      const newRecord: AddedRecord = {
        location: locations.find(loc => loc.id === selectedLocation)?.city ?? 'Unknown',
        locationState: selectedDetails?.state ?? 'Unknown',
        locationCountry: selectedDetails?.country ?? 'Unknown',
        centre: centres.find(centre => centre.id === selectedCentre)?.name ?? 'Unknown',
        centreAddress: selectedCentreDetails?.address ?? 'Unknown',
        patient: patients.find(patient => patient.id === selectedPatient)?.patient_name ?? 'Unknown',
        patientAge: selectedPatientDetails?.age?.toString() ?? 'Unknown',
        patientContact: selectedPatientDetails?.gender ?? 'Unknown',
        slot: slots.find(slot => slot.id === selectedSlot)?.type ?? 'Unknown',
        slotDate: selectedSlotDetails?.date ?? 'Unknown',
        slotTime: selectedSlotDetails?.time ?? 'Unknown',
        availableSlots: selectedSlotDetails?.available_slots?.toString() ?? 'Unknown',
      };
  
      setAddedRecords(prevRecords => [...prevRecords, newRecord]);
  
      // Optionally clear selections
      setSelectedLocation('');
      setSelectedCentre('');
      setSelectedPatient('');
      setSelectedSlot('');
    } else {
      console.error("All fields must be selected");
    }
  };
  

  const handleDiscard = () => {
    setSelectedLocation('');
    setSelectedCentre('');
    setSelectedPatient('');
    setSelectedSlot('');
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <Box p={3} width={300}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Location</InputLabel>
            <Select
              value={selectedLocation}
              onChange={(e) => handleChange(setSelectedLocation)(e)}
              fullWidth
            >
              {locations.map((loc) => (
                <MenuItem key={loc.id} value={loc.id}>
                  {loc.city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedDetails && (
            <>
              <TextField
                label="Location State"
                value={selectedDetails.state || ''}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Location Country"
                value={selectedDetails.country || ''}
                fullWidth
                margin="normal"
                disabled
              />
            </>
          )}

          <FormControl fullWidth margin="normal" disabled={selectedLocation === ''}>
            <InputLabel>Centre</InputLabel>
            <Select
              value={selectedCentre}
              onChange={handleChange(setSelectedCentre)}
            >
              {centres.length > 0 ? (
                centres.map((centre) => (
                  <MenuItem key={centre.id} value={centre.id}>
                    {centre.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Centres Available</MenuItem>
              )}
            </Select>
          </FormControl>

          {selectedCentreDetails && (
            <>
              <TextField
                label="Centre Address"
                value={selectedCentreDetails.address || ''}
                fullWidth
                margin="normal"
                disabled
              />
            </>
          )}

          <FormControl fullWidth margin="normal" disabled={selectedCentre === ''}>
            <InputLabel>Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={handleChange(setSelectedPatient)}
            >
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.patient_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Patients Available</MenuItem>
              )}
            </Select>
          </FormControl>

          {selectedPatientDetails && (
            <>
              <TextField
                label="Patient Age"
                value={selectedPatientDetails.age || ''}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Patient Contact"
                value={selectedPatientDetails.gender || ''}
                fullWidth
                margin="normal"
                disabled
              />
            </>
          )}

          <FormControl fullWidth margin="normal" disabled={selectedPatient === ''}>
            <InputLabel>Slot</InputLabel>
            <Select
              value={selectedSlot}
              onChange={handleChange(setSelectedSlot)}
            >
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <MenuItem key={slot.id} value={slot.id}>
                    {slot.type}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No Slots Available</MenuItem>
              )}
            </Select>
          </FormControl>

          {selectedSlotDetails && (
            <>
              <TextField
                label="Slot Date"
                value={selectedSlotDetails.date || ''}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Slot Time"
                value={selectedSlotDetails.time || ''}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Available Slots"
                value={selectedSlotDetails.available_slots || ''}
                fullWidth
                margin="normal"
                disabled
              />
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Add
          </Button>
          <Button
            variant="outlined"
            onClick={handleDiscard}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            Discard
          </Button>
        </Box>
      </Drawer>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Location State</TableCell>
              <TableCell>Location Country</TableCell>
              <TableCell>Centre</TableCell>
              <TableCell>Centre Address</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Patient Age</TableCell>
              <TableCell>Patient Contact</TableCell>
              <TableCell>Slot</TableCell>
              <TableCell>Slot Date</TableCell>
              <TableCell>Slot Time</TableCell>
              <TableCell>Available Slots</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addedRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.location}</TableCell>
                <TableCell>{record.locationState}</TableCell>
                <TableCell>{record.locationCountry}</TableCell>
                <TableCell>{record.centre}</TableCell>
                <TableCell>{record.centreAddress}</TableCell>
                <TableCell>{record.patient}</TableCell>
                <TableCell>{record.patientAge}</TableCell>
                <TableCell>{record.patientContact}</TableCell>
                <TableCell>{record.slot}</TableCell>
                <TableCell>{record.slotDate}</TableCell>
                <TableCell>{record.slotTime}</TableCell>
                <TableCell>{record.availableSlots}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DynamicForm;

import { useEffect, useState } from 'react';
import { Button, MenuItem, Select, InputLabel, FormControl, Drawer, Box, TextField } from '@mui/material';
import { fetchLocations, fetchCentres, fetchPatients, fetchVaccinationSlots, postRecord, fetchRecords } from '../utils/axios';
import { Location, Centre, Patient, VaccinationSlot, AddedRecord } from '../types/api';
import { SelectChangeEvent } from '@mui/material/Select';

interface DynamicFormProps {
  onAddRecord: (record: AddedRecord) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ onAddRecord }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [slots, setSlots] = useState<VaccinationSlot[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | ''>('');
  const [selectedCentre, setSelectedCentre] = useState<number | ''>('');
  const [selectedPatient, setSelectedPatient] = useState<number | ''>('');
  const [selectedSlot, setSelectedSlot] = useState<number | ''>('');
  const [locationDetails, setLocationDetails] = useState<{ country: string; state: string; city: string }>({
    country: '',
    state: '',
    city: ''
  });
  const [centreDetails, setCentreDetails] = useState<{ name: string; address: string }>({
    name: '',
    address: ''
  });
  const [patientDetails, setPatientDetails] = useState<{ name: string; age: number; gender: string }>({
    name: '',
    age: 0,
    gender: ''
  });
  const [slotDetails, setSlotDetails] = useState<{ type: string; date: string; time: string; availableSlots: number }>({
    type: '',
    date: '',
    time: '',
    availableSlots: 0
  });
  const [drawerOpen, setDrawerOpen] = useState(true);

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
      const location = locations.find(loc => loc.id === Number(selectedLocation));
      if (location) {
        setLocationDetails({
          country: location.country,
          state: location.state,
          city: location.city
        });
      } else {
        setLocationDetails({ country: '', state: '', city: '' });
      }
    } else {
      setLocationDetails({ country: '', state: '', city: '' });
    }
  }, [selectedLocation, locations]);

  useEffect(() => {
    if (selectedCentre) {
      const centre = centres.find(centre => centre.id === Number(selectedCentre));
      if (centre) {
        setCentreDetails({
          name: centre.name,
          address: centre.address
        });
      } else {
        setCentreDetails({ name: '', address: '' });
      }
    } else {
      setCentreDetails({ name: '', address: '' });
    }
  }, [selectedCentre, centres]);

  useEffect(() => {
    if (selectedPatient) {
      const patient = patients.find(patient => patient.id === Number(selectedPatient));
      if (patient) {
        setPatientDetails({
          name: patient.patient_name,
          age: patient.age,
          gender: patient.gender
        });
      } else {
        setPatientDetails({ name: '', age: 0, gender: '' });
      }
    } else {
      setPatientDetails({ name: '', age: 0, gender: '' });
    }
  }, [selectedPatient, patients]);

  useEffect(() => {
    if (selectedSlot) {
      const slot = slots.find(slot => slot.id === Number(selectedSlot));
      if (slot) {
        setSlotDetails({
          type: slot.type,
          date: slot.date,
          time: slot.time,
          availableSlots: slot.available_slots
        });
      } else {
        setSlotDetails({ type: '', date: '', time: '', availableSlots: 0 });
      }
    } else {
      setSlotDetails({ type: '', date: '', time: '', availableSlots: 0 });
    }
  }, [selectedSlot, slots]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => (event: SelectChangeEvent<number | ''>) => {
    const value = event.target.value as number | '';
    setter(value);
  };

  const [rows, setRows] = useState<AddedRecord[]>([]);

  const handleAdd = async () => {
    if (selectedLocation && selectedCentre && selectedPatient && selectedSlot) {
      const newRecord: AddedRecord = {
        location: locations.find(loc => loc.id === selectedLocation)?.city ?? 'Unknown',
        locationState: locationDetails.state ?? 'Unknown',
        locationCountry: locationDetails.country ?? 'Unknown',
        centre: centreDetails.name ?? 'Unknown',
        centreAddress: centreDetails.address ?? 'Unknown',
        patient: patientDetails.name ?? 'Unknown',
        patientAge: patientDetails.age?.toString() ?? 'Unknown',
        patientContact: patients.find(patient => patient.id === selectedPatient)?.gender ?? 'Unknown',
        slot: slotDetails.type ?? 'Unknown',
        slotDate: slotDetails.date ?? 'Unknown',
        slotTime: slotDetails.time ?? 'Unknown',
        availableSlots: slotDetails.availableSlots?.toString() ?? 'Unknown',
      };

      try {
        await postRecord(newRecord); // Save the new record to the backend
        onAddRecord(newRecord); // Pass the new record to the parent component

        // Refresh the Data Grid by fetching the updated data
        const updatedRecords = await fetchRecords();
        setRows(updatedRecords);

        // Optionally clear selections
        setSelectedLocation('');
        setSelectedCentre('');
        setSelectedPatient('');
        setSelectedSlot('');
      } catch (error) {
        console.error("Error adding record:", error);
      }
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
        sx={{ width: 400 }}
      >
        <Box sx={{ width: 400, padding: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Location</InputLabel>
            <Select
              value={selectedLocation}
              onChange={handleChange(setSelectedLocation)}
            >
              {locations.map(location => (
                <MenuItem key={location.id} value={location.id}>{location.city}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedLocation && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Country"
                value={locationDetails.country}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="State"
                value={locationDetails.state}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="City"
                value={locationDetails.city}
                InputProps={{ readOnly: true }}
              />
            </>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Centre</InputLabel>
            <Select
              value={selectedCentre}
              onChange={handleChange(setSelectedCentre)}
            >
              {centres.map(centre => (
                <MenuItem key={centre.id} value={centre.id}>{centre.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedCentre && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                value={centreDetails.name}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Address"
                value={centreDetails.address}
                InputProps={{ readOnly: true }}
              />
            </>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Patient</InputLabel>
            <Select
              value={selectedPatient}
              onChange={handleChange(setSelectedPatient)}
            >
              {patients.map(patient => (
                <MenuItem key={patient.id} value={patient.id}>{patient.patient_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedPatient && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Patient Name"
                value={patientDetails.name}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Age"
                value={patientDetails.age}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Gender"
                value={patientDetails.gender}
                InputProps={{ readOnly: true }}
              />
            </>
          )}
          <FormControl fullWidth margin="normal">
            <InputLabel>Slot</InputLabel>
            <Select
              value={selectedSlot}
              onChange={handleChange(setSelectedSlot)}
            >
              {slots.map(slot => (
                <MenuItem key={slot.id} value={slot.id}>{slot.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedSlot && (
            <>
            
              <TextField
                fullWidth
                margin="normal"
                label="Date"
                value={slotDetails.date}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Time"
                value={slotDetails.time}
                InputProps={{ readOnly: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Available Slots"
                value={slotDetails.availableSlots}
                InputProps={{ readOnly: true }}
              />
            </>
          )}
          <Box display="flex" justifyContent="space-between" marginTop={2}>
            <Button variant="contained" color="primary" onClick={handleAdd}>
              Add
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleDiscard}>
              Discard
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default DynamicForm;

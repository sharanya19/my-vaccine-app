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
  const [selectedDetails, setSelectedDetails] = useState<Location | null>(null);
  const [selectedCentreDetails, setSelectedCentreDetails] = useState<Centre | null>(null);
  const [selectedPatientDetails, setSelectedPatientDetails] = useState<Patient | null>(null);
  const [selectedSlotDetails, setSelectedSlotDetails] = useState<VaccinationSlot | null>(null);
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
  const [rows, setRows] = useState<AddedRecord[]>([]);

  const handleAdd = async () => {
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
          <Button onClick={handleAdd} variant="contained" color="primary">
            Add
          </Button>
          <Button onClick={handleDiscard} variant="outlined" color="secondary" sx={{ ml: 2 }}>
            Discard
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default DynamicForm;

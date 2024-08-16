
export interface Location {
  id: number;
  country: string;
  state: string;
  city: string;
  centres: Centre[];
}

export interface Centre {
  id: number;
  name: string;
  address: string;
  location_id: number;  // This should be a number since it's an ID
  patients: Patient[];
}

export interface Patient {
  id: number;
  patient_name: string;
  age: number;
  gender: string;
  centre: number;  // This should be a number since it's an ID
}

export interface VaccinationSlot {
  id: number;
  type: string;
  date: string;  // Assuming the date is in a string format (e.g., "YYYY-MM-DD")
  time: string;  // Assuming the time is in a string format (e.g., "HH:MM:SS")
  available_slots: number;
  patient: number;  // This should be a number since it's an ID
}

export interface AddedRecord {
  location: string;
  locationState: string;
  locationCountry: string;
  centre: string;
  centreAddress: string;
  patient: string;
  patientAge: string;
  patientContact: string;
  slot: string;
  slotDate: string;
  slotTime: string;
  availableSlots: string;
}


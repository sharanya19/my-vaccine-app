import axios from 'axios';
import { Location, Centre, Patient, VaccinationSlot, AddedRecord } from '../types/api';
import { BASE_URL, API_PATH } from './appRoutes';
import { getToken } from './auth';

// Create an instance of axios with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token to headers if available
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    console.log("Token found:", token);  // Debugging log
    config.headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn("No token found, request might be unauthorized.");
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor to handle responses and errors
api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error.response && error.response.status === 401) {
    console.error("Unauthorized: Token may be invalid or expired.");
    // Optionally, redirect to login or attempt to refresh the token here
  }
  return Promise.reject(error);
});

export const fetchLocations = async (): Promise<Location[]> => {
  const response = await api.get(API_PATH.LOCATIONS);
  return response.data;
};

export const fetchCentres = async (locationId: number | null): Promise<Centre[]> => {
  // Check if locationId is valid before making the request
  if (locationId === null || locationId === undefined) {
    // Handle the case where locationId is not provided
    return []; // Or handle it as needed
  }

  const response = await api.get(`${API_PATH.CENTRES}?location=${locationId}`);
  return response.data;
};

export const fetchPatients = async (): Promise<Patient[]> => {
  const response = await api.get(API_PATH.PATIENTS);
  return response.data;
};

export const fetchVaccinationSlots = async (): Promise<VaccinationSlot[]> => {
  const response = await api.get(API_PATH.VACCINATION_SLOTS);
  return response.data;
};

export const postData = async (endpoint: string, data: any) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

export const postRecord = async (record: AddedRecord) => {
  const response = await api.post(API_PATH.ADDED_RECORD, record);
  return response.data;
};

export const fetchRecords = async (): Promise<AddedRecord[]> => {
  const response = await api.get(API_PATH.ADDED_RECORD);
  return response.data;
};

export default api;

// appRoutes.ts

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const API_PATH = {
    // Authentication routes
    LOGIN: `${BASE_URL}api/token/`,
    REFRESH_TOKEN: `${BASE_URL}api/token/refresh/`,

    // Other API routes
    LOCATIONS: `${BASE_URL}api/locations/`,
    CENTRES: `${BASE_URL}api/centres/`,
    PATIENTS: `${BASE_URL}api/patients/`,
    VACCINATION_SLOTS: `${BASE_URL}api/vaccination-slots/`,
    ADDED_RECORD: `${BASE_URL}api/added-records/`
};

export {
    BASE_URL,
    API_PATH
};

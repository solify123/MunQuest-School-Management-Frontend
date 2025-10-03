import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getAllRegistrationsByEventIdApi = async (eventId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/registerations/get-registrations/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const eventRegistratTeacherApi = async (eventId: string, foodPreference: string, foodAllergies: string) => {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.post(`${backendUrl}/api/v1/registerations/event-registration-teacher/${userId}`, {
            eventId,
            foodPreference,
            foodAllergies,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const eventRegistratStudentApi = async (munExperience: string, preferredCommittee1: string, foodPreference: string, foodAllergies: string, emergencyContactName: string, emergencyMobileNumber: string) => {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.post(`${backendUrl}/api/v1/registerations/event-registration-student/${userId}`, {
            munExperience,
            preferredCommittee1,
            foodPreference,
            foodAllergies,
            emergencyContactName,
            emergencyMobileNumber,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}
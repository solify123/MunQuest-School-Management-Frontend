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

export const eventRegistratStudentApi = async (eventId: string, mun_experience: string, pref_committee_1_id: string, pref_committee_2_id: string, pref_committee_3_id: string, food_pref: string, food_allergies: string, emergency_name: string, emergency_phone: string) => {
    try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.post(`${backendUrl}/api/v1/registerations/event-registration-student/${userId}`, {
            eventId,
            mun_experience,
            pref_committee_1_id,
            pref_committee_2_id,
            pref_committee_3_id,
            food_pref,
            food_allergies,
            emergency_name,
            emergency_phone
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
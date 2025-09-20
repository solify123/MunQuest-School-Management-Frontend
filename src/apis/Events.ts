import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const eventImagefileUploadApi = async (file: File) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${backendUrl}/api/v1/events/create-event-images-upload`, formData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const createEventApi = async (name: string, description: string, start_date: string, end_date: string, cover_image: string, logo_image: string, locality_id: string, school_id: string, area_id: string, number_of_seats: string, fees_per_delegate: string, total_revenue: string, website: string, instagram: string) => {
    try {
        const token = localStorage.getItem('token');
        const organiserId = localStorage.getItem('orgainiserId');
        const response = await axios.post(`${backendUrl}/api/v1/events/create-event/${organiserId}`, {
            name,
            description,
            start_date,
            end_date,
            cover_image,
            logo_image,
            locality_id,
            school_id,
            area_id,
            number_of_seats,
            fees_per_delegate,
            total_revenue,
            website,
            instagram
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const getCurrentEventsApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/events/get-events`, {
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

export const getEventsByOrganiserApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const organiserId = localStorage.getItem('orgainiserId');
        const response = await axios.get(`${backendUrl}/api/v1/events/get-events-of-organiser/${organiserId}`, {
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

export const getEventByIdApi = async (eventId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/events/get-event-by-id/${eventId}`, {
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

export const eventRegistratTeacherApi = async (eventId: string, foodPreference: string, foodAllergies: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/events/event-registration-teacher/${eventId}`, {
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

export const eventRegistratStudentApi = async (eventId: string, munExperience: string, preferredCommittee1: string, foodPreference: string, foodAllergies: string, emergencyContactName: string, emergencyMobileNumber: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/events/event-registration-student/${eventId}`, {
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

export const updateEventApi = async (eventId: string, name: string, description: string, start_date: string, end_date: string, cover_image: string, logo_image: string, locality_id: string, school_id: string, area_id: string, number_of_seats: string, fees_per_delegate: string, total_revenue: string, website: string, instagram: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/events/update-event/${eventId}`, {
            name,
            description,
            start_date,
            end_date,
            cover_image,
            locality_id,
            school_id,
            area_id,
            number_of_seats,
            fees_per_delegate,
            total_revenue,
            website,
            instagram
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const getAllEventsApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/events/all-events`, {
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

export const updateEventStatusApi = async (eventId: string, status: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/events/update-event-status/${eventId}`,
            {
                status
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const deleteEventApi = async (eventId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${backendUrl}/api/v1/events/delete-event/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}
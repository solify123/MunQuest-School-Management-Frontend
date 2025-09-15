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


export const createEventApi = async (eventName: string,locality: string,school: string,coverImage: string,eventLogo: string,eventDescription: string,eventStartDate: string,eventEndDate: string,numberOfSeats: string,feesPerDelegate: string,totalRevenue: string,website: string,instagram: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/events/create-event`, {
            eventName,
            locality,
            school,
            coverImage,
            eventLogo,
            eventDescription,
            eventStartDate,
            eventEndDate,
            numberOfSeats,
            feesPerDelegate,
            totalRevenue,
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
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getAllAreasApi = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication token not found. Please login again.');
        }
        
        const response = await axios.get(`${backendUrl}/api/v1/areas/all-areas`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Get areas API error:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Failed to load areas. Please try again.');
        }
    }
};
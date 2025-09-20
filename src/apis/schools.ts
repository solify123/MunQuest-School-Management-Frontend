import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getAllSchoolsApi = async () => {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            throw new Error('Authentication token not found. Please login again.');
        }
        
        const response = await axios.get(`${backendUrl}/api/v1/schools/all-schools`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Get schools API error:', error);
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else if (error.message) {
            throw new Error(error.message);
        } else {
            throw new Error('Failed to load schools. Please try again.');
        }
    }
};
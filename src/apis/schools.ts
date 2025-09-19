import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getAllSchoolsApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/schools/all-schools`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};
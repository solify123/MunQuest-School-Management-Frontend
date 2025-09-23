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

export const updateSchoolStatusApi = async (schoolId: string, status: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/schools/update-school-status/${schoolId}`, {
            status: status
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

export const deleteSchoolApi = async (schoolId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${backendUrl}/api/v1/schools/delete-school/${schoolId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const updateSchoolApi = async (schoolId: string, schoolData: any) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/schools/update-school/${schoolId}`, schoolData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};
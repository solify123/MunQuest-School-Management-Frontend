import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const signupApi = async (email: string, password: string, role: string) => {
    try {
        const response = await axios.post(`${backendUrl}/api/v1/users/register`, { email, password, role });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};


export const loginApi = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${backendUrl}/api/v1/users/login`, { email, password });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const getUserApi = async (email: string) => {
    try {
        const response = await axios.get(`${backendUrl}/api/v1/users/${email}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const getUserByIdApi = async (id: string) => {
    try {
        const response = await axios.get(`${backendUrl}/api/v1/users/${id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

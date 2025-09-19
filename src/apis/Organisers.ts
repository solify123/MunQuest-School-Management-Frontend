import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const edviceDocsfileUploadApi = async (file: File) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${backendUrl}/api/v1/organisers/organiser-approval-edvince-upload`, formData, {
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

export const requestApprovalApi = async (schoolName: string, locality: string, role: string, evidenceDocs: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/organisers/organiser-approval-request`, {
            schoolName,
            locality,
            role,
            evidenceDocs
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

export const verifyOrganiserApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/organisers/verify-organiser`, {
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

export const getAllOrganisersApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/organisers/all-organisers`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const updateOrganiserStatusApi = async (organiserId: string, status: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/organisers/update-organiser-status/${organiserId}`, { status }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const deleteOrganiserApi = async (organiserId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${backendUrl}/api/v1/organisers/delete-organiser/${organiserId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
}

export const addOrganiserBySuperUserApi = async (userId: string, schoolName: string, locality: string, role: string, evidence: string, status: string) => {
    try {
        const token = localStorage.getItem('token');


        const response = await axios.post(`${backendUrl}/api/v1/organisers/add-organiser-by-super-user`, {
            userId,
            schoolName,
            locality,
            role,
            evidence,
            status
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
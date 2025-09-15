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

import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getAllLeadershipRolesApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/leadership-roles/all-leadership-roles`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch leadership roles');
    }
};

export const createLeadershipRoleApi = async (abbreviation: string, title: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/leadership-roles/create-leadership-role`, {
            abbreviation,
            title
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create leadership role');
    }
};

export const updateLeadershipRoleApi = async (roleId: string, abbreviation: string, title: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/leadership-roles/update-leadership-role/${roleId}`, {
            abbreviation,
            title
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update leadership role');
    }
};

export const deleteLeadershipRoleApi = async (roleId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${backendUrl}/api/v1/leadership-roles/delete-leadership-role/${roleId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete leadership role');
    }
};

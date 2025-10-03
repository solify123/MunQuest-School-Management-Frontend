import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;


export const saveLeadershipRoleByEventIdApi = async (eventId: string, userId: string, roleId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/event-leaders/save-leadership-role-by-event`, {
            eventId,
            userId,
            roleId
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to save leadership role by event id');
    }
};

export const getLeadershipRolesByEventIdApi = async (eventId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/event-leaders/get-leadership-roles-by-event/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch leadership roles by event id');
    }
};
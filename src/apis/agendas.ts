import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const getAllEventCommitteesAgendaApi = async (eventId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/event-committees/get-all-event-committees/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch all event committees');
    }
};

export const saveEventCommitteesByEventIdAgendaApi = async (eventId: string, event_committeeId: string, agenda_abbr: string, agenda_title: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/event-committees-agendas/save-agenda`, {
            eventId,
            event_committeeId,
            agenda_abbr,
            agenda_title
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to save event committees agenda by event id');
    }
};

export const getEventCommitteesByEventIdAgendaApi = async (eventId: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/event-committees-agendas/get-event-committees-agendas-by-event/${eventId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch event committees agendas by event id');
    }
};

export const updateEventCommitteesByEventIdAgendaApi = async (id: string, eventId: string, committeeId: string, category: string, seats: string,
    chair_username: string, chair_fullname: string, deputy_chair1_username: string, deputy_chair1_fullname: string,
    deputy_chair2_username: string, deputy_chair2_fullname: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/event-committees/update-event-committees-by-event/${id}`, {
            committeeId,
            eventId,
            category,
            seats,
            chair_username,
            chair_fullname,
            deputy_chair1_username,
            deputy_chair1_fullname,
            deputy_chair2_username,
            deputy_chair2_fullname
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update event committees by event id');
    }
};

export const deleteEventCommitteesByEventIdAgendaApi = async (id: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${backendUrl}/api/v1/event-committees/delete-event-committees-by-event/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete event committees by event id');
    }
};

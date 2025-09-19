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

export const deleteAccountApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${backendUrl}/api/v1/users/delete-account`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const teacherProfileApi = async (fullname: string, username: string, birthday: string, gender: string, locality: string, schoolName: string, yearsOfWorkExperience: string, phone: string, countryCode: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/users/teacher-profile`, {
            fullname,
            username,
            birthday,
            gender,
            locality,
            schoolName,
            yearsOfWorkExperience,
            phone,
            countryCode
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

export const studentProfileApi = async (fullname: string, username: string, birthday: string, gender: string, locality: string, schoolName: string, gradeType: string, grade: string, phone: string, countryCode: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${backendUrl}/api/v1/users/student-profile`, {
            fullname,
            username,
            birthday,
            gender,
            locality,
            schoolName,
            gradeType,
            grade,
            phone,
            countryCode
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

export const getUserByIdApi = async () => {
    try {
        const token = localStorage.getItem('token');

        const response = await axios.get(`${backendUrl}/api/v1/users/user-profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const updateUserProfileApi = async (fullname: string, username: string, birthday: string, gender: string, locality: string, schoolName: string, grade: string, yearOfWorkExperience: string, phone: string, email: string, avatar?: string, countryCode?: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/users/user-profile-update`, {
            fullname,
            username,
            birthday,
            gender,
            locality,
            schoolName,
            grade,
            year_of_work_experience: yearOfWorkExperience,
            phone,
            email,
            avatar,
            countryCode
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

export const uploadAvatarApi = async (avatarFile: File) => {
    try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await axios.post(`${backendUrl}/api/v1/users/upload-avatar`, formData, {
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

export const changePasswordApi = async (newPassword: string) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.patch(`${backendUrl}/api/v1/users/change-password`, { newPassword }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }
};

export const getAllUsersApi = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/v1/users/all-users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response.data.message);
    }

}
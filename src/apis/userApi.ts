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

export const teacherProfileApi = async (username: string, birthday: string, gender: string, locality: string, schoolName: string, yearsOfWorkExperience: string, phone: string, countryCode: string) => {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.post(`${backendUrl}/api/v1/users/teacher-profile`, {
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

export const studentProfileApi = async (username: string, birthday: string, gender: string, locality: string, schoolName: string, gradeType: string, grade: string, phone: string, countryCode: string) => {
    try {
        const token = localStorage.getItem('token');
        console.log(token);
        const response = await axios.post(`${backendUrl}/api/v1/users/student-profile`, {
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

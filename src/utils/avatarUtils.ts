import { jwtDecode } from 'jwt-decode';
import type { CustomJwtPayload } from '../types';
import { getUserByIdApi } from '../apis/Users';

// Import default avatars
import StudentAvatar from '../assets/student.png';
import TeacherAvatar from '../assets/teacher.png';

export const getDefaultAvatar = (userType: string): string => {
  return userType === 'student' ? StudentAvatar : TeacherAvatar;
};

export const getUserType = (): string => {
  try {
    const userType = localStorage.getItem('userRole');
    return userType || 'student'; // Default fallback
  } catch (error) {
    console.error('Error getting user type:', error);
    return 'student'; // Default fallback
  }
};

export const clearUserAvatar = (): void => {
  localStorage.removeItem('userAvatar');
};

export const getUserAvatar = async (): Promise<string> => {
  try {
    // First try to get avatar from localStorage
    const storedAvatar = localStorage.getItem('userAvatar');
    if (storedAvatar) {
      return storedAvatar;
    }

    // If not in localStorage, get from API
    const userResponse = await getUserByIdApi();
    if (userResponse.success && userResponse.data.avatar) {
      // Store in localStorage for future use
      localStorage.setItem('userAvatar', userResponse.data.avatar);
      return userResponse.data.avatar;
    }

    // If no avatar from API, get user type and return default
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<CustomJwtPayload>(token);
      return getDefaultAvatar(decodedToken.role);
    }

    // Fallback to student avatar
    return StudentAvatar;
  } catch (error) {
    console.error('Error getting user avatar:', error);
    // Fallback to student avatar
    return StudentAvatar;
  }
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Avatar, LoadingSpinner } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';
import { getCurrentEventsApi } from '../apis/Events';
import { getUserType } from '../utils/avatarUtils';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkEvents = async () => {
      try {
        const response = await getCurrentEventsApi();
        console.log('Events check response:', response);

        if (response.success && response.data && response.data.length > 0) {
          // If events exist, redirect to dashboard
          navigate('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Error checking events:', error);
        // On error, stay on home page
      } finally {
        setIsLoading(false);
      }
    };

    checkEvents();
  }, [navigate]);

  const handleProfileClick = async () => {
    const userType = await getUserType();
    if (userType === 'student') {
      navigate('/student-profile-page');
    } else if (userType === 'teacher') {
      navigate('/teacher-profile-page');
    } else {
      navigate('/profile-page');
    }
  };

  const handleCreateEvent = () => {
    navigate('/request-approval');
  };

  // Show loading spinner while checking events
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading events..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="medium" />
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-8">
              {/* Home Icon */}
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <img src={HomeIcon} alt="Home" className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Home</span>
              </div>

              {/* Notification Icon */}
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <img src={NotificationIcon} alt="Notification" className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Notification</span>
              </div>

              {/* Profile Icon */}
              <div className="flex flex-col items-center cursor-pointer" onClick={handleProfileClick}>
                <Avatar size="medium" className="mb-1" />
                <span className="text-xs text-gray-600 font-medium">Profile</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleCreateEvent}
              className="bg-[#1E395D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a2f4a] transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Event
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-[#1E395D] min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Central Logo */}
          <div className="mb-8">
            <div className="bg-white rounded-lg p-8 inline-block">
              <Logo size="large" />
            </div>
          </div>

          {/* Slogan */}
          <h2 className="text-white text-2xl md:text-3xl font-medium mb-8 leading-relaxed">
            Quest for Leadership, Quest for Change
          </h2>

          {/* Quote */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            "Future Leaders Start Here"
          </h1>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-[#1E395D] py-4">
        <div className="text-center">
          <p className="text-white text-sm">
            © Iman Praveesh Hassan
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

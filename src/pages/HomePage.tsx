import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    // Check user type and navigate accordingly
    const userType = localStorage.getItem('userType');
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

  const handleViewEvents = () => {
    navigate('/dashboard');
  };

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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">Profile</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={handleViewEvents}
              className="bg-white text-[#1E395D] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center border border-[#1E395D]"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View Events
            </button>
            <button
              onClick={handleCreateEvent}
              className="bg-[#1E395D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1a2f4a] transition-colors duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              + Create Event
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

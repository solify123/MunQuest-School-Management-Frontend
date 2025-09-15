import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Avatar } from '../../components/ui';
import HomeIcon from '../../assets/home_icon.svg';
import NotificationIcon from '../../assets/notification_icon.svg';

const StudentRegistrationSuccess: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/student-profile-page');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto px-6 py-4" style={{ maxWidth: "88rem" }}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="medium" />
            </div>

            {/* Navigation Icons */}
            <div className="flex items-center space-x-8">
              {/* Home Icon */}
              <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/home')}>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6">
        {/* Success Message */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            style={{
              color: '#000',
              fontSize: '48px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '150%',
            }}
          >
            You are registered to GMA MUN 2025
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-6">
          {/* Home Button */}
          <button
            onClick={() => navigate('/home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              background: '#C2A46D',
              color: '#fff',
              fontWeight: 500,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#B8945F')}
            onMouseOut={e => (e.currentTarget.style.background = '#C2A46D')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>

          {/* Event Button */}
          <button
            onClick={() => navigate('/event-create')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              borderRadius: '30px',
              background: '#C2A46D',
              color: '#fff',
              fontWeight: 500,
              fontSize: '16px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#B8945F')}
            onMouseOut={e => (e.currentTarget.style.background = '#C2A46D')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistrationSuccess;

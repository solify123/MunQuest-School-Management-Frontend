import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';

const RequestUnderVerification: React.FC = () => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    const userType = localStorage.getItem('userType');
    if (userType === 'student') {
      navigate('/student-profile-page');
    } else if (userType === 'teacher') {
      navigate('/teacher-profile-page');
    } else {
      navigate('/profile-page');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div
          className="mx-auto px-6 py-4"
          style={{ maxWidth: "88rem" }}
        >
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="max-w-[75rem] mx-auto px-6 py-12"
        style={{ paddingTop: '15rem' }}
      >
        <div className="text-left">
          <h1
            style={{
              color: '#000',
              textAlign: 'center',
              fontSize: '40px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: '150%',
              marginBottom: '1rem'
            }}
          >
            Your request is under verification
          </h1>
          <p
            style={{
              color: '#000',
              textAlign: 'center',
              fontSize: '30px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '150%',
              marginBottom: '1rem'
            }}
          >
            We will notify you soon.
          </p>
          <button
            onClick={() => navigate('/home')}
            style={{
              display: 'flex',
              width: '140px',
              height: '60px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '30px',
              backgroundColor: '#C2A46D',
              color: 'white',
              fontWeight: 500,
              fontSize: '16px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              margin: 'auto',
              marginTop: '3rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#B8945F';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C2A46D';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
            Home
          </button>
        </div>
      </div>
    </div >
  );
};

export default RequestUnderVerification;

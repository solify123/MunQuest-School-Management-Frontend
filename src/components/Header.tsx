import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Avatar } from './ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';
import OrganiserIcon from '../assets/organiser_icon.svg';
import { getUserType } from '../utils/avatarUtils';
import { verifyOrganiserApi } from '../apis/Organisers';
import ProfileIcon from '../assets/showprofile_icon.svg';
import LogoutIcon from '../assets/logout_icon.svg';

interface HeaderProps {
  showNavigation?: boolean;
  maxWidth?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  showNavigation = true,
}) => {

  const navigate = useNavigate();

  const [isOrganiser, setIsOrganiser] = useState<boolean>(false);
  const checkUserType = async () => {
    const response = await verifyOrganiserApi()
    if (response.success) {
      setIsOrganiser(true);
    }
    else {
      setIsOrganiser(false);
    }
  };

  useEffect(() => {
    checkUserType();
  }, []);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleProfileClick = async () => {
    // Check user type and navigate accordingly
    const userType = await getUserType()
    if (userType === 'student') {
      navigate('/student-profile-page');
    } else if (userType === 'teacher') {
      navigate('/teacher-profile-page');
    } else if (userType === 'organizer') {
      navigate('/organiser');
    } else {
      navigate('/profile-page');
    }
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleOrganiserClick = () => {
    navigate('/organiser');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleShowProfile = async () => {
    setIsDropdownOpen(false);
    await handleProfileClick();
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userAvatar');
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`bg-white shadow-sm`} style={{ height: "100px" }}>
      <div
        className={`mx-auto px-6 py-4`}
        style={{ maxWidth: "88rem", height: "100%" }}
      >
        <div className="flex items-center justify-between" style={{ height: "100%" }}>
          {/* Logo */}
          <div className="flex-shrink-0" >
            <Logo size="medium" />
          </div>

          {/* Navigation Icons */}
          {showNavigation && (
            <div className="flex items-center space-x-8">
              {/* Home Icon */}
              <div className="flex flex-col items-center cursor-pointer" onClick={handleHomeClick}>
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

              {/* Organiser Icon */}
              {isOrganiser && <div className="flex flex-col items-center cursor-pointer">
                <div onClick={handleOrganiserClick} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <img src={OrganiserIcon} alt="Organiser" className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600 font-medium">Organiser</span>
              </div>
              }

              {/* Profile Icon with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <div className="flex flex-col items-center cursor-pointer" onClick={toggleDropdown}>
                  <Avatar size="medium" className="mb-1" />
                  <span className="text-xs text-gray-600 font-medium">Profile</span>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    {/* Show Profile Option */}
                    <div
                      className="px-4 py-3 cursor-pointer hover:bg-[#D9C7A1] transition-colors duration-200 flex items-center"
                      onClick={handleShowProfile}
                    >
                      <div className="flex items-center mr-3">
                        {/* User Profile Icon */}
                        
                        <img src={ProfileIcon} alt="Profile" />
                      </div>
                      <span className="text-gray-900 font-medium">Show Profile</span>
                    </div>

                    {/* Separator */}
                    <div className="border-t border-gray-200"></div>

                    {/* Log Out Option */}
                    <div
                      className="px-4 py-3 cursor-pointer hover:bg-[#D9C7A1] transition-colors duration-200 flex items-center"
                      onClick={handleLogout}
                    >
                      <div className="flex items-center mr-3">
                        {/* Logout Icon */}
                        <img src={LogoutIcon} alt="Logout" />
                      </div>
                      <span className="text-gray-900 font-medium">Log Out</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

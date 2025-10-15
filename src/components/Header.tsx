import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo, Avatar } from './ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';
import OrganiserIcon from '../assets/organiser_icon.svg';
import SuperUserIcon from '../assets/super_user_icon.svg';
import { useApp } from '../contexts/AppContext';
import ProfileIcon from '../assets/showprofile_icon.svg';
import LogoutIcon from '../assets/logout_icon.svg';
import { supabaseSignOut } from '../apis/SupabaseAuth';

interface HeaderProps {
  showNavigation?: boolean;
  maxWidth?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  showNavigation = true,
}) => {

  const navigate = useNavigate();
  const isSuperUserPage = localStorage.getItem('global_role')?.toLowerCase() === 'superuser';

  // Use context for global state with error handling
  let userType = null;
  try {
    const appContext = useApp();
    userType = appContext.userType;
  } catch (error) {
    console.log('Error accessing AppContext in Header:', error);
    // Fallback to localStorage or default value
    userType = localStorage.getItem('userType') || 'student';
  }

  // Check if user is an organiser by checking localStorage
  const [isOrganiser, setIsOrganiser] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string }>>([
    { id: 'n1', text: 'Welcome to MunQuest! Create your first event.' },
    { id: 'n2', text: 'Tip: Use Allocation to assign committees faster.' },
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Update organiser status based on localStorage
  useEffect(() => {
    const organiserId = localStorage.getItem('organiserId');
    if (organiserId && organiserId !== 'null') {
      setIsOrganiser(true);
    } else {
      setIsOrganiser(false);
    }
  }, []);

  const handleProfileClick = async () => {
    // Use userType from context
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
    // Check if user is an organiser
    // const organiserId = localStorage.getItem('organiserId');
    // if (organiserId) {
    //   navigate('/organiser');
    // } else {
    navigate('/home');
    // }
  };

  const handleOrganiserClick = () => {
    navigate('/organiser');
  };

  const handleSuperUserClick = () => {
    navigate('/super-user');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleShowProfile = async () => {
    setIsDropdownOpen(false);
    await handleProfileClick();
  };

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('organiserId');
    localStorage.removeItem('global_role')
    navigate('/login');
    setIsOrganiser(false); // Update organiser status
    await supabaseSignOut();
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
            <a href="/home"><Logo size="medium" /></a>
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

              {/* Superuser Icon - Only show on super user page */}
              {isSuperUserPage && (
                <div className="flex flex-col items-center cursor-pointer">
                  <div onClick={handleSuperUserClick} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <img src={SuperUserIcon} alt="Superuser" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Superuser</span>
                </div>
              )}

              {/* Notification Icon - Only show on non-super user pages */}
              {!isSuperUserPage && (
                <div className="relative" onMouseEnter={() => setIsNotifOpen(true)} onMouseLeave={() => setIsNotifOpen(false)}>
                  <div className="flex flex-col items-center cursor-pointer">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                      <img src={NotificationIcon} alt="Notification" className="w-6 h-6" />
                    </div>
                    <span className="text-xs text-gray-600 font-medium">Notification</span>
                  </div>

                  {isNotifOpen && notifications.length > 0 && (
                    <div className='absolute right-0 pt-2'>
                      <div className="w-72 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="max-h-80 overflow-auto py-2">
                          {notifications.map((n) => (
                            <div key={n.id} className="py-[5px] px-5 flex items-start gap-3 hover:bg-gray-50">
                              <div className="flex-1 text-sm text-gray-800">{n.text.slice(0, 25)}...</div>
                              <button
                                aria-label="Dismiss"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Organiser Icon - Only show on non-super user pages and when user is NOT an organiser */}
              {!isSuperUserPage && isOrganiser && userType !== 'organizer' && (
                <div className="flex flex-col items-center cursor-pointer">
                  <div onClick={handleOrganiserClick} className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <img src={OrganiserIcon} alt="Organiser" className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-gray-600 font-medium">Organiser</span>
                </div>
              )}

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

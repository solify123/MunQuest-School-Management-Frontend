import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';
import OrganiserIcon from '../assets/orgainser_icon.svg';
import { toast } from 'sonner';
import { getCurrentEventsApi } from '../apis/userApi';

const Organiser: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Current');
  const [currentEvents, setCurrentEvents] = useState([]);

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


  useEffect(() => {
    const getCurrentEvents = async () => {
      try {
        const response = await getCurrentEventsApi();
        console.log("current events",response);
        if (response.success) {
          setCurrentEvents(response.data);
        }
        else {
          toast.error(response.message);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    getCurrentEvents();
  }, [activeTab]);

  const handleCreateEvent = () => {
    navigate('/event-create');
  };

  const tabs = ['Current', 'Completed', 'Cancelled'];

  const getCurrentEvents = () => {
    const now = new Date();
    
    switch (activeTab) {
      case 'Current':
        // Show events that are currently ongoing (started but not ended)
        return currentEvents.filter((event: any) => {
          const startDate = new Date(event.start_date);
          const endDate = new Date(event.end_date);
          return startDate <= now && endDate >= now;
        });
      case 'Completed':
        // Show events that have ended
        return currentEvents.filter((event: any) => {
          const endDate = new Date(event.end_date);
          return endDate < now;
        });
      case 'Cancelled':
        // For now, return empty array as we don't have a cancelled status field
        // This would need to be implemented based on your backend data structure
        return [];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

              {/* Organiser Icon - Active */}
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <img src={OrganiserIcon} alt="Organiser" className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#C2A46D] font-medium">Organiser</span>
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
      <div className="max-w-[85rem] mx-auto px-6 py-8" style={{ paddingLeft: '10.5rem' }}>
        {/* Page Title and Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-medium text-[#C2A46D] mb-6">Organiser</h1>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-lg font-medium border-b-2 transition-colors duration-200 ${activeTab === tab
                    ? 'border-[#1E395D] text-[#1E395D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  style={{
                    color: '#000',
                    fontSize: '20px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: '150%',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Create Event Button */}
          <button
            onClick={handleCreateEvent}
            style={{
              display: 'flex',
              width: '160px',
              height: '40px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
              borderRadius: '30px',
              backgroundColor: '#1E395D',
              color: 'white',
              fontWeight: 500,
              transition: 'background-color 0.2s',
            }}
            className="font-medium hover:bg-[#1a2f4a]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentEvents().map((event: any) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Event Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={event.cover_image}
                  alt={event.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.name}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.start_date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.locality}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                    {event.fees_per_delegate}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for other tabs */}
        {getCurrentEvents().length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab.toLowerCase()} events</h3>
            <p className="text-gray-500">There are no {activeTab.toLowerCase()} events at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Organiser;

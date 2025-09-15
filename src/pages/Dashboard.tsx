import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Avatar } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';

// Mock event data - in a real app, this would come from an API
const mockEvents = [
  {
    id: 1,
    title: 'GMA MUN',
    date: '10-12 Oct 2025',
    location: 'Dubai',
    price: 'AED 150',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Global Model United Nations Conference'
  },
  {
    id: 2,
    title: 'Repton MUN',
    date: '24-26 Oct 2025',
    location: 'Dubai',
    price: 'AED 180',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Repton School Model United Nations'
  },
  {
    id: 3,
    title: 'Jumeirah College MUN',
    date: '7-9 Nov 2025',
    location: 'Dubai',
    price: 'AED 140',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'Jumeirah College Model United Nations'
  },
  {
    id: 4,
    title: 'GEMS Wellington MUN',
    date: '15-17 Nov 2025',
    location: 'Dubai',
    price: 'AED 160',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'GEMS Wellington Model United Nations'
  },
  {
    id: 5,
    title: 'GEMS Dubai American MUN',
    date: '22-24 Nov 2025',
    location: 'Dubai',
    price: 'AED 170',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'GEMS Dubai American School MUN'
  },
  {
    id: 6,
    title: 'GEMS Modern Academy MUN',
    date: '29 Nov - 1 Dec 2025',
    location: 'Dubai',
    price: 'AED 155',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    description: 'GEMS Modern Academy Model United Nations'
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Upcoming');

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

  const handleCreateEvent = () => {
    navigate('/request-approval');
  };

  const handleRegister = (eventId: number) => {
    console.log('Register for event:', eventId);
  };

  const tabs = ['Upcoming', 'Registered', 'Past', 'Cancelled'];

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

          {/* Create Event Button */}
          <div className="mt-6 flex justify-end">
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

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab
                    ? 'border-[#1E395D] text-[#1E395D]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
              {/* Event Image */}
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    {event.price}
                  </div>
                </div>

                {/* Register Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => handleRegister(event.id)}
                    className="bg-[#C2A46D] text-[#8B6F47] px-4 py-2 rounded-lg font-medium hover:bg-[#B8945F] transition-colors duration-200"
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State for other tabs */}
        {activeTab !== 'Upcoming' && (
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

export default Dashboard;

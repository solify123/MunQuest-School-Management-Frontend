import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Avatar } from '../../components/ui';
import HomeIcon from '../../assets/home_icon.svg';
import NotificationIcon from '../../assets/notification_icon.svg';

const StudentDelegatePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Event Info');

  const handleProfileClick = async () => {
    navigate('/student-profile-page');
  };

  const tabs = ['Event Info', 'Support Contact', 'Participation Info', 'Registration Info'];

  const renderEventInfo = () => (
    <div className="space-y-6">
      {/* Event Image */}
      <div className="w-full">
        <img
          src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          alt="Event"
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Event Name */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              value="Dubai Scholars MUN"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Event Description */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Event Description
            </label>
            <textarea
              value="Dubai Scholars MUN is a premier Model United Nations conference hosted by Dubai Scholars School in Dubai, bringing together passionate students from across the region to engage in dynamic debates, draft resolutions, and collaborate on solutions to pressing global challenges. With diverse committees and realistic simulations, Dubai Scholars MUN fosters diplomacy, critical thinking, and leadership, offering delegates an enriching platform to develop skills and expand global perspectives."
              readOnly
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 resize-none"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Date
            </label>
            <input
              type="text"
              value="1 - 3 Sep 2025"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Locality */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Locality
            </label>
            <input
              type="text"
              value="Dubai"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Fees */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Fees
            </label>
            <input
              type="text"
              value="AED 120"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Website
            </label>
            <input
              type="text"
              value="www.dubaischolarsmun.com"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block text-base font-bold text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value="@dubaischolarsmun"
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Developer Note */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600">
          <strong>Developer Note:</strong> All these fields are picked up event info created by organiser.
        </p>
      </div>
    </div>
  );

  const renderSupportContact = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Support Contact</h3>
        <p className="text-gray-500">Contact information will be displayed here.</p>
      </div>
    </div>
  );

  const renderParticipationInfo = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Participation Info</h3>
        <p className="text-gray-500">Participation details will be displayed here.</p>
      </div>
    </div>
  );

  const renderRegistrationInfo = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Registration Info</h3>
        <p className="text-gray-500">Registration details will be displayed here.</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Event Info':
        return renderEventInfo();
      case 'Support Contact':
        return renderSupportContact();
      case 'Participation Info':
        return renderParticipationInfo();
      case 'Registration Info':
        return renderRegistrationInfo();
      default:
        return renderEventInfo();
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
      <div className="max-w-[62rem] mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-medium text-[#C2A46D] mb-6">Student Delegate Page</h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-[#1E395D] text-white'
                  : 'bg-white text-[#1E395D] border border-[#1E395D] hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="max-w-4xl">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDelegatePage;

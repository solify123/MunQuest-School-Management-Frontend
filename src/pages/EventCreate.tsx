import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';

const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventName: '',
    eventDescription: '',
    eventDates: '',
    school: 'Gems Modern Academy',
    locality: 'Dubai',
    coverImage: null as File | null,
    eventLogo: null as File | null
  });

  const steps = [
    { id: 1, name: 'Event Info', active: currentStep === 1 },
    { id: 2, name: 'Seats & Fees', active: currentStep === 2 },
    { id: 3, name: 'Event Links', active: currentStep === 3 }
  ];

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (field: 'coverImage' | 'eventLogo', file: File) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission
      console.log('Event created:', formData);
      navigate('/dashboard');
    }
  };

  const renderEventInfoStep = () => (
    <div className="space-y-8">
      {/* Event Cover Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Cover Image
        </label>
        <div className="relative">
          <div className="w-full h-48 bg-[#C2A46D] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            {formData.coverImage ? (
              <img
                src={URL.createObjectURL(formData.coverImage)}
                alt="Event Cover"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p>Click to upload cover image</p>
              </div>
            )}
          </div>
          <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('coverImage', e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Event Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Logo
        </label>
        <div className="relative w-32 h-32">
          <div className="w-32 h-32 bg-[#C2A46D] rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            {formData.eventLogo ? (
              <img
                src={URL.createObjectURL(formData.eventLogo)}
                alt="Event Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <label className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-50">
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleImageUpload('eventLogo', e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Event Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Name
        </label>
        <input
          type="text"
          value={formData.eventName}
          onChange={(e) => handleInputChange('eventName', e.target.value)}
          placeholder="E.g. Global Vision MtUN 2025"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
        />
      </div>

      {/* Event Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Description
        </label>
        <textarea
          value={formData.eventDescription}
          onChange={(e) => handleInputChange('eventDescription', e.target.value)}
          placeholder="E.g. Describe the event (upto 500 characters)"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent resize-none"
        />
        <div className="text-right text-sm text-gray-500 mt-1">
          {formData.eventDescription.length}/500
        </div>
      </div>

      {/* Event Dates */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Dates
        </label>
        <div className="relative">
          <input
            type="text"
            value={formData.eventDates}
            onChange={(e) => handleInputChange('eventDates', e.target.value)}
            placeholder="E.g. 21 - 22 Oct 2025"
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Developer Note: Must allow selection of a date range
        </div>
      </div>

      {/* School */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          School
        </label>
        <input
          type="text"
          value={formData.school}
          onChange={(e) => handleInputChange('school', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
        />
        <div className="text-sm text-gray-500 mt-1">
          Developer Note: retrieved from user info of the organiser
        </div>
      </div>

      {/* Locality */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Locality
        </label>
        <input
          type="text"
          value={formData.locality}
          onChange={(e) => handleInputChange('locality', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
        />
        <div className="text-sm text-gray-500 mt-1">
          Developer Note: retrieved from user info of the organiser
        </div>
      </div>
    </div>
  );

  const renderSeatsAndFeesStep = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-900">Seats & Fees Configuration</h3>
      <p className="text-gray-600">This step will be implemented in the next phase.</p>
    </div>
  );

  const renderEventLinksStep = () => (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-900">Event Links Configuration</h3>
      <p className="text-gray-600">This step will be implemented in the next phase.</p>
    </div>
  );

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

              {/* Organiser Icon */}
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-medium">Organiser</span>
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
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center text-sm text-gray-600">
              <span className="hover:text-[#1E395D] cursor-pointer" onClick={() => navigate('/home')}>Home</span>
              <span className="mx-2">&gt;</span>
              <span className="text-[#1E395D] font-medium">Event Info</span>
            </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`px-6 py-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer ${
                    step.active
                      ? 'bg-[#1E395D] text-white'
                      : 'bg-white text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  {step.name}
                </div>
                {index < steps.length - 1 && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentStep === 1 && renderEventInfoStep()}
        {currentStep === 2 && renderSeatsAndFeesStep()}
        {currentStep === 3 && renderEventLinksStep()}

        {/* Continue Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleContinue}
            className="bg-[#C2A46D] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#B8945F] transition-colors duration-200"
          >
            {currentStep === 3 ? 'Create Event' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreate;

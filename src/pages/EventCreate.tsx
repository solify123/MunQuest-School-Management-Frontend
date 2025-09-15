import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';
import EditIcon from '../assets/edit_icon.svg';
import { createEventApi, eventImagefileUploadApi, getUserByIdApi } from '../apis/userApi';
import { toast } from 'sonner';

const EventCreate: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [school, setSchool] = useState('');
  const [locality, setLocality] = useState('');
  const [coverImage, setCoverImage] = useState<File | string | null>(null);
  const [eventLogo, setEventLogo] = useState<File | string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [feesPerDelegate, setFeesPerDelegate] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});



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

  useEffect(() => {
    async function getUserById() {
      const user = await getUserByIdApi();

      setSchool(user.data.school_name);
      if (user.data.school_location === "AD") {
        setLocality("Abu Dhabi");
      } else if (user.data.school_location === "DU") {
        setLocality("Dubai");
      } else if (user.data.school_location === "SH") {
        setLocality("Sharjah");
      } else if (user.data.school_location === "AJ") {
        setLocality("Ajman");
      } else if (user.data.school_location === "RAK") {
        setLocality("Ras Al Khaimah");
      } else if (user.data.school_location === "UAQ") {
        setLocality("Umm Al Quwain");
      } else if (user.data.school_location === "AIN") {
        setLocality("Al Ain");
      }
    }
    getUserById();
  }, []);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Validate all required fields
    if (!coverImage) {
      errors.coverImage = 'Event cover image is required';
    }
    if (!eventLogo) {
      errors.eventLogo = 'Event logo is required';
    }
    if (!eventName.trim()) {
      errors.eventName = 'Event name is required';
    }
    if (!eventDescription.trim()) {
      errors.eventDescription = 'Event description is required';
    } else if (eventDescription.trim().length > 500) {
      errors.eventDescription = 'Event description must be upto 500 characters';
    }
    if (!eventStartDate) {
      errors.eventStartDate = 'Event start date is required';
    }
    if (!eventEndDate) {
      errors.eventEndDate = 'Event end date is required';
    }

    // Validate date logic
    if (eventStartDate && eventEndDate) {
      const startDate = new Date(eventStartDate);
      const endDate = new Date(eventEndDate);
      if (startDate >= endDate) {
        errors.eventEndDate = 'End date must be after start date';
      }
    }

    // Validate seats and fees if on step 2
    if (currentStep === 2) {
      if (!numberOfSeats.trim()) {
        errors.numberOfSeats = 'Number of seats is required';
      } else if (isNaN(Number(numberOfSeats)) || Number(numberOfSeats) <= 0) {
        errors.numberOfSeats = 'Number of seats must be a positive number';
      }

      if (!feesPerDelegate.trim()) {
        errors.feesPerDelegate = 'Fees per delegate is required';
      } else if (isNaN(Number(feesPerDelegate)) || Number(feesPerDelegate) <= 0) {
        errors.feesPerDelegate = 'Fees per delegate must be a positive number';
      }
    }

    // Validate event links if on step 3
    if (currentStep === 3) {
      if (!website.trim()) {
        errors.website = 'Website is required';
      } else if (!isValidUrl(website)) {
        errors.website = 'Please enter a valid website URL';
      }

      if (!instagram.trim()) {
        errors.instagram = 'Instagram handle is required';
      } else if (!isValidInstagramHandle(instagram)) {
        errors.instagram = 'Please enter a valid Instagram handle (e.g., @username)';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinue = async () => {
    if (currentStep === 1) {
      // Validate step 1 before proceeding
      if (!validateForm()) {
        toast.error('Please fill in all required fields and ensure description is upto 500 characters');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 2) {
      // Validate step 2 before proceeding
      if (!validateForm()) {
        toast.error('Please fill in all required fields for seats and fees');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      // Validate step 3 before proceeding
      if (!validateForm()) {
        toast.error('Please fill in all required fields for event links');
        return;
      }

      const response = await createEventApi(eventName, locality, school, coverImage as string, eventLogo as string, eventDescription, eventStartDate, eventEndDate, numberOfSeats, feesPerDelegate, totalRevenue, website, instagram);
      if (response.success) {
        toast.success(response.message);
        navigate('/event-create-success');
      } else {
        toast.error(response.message);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };


  const clearValidationError = (field: string) => {
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const calculateTotalRevenue = (seats: string, fees: string) => {
    const seatsNum = Number(seats);
    const feesNum = Number(fees);
    if (!isNaN(seatsNum) && !isNaN(feesNum) && seatsNum > 0 && feesNum > 0) {
      setTotalRevenue((seatsNum * feesNum).toString());
    } else {
      setTotalRevenue('');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isValidInstagramHandle = (handle: string) => {
    return /^@[a-zA-Z0-9._]+$/.test(handle);
  };

  const handleNumberInput = (value: string, setter: (value: string) => void, errorKey: string) => {
    // Check if user tried to enter non-numeric characters
    const hasNonNumeric = /[^0-9]/.test(value);
    if (hasNonNumeric) {
      toast.error('Only numbers are allowed in this field');
    }
    
    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue);
    clearValidationError(errorKey);
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageType: 'cover' | 'logo') => {
    try {
      const files = event.target.files;
      if (files) {
        const response = await eventImagefileUploadApi(files[0] as File);
        if (response.success) {
          toast.success(response.message);
          if (imageType === 'cover') {
            setCoverImage(response.imageUrl);
            clearValidationError('coverImage');
          } else {
            setEventLogo(response.imageUrl);
            clearValidationError('eventLogo');
          }
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const renderEventInfoStep = () => (
    <div className="space-y-8">
      {/* Event Cover Image */}
      <div
        style={{
          display: 'flex',
          gap: '8rem',
          alignItems: 'flex-end',
        }}
      >
        <div className="relative">
          <div
            className="flex items-center justify-center border-2 border-dashed"
            style={{
              width: '400px',
              height: '225px',
              flexShrink: 0,
              borderRadius: '20px',
              background: '#D9C7A1',
              borderColor: validationErrors.coverImage ? '#ef4444' : '#d1d5db',
            }}
          >
            {coverImage ? (
              <img
                src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)}
                alt="Event Cover"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '20px',
                }}
              />
            ) : (
              <div className="text-center text-black font-medium">
                Event Cover Image
              </div>
            )}
          </div>
          <label className="absolute bottom-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50" style={{ right: '-3rem' }}>
            <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e, 'cover')}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <div className="relative w-32 h-32">
            <div
              className="flex items-center justify-center border-2 border-dashed"
              style={{
                width: '128px',
                height: '128px',
                flexShrink: 0,
                borderRadius: '20px',
                background: '#D9C7A1',
                borderColor: validationErrors.eventLogo ? '#ef4444' : '#d1d5db',
              }}
            >
              {eventLogo ? (
                <img
                  src={typeof eventLogo === 'string' ? eventLogo : URL.createObjectURL(eventLogo)}
                  alt="Event Logo"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '20px',
                  }}
                />
              ) : (
                <div className="text-center text-black font-medium text-sm">
                  Event Logo
                </div>
              )}
            </div>
            <label className="absolute bottom-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50" style={{ right: '-3rem' }}>
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e, 'logo')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Image Upload Error Messages */}
      <div className="flex gap-8">
        <div>
          {validationErrors.coverImage && (
            <div className="text-red-500 text-sm mt-2">{validationErrors.coverImage}</div>
          )}
        </div>
        <div>
          {validationErrors.eventLogo && (
            <div className="text-red-500 text-sm mt-2">{validationErrors.eventLogo}</div>
          )}
        </div>
      </div>

      {/* Event Name */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Event Name
        </label>
        <input
          type="text"
          value={eventName}
          onChange={(e) => {
            setEventName(e.target.value);
            clearValidationError('eventName');
          }}
          placeholder="E.g. Global Vision MtUN 2025"
          style={{
            display: 'flex',
            width: '400px',
            height: '40px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: validationErrors.eventName ? '1px solid #ef4444' : '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        {validationErrors.eventName && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.eventName}</div>
        )}
      </div>

      {/* Event Description */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Event Description
        </label>
        <textarea
          value={eventDescription}
          onChange={(e) => {
            setEventDescription(e.target.value);
            clearValidationError('eventDescription');
          }}
          placeholder="E.g. Describe the event (upto 500 characters)"
          maxLength={500}
          rows={4}
          style={{
            display: 'flex',
            width: '400px',
            height: '100px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: validationErrors.eventDescription ? '1px solid #ef4444' : '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        <div className="flex justify-between w-[400px] text-sm mt-1">
          <div className={validationErrors.eventDescription ? 'text-red-500' : 'text-gray-500'}>
            {validationErrors.eventDescription || `${eventDescription.length}/500 maximum`}
          </div>
        </div>
      </div>

      {/* Event Dates */}
      <div>
        <label
          className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Event Dates
        </label>
        <div className="flex gap-4">
          {/* Start Date */}
          <div className="relative">
            <input
              type="date"
              value={eventStartDate}
              onChange={(e) => {
                setEventStartDate(e.target.value);
                clearValidationError('eventStartDate');
              }}
              style={{
                display: 'flex',
                width: '190px',
                height: '40px',
                padding: '7px 14px',
                alignItems: 'flex-start',
                gap: '10px',
                borderRadius: '5px',
                border: validationErrors.eventStartDate ? '1px solid #ef4444' : '1px solid #9CA3AF',
                outline: 'none',
                backgroundColor: 'white',
                fontSize: '16px',
                fontFamily: 'inherit',
                color: eventStartDate ? '#000' : '#9CA3AF',
              }}
            />
          </div>

          {/* To Text */}
          <div className="flex items-center text-gray-500 font-medium">
            to
          </div>

          {/* End Date */}
          <div className="relative">
            <input
              type="date"
              value={eventEndDate}
              onChange={(e) => {
                setEventEndDate(e.target.value);
                clearValidationError('eventEndDate');
              }}
              style={{
                display: 'flex',
                width: '190px',
                height: '40px',
                padding: '7px 14px',
                alignItems: 'flex-start',
                gap: '10px',
                borderRadius: '5px',
                border: validationErrors.eventEndDate ? '1px solid #ef4444' : '1px solid #9CA3AF',
                outline: 'none',
                backgroundColor: 'white',
                fontSize: '16px',
                fontFamily: 'inherit',
                color: eventEndDate ? '#000' : '#9CA3AF',
              }}
            />
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Select the start and end dates for your event
        </div>
        {(validationErrors.eventStartDate || validationErrors.eventEndDate) && (
          <div className="text-red-500 text-sm mt-1">
            {validationErrors.eventStartDate || validationErrors.eventEndDate}
          </div>
        )}
      </div>

      {/* School */}
      <div>
        <label
          className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          School
        </label>
        <input
          type="text"
          value={school}
          disabled
          onChange={(e) => setSchool(e.target.value)}
          style={{
            display: 'flex',
            width: '400px',
            height: '40px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: '1px solid #d1d5db', // matches border-gray-300
            outline: 'none',
          }}
        />
      </div>

      {/* Locality */}
      <div>
        <label
          className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Locality
        </label>
        <input
          type="text"
          value={locality}
          disabled
          onChange={(e) => setLocality(e.target.value)}
          style={{
            display: 'flex',
            width: '400px',
            height: '40px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: '1px solid #d1d5db', // matches border-gray-300
            outline: 'none',
          }}
        />
      </div>
    </div>
  );

  const renderSeatsAndFeesStep = () => (
    <div className="space-y-8">
      {/* Number of Seats */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          No. of Seats
        </label>
        <input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          value={numberOfSeats}
          onChange={(e) => {
            handleNumberInput(e.target.value, (value) => {
              setNumberOfSeats(value);
              calculateTotalRevenue(value, feesPerDelegate);
            }, 'numberOfSeats');
          }}
          placeholder="E.g. 400"
          style={{
            display: 'flex',
            width: '400px',
            height: '40px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: validationErrors.numberOfSeats ? '1px solid #ef4444' : '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        {validationErrors.numberOfSeats && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.numberOfSeats}</div>
        )}
      </div>

      {/* Fees per Delegate */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Fees per Delegate
        </label>
        <div className="relative">
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            AED
          </span>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={feesPerDelegate}
            onChange={(e) => {
              handleNumberInput(e.target.value, (value) => {
                setFeesPerDelegate(value);
                calculateTotalRevenue(numberOfSeats, value);
              }, 'feesPerDelegate');
            }}
            placeholder="200"
            style={{
              display: 'flex',
              width: '400px',
              height: '40px',
              padding: '10px 10px 10px 50px',
              alignItems: 'flex-start',
              gap: '10px',
              borderRadius: '5px',
              border: validationErrors.feesPerDelegate ? '1px solid #ef4444' : '1px solid #d1d5db',
              outline: 'none',
            }}
          />
        </div>
        {validationErrors.feesPerDelegate && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.feesPerDelegate}</div>
        )}
      </div>

      {/* Total Revenue */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Total Revenue
        </label>
        <div className="relative">
          <span
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280',
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            AED
          </span>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            value={totalRevenue}
            readOnly
            placeholder='80000'
            style={{
              display: 'flex',
              width: '400px',
              height: '40px',
              padding: '10px 10px 10px 50px',
              alignItems: 'flex-start',
              gap: '10px',
              borderRadius: '5px',
              border: '1px solid #d1d5db',
              outline: 'none',
              backgroundColor: '#f9fafb',
              color: '#6b7280',
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderEventLinksStep = () => (
    <div className="space-y-8">
      {/* Website */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Website
        </label>
        <input
          type="text"
          value={website}
          onChange={(e) => {
            setWebsite(e.target.value);
            clearValidationError('website');
          }}
          placeholder="www.globalvisionmun.com"
          style={{
            display: 'flex',
            width: '400px',
            height: '40px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: validationErrors.website ? '1px solid #ef4444' : '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        {validationErrors.website && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.website}</div>
        )}
      </div>

      {/* Instagram */}
      <div>
        <label className="block mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}
        >
          Instagram
        </label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => {
            setInstagram(e.target.value);
            clearValidationError('instagram');
          }}
          placeholder="@globalvisionmun"
          style={{
            display: 'flex',
            width: '400px',
            height: '40px',
            padding: '10px',
            alignItems: 'flex-start',
            gap: '10px',
            borderRadius: '5px',
            border: validationErrors.instagram ? '1px solid #ef4444' : '1px solid #d1d5db',
            outline: 'none',
          }}
        />
        {validationErrors.instagram && (
          <div className="text-red-500 text-sm mt-1">{validationErrors.instagram}</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto px-6 py-4" style={{ maxWidth: "87rem" }}>
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
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
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
        <div className="mx-auto px-6" style={{ maxWidth: '65rem' }}>
          <div className="flex items-center text-sm text-gray-600">
            <span
              className="cursor-pointer"
              onClick={() => navigate('/home')}
              style={{
                color: '#C2A46D',
                fontSize: '25px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
              }}
            >
              Home
            </span>
            <span className="mx-2" style={{
              color: '#C2A46D',
              fontSize: '25px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '150%',
            }}>&gt;</span>
            <span className="text-[#1E395D] font-medium" style={{
              color: '#C2A46D',
              fontSize: '25px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '150%',
            }}>Event Info</span>
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-6" style={{ maxWidth: '65rem' }}>
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`font-medium transition-colors duration-200 cursor-pointer ${step.active
                    ? 'bg-[#1E395D] text-white'
                    : 'bg-white text-gray-600 hover:text-gray-800'
                    }`}
                  style={{
                    display: 'flex',
                    width: '200px',
                    height: '58px',
                    padding: '5px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '20px',

                  }}
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
      <div className="mx-auto px-6 py-8" style={{ maxWidth: '65rem' }}>
        {currentStep === 1 && renderEventInfoStep()}
        {currentStep === 2 && renderSeatsAndFeesStep()}
        {currentStep === 3 && renderEventLinksStep()}

        {/* Continue Button */}
        <div className="mt-12 text-left">
          <button
            onClick={() => {
              if (currentStep === 3) {
                handleContinue();
              } else {
                if (!validateForm()) {
                  toast.error('Please fill in all required fields');
                  return;
                }
                setCurrentStep(currentStep + 1);
              }
            }}
            style={{
              display: 'flex',
              width: '120px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCreate;

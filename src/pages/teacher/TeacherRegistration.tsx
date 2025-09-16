import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, LoadingSpinner, Avatar } from '../../components/ui';
import EditIcon from '../../assets/edit_icon.svg';
import { toast } from 'sonner';
import { getUserByIdApi, uploadAvatarApi } from '../../apis/Users';
import PageLoader from '../../components/PageLoader';

type Step = 'personal' | 'food';

const TeacherRegistration: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current step state
  const [currentStep, setCurrentStep] = useState<Step>('personal');

  // Form data states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [username, setUsername] = useState<string>('@samm1234');
  const [name, setName] = useState<string>('Sam Morgan Lee');
  const [dateOfBirth, setDateOfBirth] = useState<string>('5 Oct 2008');
  const [gender, setGender] = useState<string>('Male');
  const [placeOfSchool, setPlaceOfSchool] = useState<string>('Dubai');
  const [schoolName, setSchoolName] = useState<string>('Oasis World School');
  const [yearsOfWorkExperience, setYearsOfWorkExperience] = useState<string>('IB DP 2');
  const [email, setEmail] = useState<string>('samlee@gmail.com');
  const [mobile, setMobile] = useState<string>('+971 50 6362040');

  // Food Info states
  const [foodPreference, setFoodPreference] = useState<string>('');
  const [foodAllergies, setFoodAllergies] = useState<string>('');


  useEffect(() => {
    const getUserById = async () => {
      try {
        const response = await getUserByIdApi();
        console.log(response);
        if (response.success) {
          setUsername(response.data.username);
          setName(response.data.fullname);
          setDateOfBirth(response.data.birthday);
          setGender(response.data.gender);
          setSchoolName(response.data.school_name);
          setYearsOfWorkExperience(response.data.year_of_work_experience);
          setEmail(response.data.email);
          setMobile(response.data.phone_number);
          if (response.data.school_location === "AD") {
            setPlaceOfSchool("Abu Dhabi");
          } else if (response.data.school_location === "DU") {
            setPlaceOfSchool("Dubai");
          } else if (response.data.school_location === "SH") {
            setPlaceOfSchool("Sharjah");
          } else if (response.data.school_location === "AJ") {
            setPlaceOfSchool("Ajman");
          } else if (response.data.school_location === "RAK") {
            setPlaceOfSchool("Ras Al Khaimah");
          } else if (response.data.school_location === "UAQ") {
            setPlaceOfSchool("Umm Al Quwain");
          } else if (response.data.school_location === "AIN") {
            setPlaceOfSchool("Al Ain");
          } else {
            setPlaceOfSchool(response.data.school_location);
          }
        }
        else {
          toast.error('Failed to get user by id: ' + response.message);
        }
      } catch (error: any) {
        toast.error('Failed to get user by id: ' + error.message);
      }
    };
    getUserById();
  }, []);

  // Step configuration
  const steps = [
    { id: 'personal', name: 'Personal Info', active: currentStep === 'personal' },
    { id: 'food', name: 'Food Info', active: currentStep === 'food' },
  ];

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploadingAvatar(true);
        const response = await uploadAvatarApi(file);
        if (response.success) {
          toast.success('Avatar uploaded successfully');
        } else {
          toast.error('Failed to upload avatar: ' + response.message);
        }
      } catch (error: any) {
        toast.error('Failed to upload avatar: ' + error.message);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  // Handle continue button
  const handleContinue = () => {
    switch (currentStep) {
      case 'personal':
        setCurrentStep('food');
        break;
      case 'food':
        // Handle final submission
        toast.success('Registration completed successfully!');
        navigate('/teacher-registration-success');
        break;
      default:
        break;
    }
  };

  // Render progress indicator
  const renderProgressIndicator = () => (
    <div className="flex items-center justify-left mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            onClick={() => setCurrentStep(step.id as Step)}
            style={{
              display: 'flex',
              width: '200px',
              height: '58px',
              padding: '5px',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '20px',
              background: step.active ? '#395579' : '#fff',
              border: '1px solid #000',
            }}
            className={`text-sm font-medium transition-colors ${step.active ? 'text-white' : 'text-gray-700'}`}
          >
            {step.name}
          </div>
          {index < steps.length - 1 && (
            <div className="mx-2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Render food info step
  const renderFoodInfo = () => (
    <div className="space-y-6">
      {/* Food Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{
          color: '#000',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '150%',
        }}>
          Food Preference
        </label>
        <div className="flex space-x-4">
          {['Vegetarian', 'Non-Vegetarian'].map((option) => (
            <button
              key={option}
              onClick={() => setFoodPreference(option)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${foodPreference === option
                ? 'bg-[#C2A46D] text-white'
                : 'text-gray-700 hover:bg-gray-300'
                }`}
              style={{
                border: '1px solid #000',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Food Allergies */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{
          color: '#000',
          fontSize: '16px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '150%',
        }}>
          Food Allergies
        </label>
        <input
          type="text"
          value={foodAllergies}
          onChange={(e) => setFoodAllergies(e.target.value)}
          className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
          placeholder="E.g. Peanut"
        />
      </div>
    </div>
  );

  // Render personal info step
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex justify-left mb-8">
        <div className="relative">
          {isUploadingAvatar ? (
            <div className="w-32 h-32 border-4 border-white shadow-lg rounded-full flex items-center justify-center bg-gray-100">
              <LoadingSpinner size="large" text="Uploading..." />
            </div>
          ) : (
            <Avatar
              size="large"
              className="w-32 h-32 border-4 border-white shadow-lg"
              showBorder={true}
            />
          )}
          <button
            onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
            disabled={isUploadingAvatar}
            className="absolute bottom-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors bg-white shadow-md"
            style={{ right: '-1.5rem' }}
          >
            <img src={EditIcon} alt="Edit Avatar" className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            disabled={isUploadingAvatar}
            className="hidden"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
          }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
            placeholder="Enter username"
          />
          <p className="text-xs text-gray-500 mt-1">Username is system generated</p>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <div className="relative">
            <input
              type="text"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter date of birth"
            />
          </div>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
          <div className="flex space-x-4">
            {['male', 'female', 'other'].map((option) => (
              <button
                key={option}
                onClick={() => setGender(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${gender === option
                  ? 'bg-[#C2A46D] text-white'
                  : ' text-gray-700 hover:bg-gray-300'
                  }`}
                style={{
                  border: '1px solid #000',
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Place of School */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Place of School</label>
          <div className="relative">
            <input
              type="text"
              value={placeOfSchool}
              onChange={(e) => setPlaceOfSchool(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter place of school"
            />
          </div>
        </div>

        {/* School Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School Name</label>
          <div className="relative">
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter school name"
            />
          </div>
        </div>

        {/* Grade or Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Years of Work Experience</label>
          <div className="relative">
            <input
              type="text"
              value={yearsOfWorkExperience}
              onChange={(e) => setYearsOfWorkExperience(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter years of work experience"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
          <div className="relative">
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent pr-10"
              placeholder="Enter mobile number"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <PageLoader loadingText="Loading Teacher Registration...">
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <Header />

      {/* Main Content */}
      <div className="max-w-[85rem] mx-auto px-6 py-8" style={{ paddingLeft: '10.5rem' }}>
        {/* Page Title */}
        <div className="mb-8">
          <h1
            className="mb-6"
            style={{
              color: '#000',
              fontSize: '18px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '150%',
            }}
          >
            Review Info
          </h1>

          {/* Progress Indicator */}
          {renderProgressIndicator()}
        </div>

        {/* Form Content */}
        <div className="max-w-2xl">
          {currentStep === 'personal' && renderPersonalInfo()}
          {currentStep === 'food' && renderFoodInfo()}
        </div>

        {/* Continue/Register Button */}
        <div className="flex justify-left mt-8">
          <button
            onClick={handleContinue}
            className="font-medium text-white transition-all hover:opacity-90"
            style={{
              backgroundColor: '#C2A46D',
              borderRadius: '30px',
              display: 'flex',
              width: '160px',
              height: '50px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              fontSize: '16px'
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
    </PageLoader>
  );
};

export default TeacherRegistration;

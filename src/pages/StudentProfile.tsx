import React, { useState } from 'react';
import { Logo } from '../components/ui';

interface StudentProfileData {
  // Personal Info
  name: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | '';
  
  // School Info
  schoolName: string;
  grade: string;
  studentId: string;
  
  // Contact Info
  email: string;
  phone: string;
  address: string;
}

type Step = 'personal' | 'school' | 'contact';

const StudentProfile: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [formData, setFormData] = useState<StudentProfileData>({
    name: '',
    dateOfBirth: '',
    gender: '',
    schoolName: '',
    grade: '',
    studentId: '',
    email: '',
    phone: '',
    address: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'other') => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 'personal') {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
    } else if (currentStep === 'school') {
      if (!formData.schoolName) newErrors.schoolName = 'School name is required';
      if (!formData.grade) newErrors.grade = 'Grade is required';
      if (!formData.studentId) newErrors.studentId = 'Student ID is required';
    } else if (currentStep === 'contact') {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
      if (!formData.address) newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateCurrentStep()) {
      if (currentStep === 'personal') {
        setCurrentStep('school');
      } else if (currentStep === 'school') {
        setCurrentStep('contact');
      } else {
        // Submit form
        console.log('Form submitted:', formData);
        // Handle final submission here
      }
    }
  };


  const renderStepIndicator = () => {
    const steps = [
      { key: 'personal', label: 'Personal Info' },
      { key: 'school', label: 'School Info' },
      { key: 'contact', label: 'Contact Info' }
    ];

    return (
      <div className="flex items-center justify-start mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <button
              className={`flex items-center justify-center w-[200px] h-[58px] p-[5px] rounded-lg text-sm font-medium transition-all ${
                currentStep === step.key
                  ? 'bg-[#1E395D] text-white'
                  : 'bg-white text-gray-600 border border-gray-300'
              }`}
              onClick={() => setCurrentStep(step.key as Step)}
            >
              {step.label}
            </button>
            {index < steps.length - 1 && (
              <span className="mx-3 text-gray-600 text-sm">&gt;</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="E.g. Sam Morgan Lee"
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          Date of Birth
        </label>
        <div className="relative">
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={`w-full px-4 py-4 pl-12 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        {errors.dateOfBirth && <p className="mt-1 text-xs text-red-600">{errors.dateOfBirth}</p>}
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          Gender
        </label>
        <div className="flex gap-2">
          {(['male', 'female', 'other'] as const).map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => handleGenderSelect(gender)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center w-24 ${
                formData.gender === gender
                  ? 'bg-[#1E395D] text-white border-[#1E395D]'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </button>
          ))}
        </div>
        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
      </div>
    </div>
  );

  const renderSchoolInfo = () => (
    <div className="space-y-6">
      {/* School Name */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          School Name
        </label>
        <input
          type="text"
          name="schoolName"
          placeholder="Enter your school name"
          value={formData.schoolName}
          onChange={handleInputChange}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
            errors.schoolName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.schoolName && <p className="mt-1 text-xs text-red-600">{errors.schoolName}</p>}
      </div>

      {/* Grade */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          Grade
        </label>
        <input
          type="text"
          name="grade"
          placeholder="E.g. Grade 10, Year 11"
          value={formData.grade}
          onChange={handleInputChange}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
            errors.grade ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.grade && <p className="mt-1 text-xs text-red-600">{errors.grade}</p>}
      </div>

      {/* Student ID */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student ID
        </label>
        <input
          type="text"
          name="studentId"
          placeholder="Enter your student ID"
          value={formData.studentId}
          onChange={handleInputChange}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
            errors.studentId ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.studentId && <p className="mt-1 text-xs text-red-600">{errors.studentId}</p>}
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className={`w-full px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 resize-none ${
            errors.address ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      {/* Header */}
      <div className="shadow-sm">
        <div className="max-w-4xl px-6 py-4">
          <Logo size="medium" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-left">Student Signup</h1>
          {renderStepIndicator()}
        </div>

        {/* Form Content */}
        <div className="rounded-lg shadow-sm p-8 mb-8">
          {currentStep === 'personal' && renderPersonalInfo()}
          {currentStep === 'school' && renderSchoolInfo()}
          {currentStep === 'contact' && renderContactInfo()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={handleContinue}
            className="font-medium text-white transition-all"
            style={{ 
              backgroundColor: '#C2A46D',
              borderRadius: '30px',
              display: 'flex',
              width: '120px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {currentStep === 'contact' ? 'Complete Signup' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;

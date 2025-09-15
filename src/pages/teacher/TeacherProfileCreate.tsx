import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../../components/ui';
import { toast } from 'sonner';
import { teacherProfileApi } from '../../apis/Users';
import { useNavigate } from 'react-router-dom';
import { generateUsername } from '../../utils/usernameGenerator';

type Step = 'personal' | 'school' | 'contact' | 'success';

const TeacherProfile: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [fullname, setFullname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [generatedUsername, setGeneratedUsername] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [yearsOfWorkExperience, setYearsOfWorkExperience] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('UAE');
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [schoolSearchTerm, setSchoolSearchTerm] = useState<string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const countryCodes = [
    { code: '+971', country: 'UAE', flag: '🇦🇪' },
    { code: '+1', country: 'USA', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' }
  ];

  const loadSchoolData = async (cityCode: string) => {
    try {
      const response = await fetch(`/school_list/${cityCode}.json`);
      if (response.ok) {
        const schoolData = await response.json();
        setSchools(schoolData);
        setFilteredSchools(schoolData);
      } else {
        setSchools([]);
        setFilteredSchools([]);
      }
    } catch (error) {
      console.error('Error loading school data:', error);
      setSchools([]);
      setFilteredSchools([]);
    }
  };

  const handleCityChange = (cityCode: string) => {
    setLocality(cityCode);
    setSchoolName('');
    setSchoolSearchTerm('');
    if (cityCode) {
      loadSchoolData(cityCode);
    } else {
      setSchools([]);
      setFilteredSchools([]);
    }
  };

  const handleSchoolSearch = (searchTerm: string) => {
    setSchoolSearchTerm(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const filtered = schools.filter(school => 
        school.school_label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.school_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSchools(filtered);
    }
  };

  const handleSchoolSelect = (school: any) => {
    const schoolLabel = school.school_label || school.school_name;
    setSchoolName(schoolLabel);
    setSchoolSearchTerm(schoolLabel);
    setShowSchoolDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
        setShowSchoolDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              className={`flex items-center justify-center w-[200px] h-[58px] p-[5px] rounded-lg text-sm font-medium transition-all ${currentStep === step.key
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
        <label className="block text-base font-bold text-black mb-2">
          Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="E.g. Sam Morgan Lee"
          value={fullname}
          onChange={(e) => {
            setFullname(e.target.value);
            setUsername(e.target.value);
            const generated = generateUsername(e.target.value);
            setGeneratedUsername(generated);
          }}
          className={`w-[400px] px-4 py-4 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
        
        {/* Generated Username Display */}
        {generatedUsername && (
          <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Generated Username:</span>
                <span className="ml-2 font-mono text-sm font-medium text-[#1E395D]">{generatedUsername}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newGenerated = generateUsername(fullname);
                  setGeneratedUsername(newGenerated);
                }}
                className="text-xs text-[#1E395D] hover:text-[#0f2a47] underline"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label className="block text-base font-bold text-black mb-2">
          Date of Birth
        </label>
        <div className="relative">
          <input
            type="date"
            name="dateOfBirth"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={`w-[400px] px-4 py-4 pl-12 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
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
        <label className="block text-base font-bold text-black mb-2">
          Gender
        </label>
        <div className="flex gap-2">
          {(['male', 'female', 'other'] as const).map((genderOption) => (
            <button
              key={genderOption}
              type="button"
              onClick={() => setGender(genderOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center w-[200px] ${gender === genderOption
                ? 'bg-[#1E395D] text-white border-[#1E395D]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
            >
              {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
            </button>
          ))}
        </div>
        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
      </div>
    </div>
  );

  const renderSchoolInfo = () => (
    <div className="space-y-6">
      {/* Locality of School */}
      <div>
        <label className="block text-base font-bold text-black mb-2">
          Locality of School <span className="text-[#7E7E7E] text-base font-normal leading-[150%]">(City or Town)</span>
        </label>
        <div className="relative">
          <select
            name="locality"
            value={locality}
            onChange={(e) => handleCityChange(e.target.value)}
            className={`w-[400px] px-4 py-4 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 appearance-none ${errors.locality ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="">E.g. Dubai</option>
            <option value="AD">Abu Dhabi</option>
            <option value="DU">Dubai</option>
            <option value="SH">Sharjah</option>
            <option value="AJ">Ajman</option>
            <option value="RAK">Ras Al Khaimah</option>
            <option value="UAQ">Umm Al Quwain</option>
            <option value="AIN">Al Ain</option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.locality && <p className="mt-1 text-xs text-red-600">{errors.locality}</p>}
      </div>

      {/* School Name */}
      <div>
        <label className="block text-base font-bold text-black mb-2">
          School Name
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            name="schoolName"
            placeholder={locality ? "Search by school name or code..." : "Please select a city first"}
            value={schoolSearchTerm}
            onChange={e => handleSchoolSearch(e.target.value)}
            onFocus={() => setShowSchoolDropdown(true)}
            disabled={!locality}
            className={`w-[400px] px-4 py-4 pl-12 pr-12 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${errors.schoolName ? 'border-red-500' : 'border-gray-300'} ${!locality ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="button"
            onClick={() => {
              setSchoolName('');
              setSchoolSearchTerm('');
              setShowSchoolDropdown(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* School Dropdown */}
          {showSchoolDropdown && locality && filteredSchools.length > 0 && (
            <div className="absolute top-full left-0 z-10 w-[400px] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredSchools.map((school, index) => (
                <div
                  key={`${school.school_code}-${index}`}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSchoolSelect(school)}
                >
                  <div className="font-medium text-sm text-gray-900">
                    {school.school_label || school.school_name}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    Code: {school.school_code}
                  </div>
                  {(school.area_label && school.area_label !== '-') && (
                    <div className="text-xs text-gray-500 mt-1">
                      {school.area_label}
                    </div>
                  )}
                  {school.location && (
                    <div className="text-xs text-gray-500 mt-1">
                      {school.location}
                    </div>
                  )}
                </div>
              ))}
              {filteredSchools.length === 0 && schoolSearchTerm && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No schools found matching "{schoolSearchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
        {errors.schoolName && <p className="mt-1 text-xs text-red-600">{errors.schoolName}</p>}
      </div>

      {/* Years of Work Experience */}
      <div>
        <label className="block text-base font-bold text-black mb-2">
          Years of Work Experience
        </label>
        <div className="relative">
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            name="yearsOfWorkExperience"
            placeholder="E.g. 20"
            value={yearsOfWorkExperience}
            onChange={(e) => {
              // Check if user tried to enter non-numeric characters
              const hasNonNumeric = /[^0-9]/.test(e.target.value);
              if (hasNonNumeric) {
                toast.error('Only numbers are allowed in this field');
              }
              
              // Remove any non-numeric characters
              const numericValue = e.target.value.replace(/[^0-9]/g, '');
              setYearsOfWorkExperience(numericValue);
            }}
            className={`w-[400px] px-4 py-4 pl-12 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${errors.yearsOfWorkExperience ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {errors.yearsOfWorkExperience && <p className="mt-1 text-xs text-red-600">{errors.yearsOfWorkExperience}</p>}
      </div>



    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      {/* Mobile */}
      <div>
        <label className="block text-base font-bold text-black mb-2">
          Mobile
        </label>
        <div className="relative" ref={dropdownRef}>
          <div className="flex border rounded-lg bg-white">
            {/* Country Code Selector */}
            <div
              className="flex items-center px-4 py-4 border-r border-gray-300 cursor-pointer hover:bg-gray-50"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            >
              <span className="text-sm text-gray-600 mr-2">{countryCode}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            {/* Phone Number Input */}
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9\s]*"
              name="phone"
              placeholder="50 6362040"
              value={phone}
              onChange={(e) => {
              // Check if user tried to enter invalid characters
              const hasInvalidChars = /[^0-9\s]/.test(e.target.value);
              if (hasInvalidChars) {
                toast.error('Only numbers and spaces are allowed in phone number');
              }
              
              // Remove any non-numeric characters except spaces
              const phoneValue = e.target.value.replace(/[^0-9\s]/g, '');
              setPhone(phoneValue);
            }}
              className={`flex-1 px-4 py-4 text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
            />
          </div>

          {/* Country Code Dropdown */}
          {showCountryDropdown && (
            <div className="absolute top-full left-0 z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {countryCodes.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setCountryCode(country.code)}
                >
                  <span className="text-lg mr-3">{country.flag}</span>
                  <span className="text-sm text-gray-600 mr-2">{country.code}</span>
                  <span className="text-sm text-gray-800">{country.country}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>
    </div>
  );


  const TeacherProfileHandler = async (fullname: string, username: string, birthday: string, gender: string, locality: string, schoolName: string, yearsOfWorkExperience: string, phone: string, countryCode: string) => {
    try {
      const response = await teacherProfileApi(fullname, username, birthday, gender, locality, schoolName, yearsOfWorkExperience, phone, countryCode);
      if (response.success) {
        toast.success('Teacher profile created successfully');
        navigate('/teacher-home');
      } else {
        setErrors(response.errors);
        toast.error(response.errors.message);
      }

    } catch (error: any) {
      setErrors(error.errors);
      toast.error(error.errors.message);
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-left">Tracher Signup</h1>
          {renderStepIndicator()}
        </div>

        {/* Form Content */}
        <div className="w-[400px] rounded-lg shadow-sm mb-8" style={{ padding: '2rem 0.5rem' }}>
          {currentStep === 'personal' && renderPersonalInfo()}
          {currentStep === 'school' && renderSchoolInfo()}
          {currentStep === 'contact' && renderContactInfo()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 'personal') {
                // Validate personal info
                if (username && birthday && gender) {
                  setCurrentStep('school');
                } else {
                  toast.error('Please fill in all personal information fields');
                }
              } else if (currentStep === 'school') {
                // Validate school info
                if (locality && schoolName && yearsOfWorkExperience) {
                  setCurrentStep('contact');
                } else {
                  toast.error('Please fill in all school information fields');
                }
              } else if (currentStep === 'contact') {
                // Validate contact info and submit
                if (phone && countryCode) {
                  TeacherProfileHandler(fullname, generatedUsername, birthday, gender, locality, schoolName, yearsOfWorkExperience, phone, countryCode);
                } else {
                  toast.error('Please fill in all contact information fields');
                }
              }
            }}
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
            {currentStep === 'contact' ? 'Submit' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

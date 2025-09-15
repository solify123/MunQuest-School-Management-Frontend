import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Import icons
import EditIcon from '../assets/edit_icon.svg';
import HomeIcon from '../assets/home_icon.svg';
import NotificationIcon from '../assets/notification_icon.svg';
import { changePasswordApi, getUserByIdApi, updateUserProfileApi, uploadAvatarApi } from '../apis/userApi';
import { generateUsername } from '../utils/usernameGenerator';

// Import default avatars
import StudentAvatar from '../assets/student.png';
import TeacherAvatar from '../assets/teacher.png';

interface ProfileData {
  id?: number;
  username: string;
  fullname: string;
  birthday: string;
  gender: string;
  school_location: string;
  school_name: string;
  grade: string;
  email: string;
  phone_number: string;
  country_code?: string;
  role?: string;
  grade_year_programme?: string;
  year_of_work_experience?: number | null;
  created_at?: string;
  updated_at?: string;
  password?: string;
  // UI display fields
  name: string;
  dateOfBirth: string;
  locality: string;
  schoolName: string;
  gradeOrYear: string;
  mobile: string;
  avatar?: string;
}

interface ProfilePageProps {
  userType: 'student' | 'teacher';
  initialData?: Partial<ProfileData>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ userType, initialData }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getUserById = async () => {
      const user = await getUserByIdApi();
      const userData = {
        ...user.data,
        // Map API fields to UI fields
        username: user.data.username || '',
        fullname: user.data.fullname || '',
        birthday: user.data.birthday || '',
        gender: user.data.gender || '',
        locality: user.data.school_location || '',
        schoolName: user.data.school_name || '',
        grade: user.data.grade || '',
        year_of_work_experience: user.data.year_of_work_experience || '',
        phone_number: user.data.phone_number || '',
        email: user.data.email || '',
        avatar: user.data.avatar || (userType === 'student' ? StudentAvatar : TeacherAvatar)
      };

      // Update profileData
      setProfileData(userData);

      // Update individual useState variables
      setFullname(userData.fullname);
      setUsername(userData.username);
      setBirthday(userData.birthday);
      setGender(userData.gender);
      setLocality(userData.locality);
      setSchoolName(userData.schoolName);
      setGrade(userData.grade);
      setYearOfWorkExperience(userData.year_of_work_experience);
      setPhone(userData.phone_number);
      setCountryCode(userData.country_code || '+971');
      setEmail(userData.email);
      setAvatar(userData.avatar);

      console.log('Loaded user data:', userData);
    };
    getUserById();
  }, [userType]);
  // Profile data state
  const [profileData, setProfileData] = useState<ProfileData>({
    username: initialData?.username || '',
    fullname: initialData?.fullname || '',
    birthday: initialData?.birthday || '',
    gender: initialData?.gender || '',
    school_location: initialData?.school_location || '',
    school_name: initialData?.school_name || '',
    grade: initialData?.grade || '',
    email: initialData?.email || '',
    phone_number: initialData?.phone_number || '',
    // UI display fields
    name: initialData?.fullname || '',
    dateOfBirth: initialData?.birthday || '',
    locality: initialData?.school_location || '',
    schoolName: initialData?.school_name || '',
    gradeOrYear: initialData?.grade || '',
    mobile: initialData?.phone_number ? `+971 ${initialData.phone_number}` : '',
    avatar: initialData?.avatar || (userType === 'student' ? StudentAvatar : TeacherAvatar)
  });



  // Edit states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // Dropdown states
  const [showLocalityDropdown, setShowLocalityDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // School data
  const [schools, setSchools] = useState<any[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [schoolSearchTerm, setSchoolSearchTerm] = useState<string>('');

  const [errors] = useState<Record<string, string>>({});

  const [fullname, setFullname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [gradeType, setGradeType] = useState<string>('');
  const [yearOfWorkExperience, setYearOfWorkExperience] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>('+971');
  const [email, setEmail] = useState<string>('');
  const [avatar, setAvatar] = useState<string>(userType === 'student' ? StudentAvatar : TeacherAvatar);

  const localityOptions = [
    { value: 'AD', label: 'Abu Dhabi' },
    { value: 'DU', label: 'Dubai' },
    { value: 'SH', label: 'Sharjah' },
    { value: 'AJ', label: 'Ajman' },
    { value: 'RAK', label: 'Ras Al Khaimah' },
    { value: 'UAQ', label: 'Umm Al Quwain' },
    { value: 'AIN', label: 'Al Ain' }
  ];

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

  const gradeOptions = userType === 'student' ? {
    grade: [
      { value: 'grade-5', label: 'Grade 5' },
      { value: 'grade-6', label: 'Grade 6' },
      { value: 'grade-7', label: 'Grade 7' },
      { value: 'grade-8', label: 'Grade 8' },
      { value: 'grade-9', label: 'Grade 9' },
      { value: 'grade-10', label: 'Grade 10' },
      { value: 'grade-11', label: 'Grade 11' },
      { value: 'grade-12', label: 'Grade 12' }
    ],
    year: [
      { value: 'year-6', label: 'Year 6' },
      { value: 'year-7', label: 'Year 7' },
      { value: 'year-8', label: 'Year 8' },
      { value: 'year-9', label: 'Year 9' },
      { value: 'year-10', label: 'Year 10' },
      { value: 'year-11', label: 'Year 11' },
      { value: 'year-12', label: 'Year 12' },
      { value: 'year-13', label: 'Year 13' }
    ],
    programme: [
      { value: 'PYP-5', label: 'PYP 5' },
      { value: 'MYP-1', label: 'MYP 1' },
      { value: 'MYP-2', label: 'MYP 2' },
      { value: 'MYP-3', label: 'MYP 3' },
      { value: 'MYP-4', label: 'MYP 4' },
      { value: 'MYP-5', label: 'MYP 5' },
      { value: 'IB-DP-1', label: 'IB DP 1' },
      { value: 'IB-DP-2', label: 'IB DP 2' }
    ],
    other: [
      { value: 'other-1', label: 'Other 1' },
      { value: 'other-2', label: 'Other 2' },
      { value: 'other-3', label: 'Other 3' },
      { value: 'other-4', label: 'Other 4' },
      { value: 'other-5', label: 'Other 5' },
      { value: 'other-6', label: 'Other 6' },
      { value: 'other-7', label: 'Other 7' },
      { value: 'other-8', label: 'Other 8' }
    ]
  } : [
    'Primary Teacher', 'Secondary Teacher', 'Subject Teacher', 'Head of Department',
    'Vice Principal', 'Principal', 'Counselor', 'Librarian', 'Other'
  ];
  // Handle field edit
  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  // Save field edit
  const handleSaveField = () => {
    if (editingField) {
      console.log(editingField, schoolName)
      // Update the corresponding useState variable based on the field
      switch (editingField) {
        case 'fullname':
          setFullname(tempValue);
          // Generate new username when fullname changes
          const newUsername = generateUsername(tempValue);
          setUsername(newUsername);
          break;
        case 'username':
          setUsername(tempValue);
          break;
        case 'birthday':
          setBirthday(tempValue);
          break;
        case 'gender':
          setGender(tempValue);
          break;
        case 'school_location':
          setLocality(tempValue);
          break;
        case 'school_name':
          setSchoolName(schoolName);
          break;
        case 'grade':
          setGrade(tempValue);
          break;
        case 'gradeType':
          setGradeType(tempValue);
          break;
        case 'year_of_work_experience':
          setYearOfWorkExperience(tempValue);
          break;
        case 'phone_number':
          setPhone(tempValue);
          break;
        case 'email':
          setEmail(tempValue);
          break;
        case 'avatar':
          setAvatar(tempValue);
          break;
        default:
          break;
      }
      setEditingField(null);
      setTempValue('');
    }
  };

  // Cancel field edit
  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue('');
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Upload avatar to backend
        const response = await uploadAvatarApi(file);

        console.log("avatar uploaded", response);
        if (response.success) {
          // Set the avatar URL returned from backend
          toast.success(response.message);
          setAvatar(response.avatarUrl);
        } else {
          toast.error('Failed to upload avatar: ' + response.message);
        }
      } catch (error: any) {
        toast.error('Failed to upload avatar: ' + error.message);
      }
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    // Here you would typically call an API to change password
    const response = await changePasswordApi(newPassword);
    if (response.success) {
      toast.success(response.message);
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordFields(false);
    } else {
      toast.error(response.message);
    }
  };
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLocalityDropdown(false);
        setShowSchoolDropdown(false);
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load school data when locality changes
  useEffect(() => {
    if (locality && localityOptions.find(l => l.value === locality)) {
      loadSchoolData(locality);
    }
  }, [locality]);

  // School data functions
  const loadSchoolData = async (cityCode: string) => {
    console.log(cityCode)
    try {

      console.log(cityCode, 'cityCode');
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




  const renderGenderField = (label: string, field: keyof ProfileData, value: any) => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? tempValue : value;

    const handleGenderSelect = (selectedGender: 'male' | 'female' | 'other') => {
      if (isEditingThisField) {
        setTempValue(selectedGender);
      } else {
        setGender(selectedGender);
      }
    };

    return (
      <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">
          {label}
        </label>
        <div className="flex gap-2">
          {(['male', 'female', 'other'] as const).map((genderOption) => (
            <button
              key={genderOption}
              type="button"
              onClick={() => handleGenderSelect(genderOption)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all flex items-center justify-center w-24 ${displayValue === genderOption
                ? 'bg-[#C2A46D] text-white border-[#C2A46D]'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
            >
              {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderFullnameField = (label: string, field: keyof ProfileData, value: string) => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? tempValue : value;
    const generatedUsername = isEditingThisField ? generateUsername(tempValue) : username;

    return (
      <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">
          {label}
        </label>
        <div className="relative">
          <input
            type="text"
            value={displayValue}
            onChange={(e) => setTempValue(e.target.value)}
            disabled={!isEditingThisField}
            className={`w-[400px] px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
              }`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {!isEditingThisField && (
            <button
              onClick={() => handleEditField(field, value)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '36.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}
          {isEditingThisField && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '35rem' }}>
              <button
                onClick={handleSaveField}
                className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Generated Username Display */}
        {isEditingThisField && tempValue && (
          <div className="w-[400px] mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Generated Username:</span>
                <span className="ml-2 font-mono text-sm font-medium text-[#1E395D]">{generatedUsername}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newGenerated = generateUsername(tempValue);
                  setUsername(newGenerated);
                }}
                className="text-xs text-[#1E395D] hover:text-[#0f2a47] underline"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLocalityField = (label: string, field: keyof ProfileData, value: string, options: any[], isOpen: boolean, _setIsOpen: (open: boolean) => void) => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? tempValue : (() => {
      const option = options.find(opt => opt.value === value);
      return option ? option.label : value;
    })();

    const handleLocalityChange = (selectedValue: any) => {
      if (isEditingThisField) {
        setTempValue(selectedValue.label);
      } else {
        setLocality(selectedValue.label);
        // Clear school data when locality changes
        // setSchoolName('');
        // setSchoolSearchTerm('');
      }
      if (selectedValue.value) {
        loadSchoolData(selectedValue.value);
      } else {
        setSchools([]);
        setFilteredSchools([]);
      }
    };
    return (
      <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">
          {label}
          {field === 'school_location' && (
            <span className="text-[#7E7E7E] text-base font-normal leading-[150%] ml-1">
              (City or Town)
            </span>
          )}
        </label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => isEditingThisField && _setIsOpen(false)}
            disabled={!isEditingThisField}
            className={`w-[400px] px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 text-left ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
              }`}
          >
            {displayValue}
          </button>
          {!isEditingThisField && (
            <button
              onClick={() => handleEditField(field, value)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '36.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}
          {!isOpen && isEditingThisField && (
            <div className="absolute top-full left-0 z-10 w-[400px] mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <div
                  key={index}
                  className="w-[400px] px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    handleLocalityChange(option);
                    _setIsOpen(true);
                  }}
                >
                  {typeof option === 'string' ? option : option.label}
                </div>
              ))}
            </div>
          )}
          {isEditingThisField && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '35rem' }}>
              <button
                onClick={handleSaveField}
                className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSchoolNameField = (label: string, field: keyof ProfileData, value: string) => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? schoolSearchTerm : value;

    const handleSchoolSearchChange = (searchTerm: string) => {
      if (isEditingThisField) {
        setSchoolSearchTerm(searchTerm);
        handleSchoolSearch(searchTerm);
      }
    };

    const handleSchoolSelect = (school: any) => {
      console.log(school, isEditingThisField)
      if (isEditingThisField) {
        const schoolLabel = school.school_label || school.school_name;
        console.log(schoolLabel, 'schoolLabel')
        setSchoolName(schoolLabel);
        setSchoolSearchTerm(schoolLabel);
        setShowSchoolDropdown(true);
      }
    };

    return (
      <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">
          {label}
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            name="schoolName"
            placeholder={locality ? "Search by school name or code..." : "Please select a city first"}
            value={displayValue}
            onChange={(e) => handleSchoolSearchChange(e.target.value)}
            onFocus={() => isEditingThisField && setShowSchoolDropdown(false)}
            disabled={!isEditingThisField || !locality}
            className={`w-[400px] px-4 py-4 pl-12 pr-12 border rounded-lg text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
              } ${!locality ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {!isEditingThisField && (
            <button
              onClick={() => handleEditField(field, value)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '36.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}

          {/* School Dropdown */}
          {!showSchoolDropdown && locality && filteredSchools.length > 0 && isEditingThisField && (
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

          {isEditingThisField && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '35rem' }}>
              <button
                onClick={handleSaveField}
                className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPhoneField = (label: string, field: keyof ProfileData, value: string) => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? tempValue : value;

  const handlePhoneChange = (newValue: string) => {
    // Check if user tried to enter invalid characters
    const hasInvalidChars = /[^0-9\s]/.test(newValue);
    if (hasInvalidChars) {
      toast.error('Only numbers and spaces are allowed in phone number');
    }
    
    // Remove any non-numeric characters except spaces
    const phoneValue = newValue.replace(/[^0-9\s]/g, '');
    if (isEditingThisField) {
      setTempValue(phoneValue);
    } else {
      setPhone(phoneValue);
    }
  };

    const handleCountryCodeChange = (newCode: string) => {
      if (isEditingThisField) {
        setCountryCode(newCode);
        setShowCountryDropdown(false); // Close dropdown after selection
      } else {
        setCountryCode(newCode);
        setShowCountryDropdown(false); // Close dropdown after selection
      }
    };

    return (
      <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">
          {label}
        </label>
        <div className="relative" ref={dropdownRef}>
          <div className="w-[400px] flex border rounded-lg bg-white">
            {/* Country Code Selector */}
            <div
              className={`flex items-center px-4 py-4 border-r border-gray-300 cursor-pointer hover:bg-gray-50 ${isEditingThisField ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
              onClick={() => isEditingThisField && setShowCountryDropdown(!showCountryDropdown)}
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
              value={displayValue}
              onChange={(e) => handlePhoneChange(e.target.value)}
              disabled={!isEditingThisField}
              className={`flex-1 px-4 py-4 text-sm bg-white placeholder-gray-500 focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
                }`}
            />
          </div>

          {/* Country Code Dropdown */}
          {showCountryDropdown && isEditingThisField && (
            <div className="absolute top-full left-0 z-10 w-64 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {countryCodes.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCountryCodeChange(country.code)}
                >
                  <span className="text-lg mr-3">{country.flag}</span>
                  <span className="text-sm text-gray-600 mr-2">{country.code}</span>
                  <span className="text-sm text-gray-800">{country.country}</span>
                </div>
              ))}
            </div>
          )}

          {!isEditingThisField && (
            <button
              onClick={() => handleEditField(field, value)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '36.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}

          {isEditingThisField && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '35rem' }}>
              <button
                onClick={handleSaveField}
                className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderField = (label: string, field: keyof ProfileData, value: string, type: 'text' | 'date' | 'email' | 'tel' | 'number' = 'text') => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? tempValue : value;

    // Determine if this field should be number-only for mobile
    const isNumberField = field === 'year_of_work_experience';
    const inputType = isNumberField ? 'number' : type;
    const inputMode = isNumberField ? 'numeric' : undefined;
    const pattern = isNumberField ? '[0-9]*' : undefined;

    return (
      <div className="mb-6">
        <label
          className="mb-2"
          style={{
            color: '#000',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
            marginBottom: '0.5rem',
            display: 'block'
          }}
        >
          {label}
        </label>
        <div className="relative">
          <input
            type={inputType}
            inputMode={inputMode}
            pattern={pattern}
            value={displayValue}
            onChange={(e) => {
              if (isNumberField) {
                // Check if user tried to enter non-numeric characters
                const hasNonNumeric = /[^0-9]/.test(e.target.value);
                if (hasNonNumeric) {
                  toast.error('Only numbers are allowed in this field');
                }
                
                // Remove any non-numeric characters for number fields
                const numericValue = e.target.value.replace(/[^0-9]/g, '');
                setTempValue(numericValue);
              } else {
                setTempValue(e.target.value);
              }
            }}
            disabled={!isEditingThisField}
            style={{
              display: 'flex',
              width: '400px',
              height: '40px',
              padding: '10px',
              alignItems: 'flex-start',
              gap: '10px'
            }}

            className={`border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500 w-full px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
              }`}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
          {!isEditingThisField && (
            <button
              onClick={() => handleEditField(field, value)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '36.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}
          {isEditingThisField && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '35rem' }}>
              <button
                onClick={handleSaveField}
                className="text-green-600 hover:text-green-800 text-sm font-medium mr-2"
              >
                ✓
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        {errors[field] && <p className="mt-1 text-xs text-red-600">{errors[field]}</p>}
      </div>
    );
  };
  const renderGradeField = (label: string, _field: keyof ProfileData, value: string) => {
    const currentGradeType = gradeType;
    const currentGrade = value;

    const getCurrentOptions = (): Array<{ value: string; label: string }> => {
      if (userType === 'student' && typeof gradeOptions === 'object' && currentGradeType) {
        return gradeOptions[currentGradeType as keyof typeof gradeOptions] || [];
      }
      return [];
    };

    const handleGradeChange = (newValue: string) => {
      setGrade(newValue);
    };

    const handleGradeTypeChange = (type: 'grade' | 'year' | 'programme' | 'other') => {
      setGradeType(type);
      setGrade(''); // Reset grade when type changes
    };

    return (
      <div className="mb-6">
        <label className="block text-base font-bold text-black mb-2">
          {label}
        </label>

        {/* Radio Button Selection */}
        <div className="w-[400px] border border-gray-300 rounded-lg p-4 mb-4">
          <div className="flex gap-4 bg-white">
            {(['grade', 'year', 'programme', 'other'] as const).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="gradeType"
                  value={type}
                  checked={currentGradeType === type}
                  onChange={() => handleGradeTypeChange(type)}
                  className="mr-3 w-5 h-5 text-[#1E395D] focus:ring-[#1E395D]"
                />
                <span className={`text-sm capitalize ${currentGradeType === type ? 'text-black' : 'text-gray-500'
                  }`}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Grade Selection Dropdown */}
        <div className="relative">
          <select
            name="grade"
            value={currentGrade}
            onChange={(e) => handleGradeChange(e.target.value)}
            disabled={!currentGradeType}
            className={`w-[400px] px-4 py-4 pr-10 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 appearance-none ${!currentGradeType ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-300'}`}
          >
            <option value="">Select {currentGradeType || 'option'}</option>
            {getCurrentOptions().map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  const profileDataHandlerEdit = async () => {
    try {
      // Only send avatar if it's not the default avatar
      const defaultAvatar = userType === 'student' ? StudentAvatar : TeacherAvatar;
      const avatarToSend = avatar === defaultAvatar ? undefined : avatar;

      const response = await updateUserProfileApi(fullname, username, birthday, gender, locality, schoolName, grade, yearOfWorkExperience, phone, email, avatarToSend, countryCode);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error('Failed to update profile: ' + response.message);
        console.log(response, 'response');
      }
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.data.message);
      console.log(error, 'error');
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-sm">
        <div className="mx-auto py-4" style={{ maxWidth: "85rem" }}>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#1E395D]">
              MunQuest
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate('/home')}
                className="flex flex-col items-center space-y-1 text-gray-600 hover:text-[#1E395D] transition-colors"
              >
                <img src={HomeIcon} alt="Home" className="w-6 h-6" />
                <span className="text-xs">Home</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-[#1E395D] transition-colors">
                <img src={NotificationIcon} alt="Notification" className="w-6 h-6" />
                <span className="text-xs">Notification</span>
              </button>
              <button className="flex flex-col items-center space-y-1 text-[#1E395D]">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
                <span className="text-xs">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto py-8" style={{ maxWidth: "65rem" }}>
        {/* Profile Header */}
        <div className="text-left mb-8">
          <div className="relative inline-block">
            <img
              src={avatar || (userType === 'student' ? StudentAvatar : TeacherAvatar)}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
              style={{ right: '-2.5rem', bottom: '-0.5rem' }}
            >
              <img src={EditIcon} alt="Edit Avatar" className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          <h1 className="font-bold text-gray-900 mt-4" style={{ fontSize: '30px' }}>
            {userType === 'student' ? 'Student' : 'Teacher'} Profile
          </h1>
        </div>

        {/* Profile Form */}
        <div className="rounded-lg shadow-sm p-4">
          {/* Username Field */}
          <div className="mb-6">
            <label
              style={{
                color: '#000',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                value={profileData.username}
                disabled
                style={{
                  display: 'flex',
                  width: '400px',
                  height: '40px',
                  padding: '10px',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
                className="border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Username is system generated</p>
          </div>

          {/* Name Field */}
          {renderFullnameField('Name', 'fullname', fullname)}

          {/* Date of Birth Field */}
          {renderField('Date of Birth', 'birthday', birthday, 'date')}

          {/* Gender Field */}
          {renderGenderField('Gender', 'gender', gender)}

          {/* Locality Field */}
          {renderLocalityField('Locality of School ', 'school_location', locality, localityOptions, showLocalityDropdown, setShowLocalityDropdown)}

          {/* School Name Field */}
          {renderSchoolNameField('School Name', 'school_name', schoolName)}

          {/* Grade/Year Field */}
          {userType === 'student' ? (
            renderGradeField(
              'Grade or Year or Programme',
              'grade',
              grade
            )
          ) : (
            renderField(
              'Years of Work Experience',
              'year_of_work_experience',
              yearOfWorkExperience,
              'number'
            )
          )}

          {/* Email Field */}
          {renderField('Email', 'email', email, 'email')}

          {/* Mobile Field */}
          {renderPhoneField('Mobile', 'phone_number', phone)}

          {/* Password Change Section */}
          <div className="mb-6">
            <label
              className="mb-2"
              style={{
                color: '#000',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                marginBottom: '0.5rem',
                display: 'block'
              }}
            >
              Change Password
            </label>
            {!showPasswordFields ? (
              <button
                onClick={() => setShowPasswordFields(true)}
                style={{
                  display: 'flex',
                  width: '400px',
                  height: '40px',
                  padding: '10px',
                  alignItems: 'flex-start',
                  gap: '10px'
                }}
                className="border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
              >
                Click to change password
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '40px',
                    padding: '10px',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                  className="border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    display: 'flex',
                    width: '400px',
                    height: '40px',
                    padding: '10px',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}
                  className="border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-500"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handlePasswordChange}
                    className="px-4 py-2 bg-[#1E395D] text-white rounded-lg text-sm hover:bg-[#0f2a47] transition-colors"
                  >
                    Save Password
                  </button>
                  <button
                    onClick={() => {
                      setShowPasswordFields(false);
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-left">
            <button
              onClick={() => {
                profileDataHandlerEdit();
              }}
              className={`text-white font-medium transition-all ${newPassword ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-[#C2A46D] hover:bg-[#B8945A]'
                }`}
              style={{
                display: 'flex',
                width: '120px',
                padding: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                borderRadius: '30px'
              }}
            >
              Save
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

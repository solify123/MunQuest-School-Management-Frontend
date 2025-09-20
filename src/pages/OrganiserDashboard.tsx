import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header, LoadingSpinner, DateRangePicker } from '../components/ui';
import { toast } from 'sonner';
import { eventImagefileUploadApi, getEventByIdApi, updateEventApi } from '../apis/Events';
import PageLoader from '../components/PageLoader';
import EditIcon from '../assets/edit_icon.svg';

const OrganiserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const [activeStep, setActiveStep] = useState('dashboard');
  const [eventName, setEventName] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [locality, setLocality] = useState('');
  const [school, setSchool] = useState('');
  const [area, setArea] = useState('');
  const [feesPerDelegate, setFeesPerDelegate] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [locality_id, setLocality_id] = useState('');
  const [school_id, setSchool_id] = useState('');
  const [area_id, setArea_id] = useState('');
  const [totalRevenue, setTotalRevenue] = useState('');
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // Editing states
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Leadership Roles state
  const [leadershipRoles, setLeadershipRoles] = useState([
    { id: 1, abbr: 'SG', role: 'Secretary General', username: '@iman1234', name: 'Iman Praveesh Hassan' },
    { id: 2, abbr: 'DG', role: 'Director General', username: '', name: '' },
    { id: 3, abbr: 'COM', role: 'Head of Committees', username: '', name: '' },
    { id: 4, abbr: 'DA', role: 'Head of Delegate Affairs', username: '', name: '' },
    { id: 5, abbr: 'CHR', role: 'Head of Chairs', username: '', name: '' },
    { id: 6, abbr: 'LOG', role: 'Head of Logistics', username: '', name: '' },
    { id: 7, abbr: 'PR', role: 'Head of Public Relations', username: '', name: '' },
    { id: 8, abbr: 'SM', role: 'Head of Social Media', username: '', name: '' }
  ]);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [editingFieldType, setEditingFieldType] = useState<'username' | 'name' | null>(null);

  // Committees state
  const [activeCommitteeType, setActiveCommitteeType] = useState('country');
  const [committees, setCommittees] = useState([
    { 
      id: 1, 
      abbr: 'UNGA', 
      committee: 'United Nations General Assembly', 
      seatsTotal: '30', 
      chairUsername: '@seema', 
      chairName: 'Seema Shams',
      deputyChair1Username: '@username',
      deputyChair1Name: 'Full Name',
      deputyChair2Username: '@username',
      deputyChair2Name: 'Full Name'
    },
    { 
      id: 2, 
      abbr: 'Auto Generated', 
      committee: '', 
      seatsTotal: '30', 
      chairUsername: '', 
      chairName: '',
      deputyChair1Username: '',
      deputyChair1Name: '',
      deputyChair2Username: '',
      deputyChair2Name: ''
    }
  ]);
  const [editingCommittee, setEditingCommittee] = useState<number | null>(null);
  const [editingCommitteeField, setEditingCommitteeField] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentEvents = async () => {
      try {
        const response = await getEventByIdApi(eventId || '');
        if (response.success) {
          console.log('API Response:', response);
          if (response.data && response.data.length > 0) {
            setEventName(response.data[0].name);
            setCoverImage(response.data[0].cover_image);
            setEventDescription(response.data[0].description);
            setEventStartDate(response.data[0].start_date);
            setEventEndDate(response.data[0].end_date);
            setLocality(response.data[0].locality.name);
            setSchool(response.data[0].school.name);
            setArea(response.data[0].school.name);
            setFeesPerDelegate(response.data[0].fees_per_delegate);
            setNumberOfSeats(response.data[0].number_of_seats);
            setWebsite(response.data[0].website);
            setInstagram(response.data[0].instagram);
            setLocality_id(response.data[0].locality.id);
            setSchool_id(response.data[0].school.id);
            setArea_id(response.data[0].school.area_id);
            // Calculate total revenue
            calculateTotalRevenue(response.data[0].number_of_seats, response.data[0].fees_per_delegate);
          }
        } else {
          toast.error(response.message);
        }
      } catch (error: any) {
        console.error('Error fetching events:', error);
        toast.error(error.message);
      }
    };
    getCurrentEvents();
  }, [eventId, navigate]);

  const handleStepChange = (step: string) => {
    setActiveStep(step);
  };

  // Handle field edit
  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setTempValue(currentValue);
  };

  // Auto-save field edit when value changes
  const handleFieldChange = (field: string, value: string) => {
    setTempValue(value);

    // Update the corresponding useState variable based on the field
    switch (field) {
      case 'name':
        setEventName(value);
        break;
      case 'description':
        setEventDescription(value);
        break;
      case 'date':
        // Handle date parsing if needed
        break;
      case 'school_name':
        setSchool(value);
        break;
      case 'locality':
        setLocality(value);
        break;
      case 'number_of_seats':
        setNumberOfSeats(value);
        calculateTotalRevenue(value, feesPerDelegate);
        break;
      case 'fees_per_delegate':
        setFeesPerDelegate(value);
        calculateTotalRevenue(numberOfSeats, value);
        break;
      case 'website':
        setWebsite(value);
        break;
      case 'instagram':
        setInstagram(value);
        break;
      default:
        break;
    }
  };

  // Cancel field edit
  const handleCancelEdit = () => {
    if (editingField) {
      // Reset the field value to its original state
      switch (editingField) {
        case 'name':
          setEventName(eventName);
          break;
        case 'description':
          setEventDescription(eventDescription);
          break;
        case 'date':
          // Handle date reset if needed
          break;
        case 'school_name':
          setSchool(school);
          break;
        case 'locality':
          setLocality(locality);
          break;
        case 'number_of_seats':
          setNumberOfSeats(numberOfSeats);
          calculateTotalRevenue(numberOfSeats, feesPerDelegate);
          break;
        case 'fees_per_delegate':
          setFeesPerDelegate(feesPerDelegate);
          calculateTotalRevenue(numberOfSeats, feesPerDelegate);
          break;
        case 'website':
          setWebsite(website);
          break;
        case 'instagram':
          setInstagram(instagram);
          break;
        default:
          break;
      }
    }
    setEditingField(null);
    setTempValue('');
    setShowDatePicker(false); // Close date picker when canceling edit
  };

  // Handle cover image upload (same as profile page avatar upload)
  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files) {
        // Set loading state based on image type
        setIsUploadingCoverImage(true);
        const response = await eventImagefileUploadApi(files?.[0] as File);
        if (response.success) {
          toast.success(response.message);
          setCoverImage(response.imageUrl);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsUploadingCoverImage(false);
    }

  };

  // Date picker handlers
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setEventStartDate(startDate);
    setEventEndDate(endDate);
    // Keep the date picker open so user can adjust dates if needed
  };

  const handleDatePickerToggle = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDatePickerClose = () => {
    setShowDatePicker(false);
  };

  // Leadership Roles handlers
  const handleRoleFieldEdit = (roleId: number, fieldType: 'username' | 'name', currentValue: string) => {
    setEditingRole(roleId);
    setEditingFieldType(fieldType);
    setTempValue(currentValue);
  };

  const handleRoleFieldChange = (value: string) => {
    setTempValue(value);
  };

  const handleRoleFieldSave = () => {
    if (editingRole && editingFieldType) {
      setLeadershipRoles(prev => prev.map(role =>
        role.id === editingRole
          ? { ...role, [editingFieldType]: tempValue }
          : role
      ));
    }
    setEditingRole(null);
    setEditingFieldType(null);
    setTempValue('');
  };

  const handleRoleFieldCancel = () => {
    setEditingRole(null);
    setEditingFieldType(null);
    setTempValue('');
  };

  const handleAddRole = () => {
    const newRole = {
      id: Math.max(...leadershipRoles.map(r => r.id)) + 1,
      abbr: '',
      role: '',
      username: '',
      name: ''
    };
    setLeadershipRoles([...leadershipRoles, newRole]);
  };

  const handleSaveLeadershipRoles = () => {
    // TODO: Implement API call to save leadership roles
    toast.success('Leadership roles saved successfully');
  };

  // Committees handlers
  const handleCommitteeTypeChange = (type: string) => {
    setActiveCommitteeType(type);
  };

  const handleCommitteeFieldEdit = (committeeId: number, fieldType: string, currentValue: string) => {
    setEditingCommittee(committeeId);
    setEditingCommitteeField(fieldType);
    setTempValue(currentValue);
  };

  const handleCommitteeFieldChange = (value: string) => {
    setTempValue(value);
  };

  const handleCommitteeFieldSave = () => {
    if (editingCommittee && editingCommitteeField) {
      setCommittees(prev => prev.map(committee => 
        committee.id === editingCommittee 
          ? { ...committee, [editingCommitteeField]: tempValue }
          : committee
      ));
    }
    setEditingCommittee(null);
    setEditingCommitteeField(null);
    setTempValue('');
  };

  const handleCommitteeFieldCancel = () => {
    setEditingCommittee(null);
    setEditingCommitteeField(null);
    setTempValue('');
  };

  const handleAddCommittee = () => {
    const newCommittee = {
      id: Math.max(...committees.map(c => c.id)) + 1,
      abbr: 'Auto Generated',
      committee: '',
      seatsTotal: '30',
      chairUsername: '',
      chairName: '',
      deputyChair1Username: '',
      deputyChair1Name: '',
      deputyChair2Username: '',
      deputyChair2Name: ''
    };
    setCommittees([...committees, newCommittee]);
  };

  const handleSaveCommittees = () => {
    // TODO: Implement API call to save committees
    toast.success('Committees saved successfully');
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

  // Save all changes
  const handleUpdateEvent = async () => {
    try {
      setIsSaving(true);
      // Calculate total revenue before updating
      calculateTotalRevenue(numberOfSeats, feesPerDelegate);
      console.log("eventName", eventName);
      console.log("eventDescription", eventDescription);
      console.log("eventStartDate", eventStartDate);
      console.log("eventEndDate", eventEndDate);
      console.log("coverImage", coverImage);
      console.log("locality_id", locality_id);
      console.log("school_id", school_id);
      console.log("area_id", area_id);
      console.log("website", website);
      console.log("instagram", instagram);
      console.log("totalRevenue", totalRevenue);
      console.log("numberOfSeats", numberOfSeats);
      console.log("feesPerDelegate", feesPerDelegate);
      const response = await updateEventApi(eventId || '', eventName, eventDescription, eventStartDate, eventEndDate, coverImage, '', locality_id, school_id, area_id, numberOfSeats, feesPerDelegate, totalRevenue, website, instagram);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error('Failed to update event: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'event-details', name: 'Event Details' },
    { id: 'leadership-roles', name: 'Leadership Roles' },
    { id: 'committees', name: 'Committees' },
    { id: 'agendas', name: 'Agendas' },
    { id: 'delegates', name: 'Delegates' },
    { id: 'general-documents', name: 'General Documents' }
  ];

  // Reusable field component
  const renderEditableField = (label: string, field: string, value: string, type: 'text' | 'textarea' = 'text', rows?: number, showEditButton: boolean = true) => {
    const isEditingThisField = editingField === field;
    const displayValue = isEditingThisField ? tempValue : value;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          {type === 'textarea' ? (
            <textarea
              value={displayValue}
              disabled={!isEditingThisField}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              rows={rows || 4}
              className={`w-[400px] px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
                }`}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          ) : (
            <input
              type={type}
              value={displayValue}
              disabled={!isEditingThisField}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              className={`w-[400px] px-4 py-3 border rounded-lg text-sm bg-white focus:outline-none focus:border-[#1E395D] focus:ring-2 focus:ring-[#1E395D] focus:ring-opacity-20 transition-all duration-200 ${isEditingThisField ? 'border-[#1E395D]' : 'border-gray-300 bg-gray-50'
                }`}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          )}

          {!isEditingThisField && showEditButton && (
            <button
              onClick={() => handleEditField(field, value)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '43.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}

          {isEditingThisField && showEditButton && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '43rem' }}>
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

  // Date field component with DateRangePicker
  const renderDateField = (label: string, field: string) => {
    const isEditingThisField = editingField === field;

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          {/* Date Range Input Field */}
          <div
            onClick={() => isEditingThisField && handleDatePickerToggle()}
            className={`w-[400px] px-4 py-3 border rounded-lg transition-colors ${isEditingThisField
              ? 'border-[#1E395D] cursor-pointer hover:border-[#1E395D]'
              : 'border-gray-300 bg-gray-50 cursor-not-allowed'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Start Date</span>
                  <span className="text-sm font-medium">
                    {eventStartDate ? new Date(eventStartDate).toLocaleDateString('en-GB') : 'DD / MM / YYYY'}
                  </span>
                </div>
                <div className="text-gray-400">to</div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">End Date</span>
                  <span className="text-sm font-medium">
                    {eventEndDate ? new Date(eventEndDate).toLocaleDateString('en-GB') : 'DD / MM / YYYY'}
                  </span>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Range Picker - positioned outside the input field */}
          {showDatePicker && isEditingThisField && (
            <div className="absolute top-full left-0 z-50 mt-1">
              <DateRangePicker
                startDate={eventStartDate}
                endDate={eventEndDate}
                onDateRangeChange={handleDateRangeChange}
                onClose={handleDatePickerClose}
                maxDays={7}
              />
            </div>
          )}

          {!isEditingThisField && (
            <button
              onClick={() => handleEditField(field, `${eventStartDate} - ${eventEndDate}`)}
              className="absolute top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              style={{ right: '43.75rem' }}
            >
              <img src={EditIcon} alt="Edit" className="w-4 h-4" />
            </button>
          )}

          {isEditingThisField && (
            <div className="absolute top-1/2 transform -translate-y-1/2 flex space-x-2" style={{ right: '43rem' }}>
              <button
                onClick={handleCancelEdit}
                className="text-red-600 hover:text-red-800 text-sm font-medium mr-2"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          {isEditingThisField ? 'Click on the date field to open calendar' : 'Select the start and end dates for your event'}
        </div>
      </div>
    );
  };

  // Leadership Roles component
  const renderLeadershipRoles = () => {
    return (
      <div className="space-y-6">
        {/* Leadership Roles Grid */}
        <div >
          {/* Grid Container */}
          <div className="grid grid-cols-[100px_200px_220px_280px] gap-4">
            {/* Header Row */}
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">ABBR</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Leadership Role</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Name</div>
            
            {/* Data Rows */}
            {leadershipRoles.map((role) => (
              <React.Fragment key={role.id}>
                {/* ABBR */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-900">{role.abbr}</span>
                </div>
                
                {/* Leadership Role */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  <span className="text-sm text-gray-900">{role.role}</span>
                </div>
                
                {/* Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingRole === role.id && editingFieldType === 'username' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleRoleFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="Enter username"
                        autoFocus
                      />
                      <button
                        onClick={handleRoleFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleRoleFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleRoleFieldEdit(role.id, 'username', role.username)}
                    >
                      {role.username || 'Enter username to populate fields'}
                    </div>
                  )}
                </div>
                
                {/* Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingRole === role.id && editingFieldType === 'name' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleRoleFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="Enter name"
                        autoFocus
                      />
                      <button
                        onClick={handleRoleFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleRoleFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleRoleFieldEdit(role.id, 'name', role.name)}
                    >
                      {role.name || '-'}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-[845px] flex justify-between">
          <button
            onClick={handleAddRole}
            className={`text-white font-medium transition-colors`}
            style={{
              width: '105px',
              height: '44px',
              borderRadius: '30px',
              padding: '10px',
              gap: '10px',
              opacity: 1,
              background: isSaving ? '#bdbdbd' : '#C2A46D',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Add Role
          </button>
          <button
            onClick={handleSaveLeadershipRoles}
            className={`text-white font-medium transition-colors`}
            style={{
              width: '105px',
              height: '44px',
              borderRadius: '30px',
              padding: '10px',
              gap: '10px',
              opacity: 1,
              background: isSaving ? '#bdbdbd' : '#C2A46D',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  // Committees component
  const renderCommittees = () => {
    const committeeTypes = [
      { id: 'country', name: 'Country Committees' },
      { id: 'role', name: 'Role Committees' },
      { id: 'crisis', name: 'Crisis Committees' },
      { id: 'open', name: 'Open Committees' }
    ];

    return (
      <div className="space-y-6">
        {/* Committee Type Navigation */}
        <div className="flex space-x-2">
          {committeeTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleCommitteeTypeChange(type.id)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeCommitteeType === type.id
                  ? 'bg-[#6A8BAF] text-white'
                  : 'bg-white text-black border border-gray-800'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        {/* Committees Grid */}
        <div>
          {/* Grid Container */}
          <div className="grid grid-cols-[80px_200px_100px_120px_120px_120px_120px_120px_120px] gap-4">
            {/* Header Row */}
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">ABBR</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Committee</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Seats Total</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Chair Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Chair Name</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 1 Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 1 Name</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 2 Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 2 Name</div>
            
            {/* Data Rows */}
            {committees.map((committee) => (
              <React.Fragment key={committee.id}>
                {/* ABBR */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-900">{committee.abbr}</span>
                </div>
                
                {/* Committee */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'committee' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                          className="w-full pl-10 pr-8 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                          placeholder="E.g. United Nations Security Council"
                          autoFocus
                        />
                        <button
                          onClick={() => handleCommitteeFieldChange('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'committee', committee.committee)}
                    >
                      {committee.committee || 'E.g. United Nations Security Council'}
                    </div>
                  )}
                </div>
                
                {/* Seats Total */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'seatsTotal' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="30"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'seatsTotal', committee.seatsTotal)}
                    >
                      {committee.seatsTotal}
                    </div>
                  )}
                </div>
                
                {/* Chair Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'chairUsername' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="@username"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'chairUsername', committee.chairUsername)}
                    >
                      {committee.chairUsername || '-'}
                    </div>
                  )}
                </div>
                
                {/* Chair Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'chairName' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="Full Name"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'chairName', committee.chairName)}
                    >
                      {committee.chairName || '-'}
                    </div>
                  )}
                </div>
                
                {/* Deputy Chair 1 Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair1Username' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="@username"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'deputyChair1Username', committee.deputyChair1Username)}
                    >
                      {committee.deputyChair1Username || '-'}
                    </div>
                  )}
                </div>
                
                {/* Deputy Chair 1 Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair1Name' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="Full Name"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'deputyChair1Name', committee.deputyChair1Name)}
                    >
                      {committee.deputyChair1Name || '-'}
                    </div>
                  )}
                </div>
                
                {/* Deputy Chair 2 Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair2Username' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="@username"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'deputyChair2Username', committee.deputyChair2Username)}
                    >
                      {committee.deputyChair2Username || '-'}
                    </div>
                  )}
                </div>
                
                {/* Deputy Chair 2 Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair2Name' ? (
                    <div className="flex items-center space-x-2 w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="Full Name"
                        autoFocus
                      />
                      <button
                        onClick={handleCommitteeFieldSave}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={handleCommitteeFieldCancel}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'deputyChair2Name', committee.deputyChair2Name)}
                    >
                      {committee.deputyChair2Name || '-'}
                    </div>
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-[845px] flex justify-between">
          <button
            onClick={handleAddCommittee}
            className={`text-white font-medium transition-colors`}
            style={{
              width: '105px',
              height: '44px',
              borderRadius: '30px',
              padding: '10px',
              gap: '10px',
              opacity: 1,
              background: isSaving ? '#bdbdbd' : '#C2A46D',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Add Committee
          </button>
          <button
            onClick={handleSaveCommittees}
            className={`text-white font-medium transition-colors`}
            style={{
              width: '105px',
              height: '44px',
              borderRadius: '30px',
              padding: '10px',
              gap: '10px',
              opacity: 1,
              background: isSaving ? '#bdbdbd' : '#C2A46D',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none',
            }}
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!eventName) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events available</h3>
          <p className="text-gray-500">Please create an event to view the dashboard.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Event Information */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Event</div>
              <div className="text-lg text-gray-800 p-[10px]  w-full">{eventName}</div>
            </div>
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Date</div>
              <div className="text-lg text-gray-800 p-[10px] w-full">{eventStartDate} - {eventEndDate}</div>
            </div>
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Locality</div>
              <div className="text-lg text-gray-800 p-[10px] w-full">{locality}</div>
            </div>
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Area</div>
              <div className="text-lg text-gray-800 p-[10px] w-full">{area || 'N/A'}</div>
            </div>
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Fees</div>
              <div className="text-lg text-gray-800 p-[10px] w-full">AED {feesPerDelegate}</div>
            </div>
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Delegates</div>
              <div className="text-lg text-gray-800 p-[10px] w-full">{numberOfSeats || '0'}</div>
            </div>
            <div className="flex justify-center items-center text-white border rounded-lg border border-gray-800">
              <div className="bg-[#607DA3] text-sm font-medium px-2.5 py-2 h-full rounded-l-[5px] flex justify-center items-center">Total Revenue</div>
              <div className="text-lg text-gray-800 p-[10px] w-full">AED {totalRevenue || '0'}</div>
            </div>
          </div>
        </div>

        {/* Allocation Summary */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-[800px] border border-gray-800 w-[570px]">
              <thead >
                <tr className="bg-[#607DA3] text-white ">
                  <th className="px-4 py-3 text-center border border-gray-800 w-[19%]"></th>
                  <th className="px-4 py-3 text-center border border-gray-800 w-[8%]">Count</th>
                  <th className="px-4 py-3 text-center border border-gray-800 w-[8%]">Seats</th>
                  <th className="px-4 py-3 text-center border border-gray-800 w-[8%]">Allocated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <tr>
                  <td className="px-4 py-3 text-center font-medium border border-gray-800">Total</td>
                  <td className="px-4 py-3 text-center border border-gray-800">13</td>
                  <td className="px-4 py-3 text-center border border-gray-800">360</td>
                  <td className="px-4 py-3 text-center border border-gray-800">202</td>
                </tr>
                <tr>
                  <td className="px-4 py-3  text-center font-medium border border-gray-800">Country Committees</td>
                  <td className="px-4 py-3  text-center border border-gray-800">5</td>
                  <td className="px-4 py-3  text-center border border-gray-800">150</td>
                  <td className="px-4 py-3  text-center border border-gray-800">100</td>
                </tr>
                <tr>
                  <td className="px-4 py-3  text-center font-medium border border-gray-800">Crisis Committees</td>
                  <td className="px-4 py-3  text-center border border-gray-800">4</td>
                  <td className="px-4 py-3  text-center border border-gray-800">120</td>
                  <td className="px-4 py-3  text-center border border-gray-800">35</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-center font-medium border border-gray-800">Role Committees</td>
                  <td className="px-4 py-3 text-center border border-gray-800">3</td>
                  <td className="px-4 py-3 text-center border border-gray-800">90</td>
                  <td className="px-4 py-3 text-center border border-gray-800">67</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-center font-medium border border-gray-800">Open Committees</td>
                  <td className="px-4 py-3 text-center border border-gray-800">0</td>
                  <td className="px-4 py-3 text-center border border-gray-800">0</td>
                  <td className="px-4 py-3 text-center border border-gray-800">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Status */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Status</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-2 w-[840px]">
              {/* Header Row */}
              <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
                <span>Committee Type</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
                <span>Committees</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
                <span>Seats Total</span>
              </div>
              <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
                <span>Seats Assigned</span>
              </div>
              <div className="bg-[#607DA3] text-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center justify-between">
                <span>Status</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Data Row 1 */}
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">Country</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center font-medium">WHO</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">
                <span className="text-red-600 font-medium">Full</span>
              </div>

              {/* Data Row 2 */}
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">Country</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center font-medium">UNGA</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">25</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">
                <span className="text-orange-600 font-medium">Filling</span>
              </div>

              {/* Data Row 3 */}
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">Crisis</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center font-medium">CMC</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">30</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">10</div>
              <div className="bg-white px-4 py-3 rounded-[5px] border border-gray-800 flex items-center">
                <span className="text-green-600 font-medium">Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEventDetails = () => {
    if (!eventName) {
      return (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No event selected</h3>
          <p className="text-gray-500">Please select an event to view details.</p>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Event Image Section */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Event Image</h2>
          </div>
          <div className="relative inline-block">
            {isUploadingCoverImage ? (
              <div className="w-[400px] h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <LoadingSpinner size="large" text="Uploading..." />
              </div>
            ) : (
              <div className="w-[400px] h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={coverImage || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop'}
                  alt={eventName}
                  className="w-[400px] h-full object-cover"
                />
              </div>
            )}
            <button
              onClick={() => !isUploadingCoverImage && fileInputRef.current?.click()}
              disabled={isUploadingCoverImage}
              className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isUploadingCoverImage
                ? 'bg-gray-300 cursor-not-allowed opacity-50'
                : 'hover:bg-gray-300'
                }`}
              style={{ right: '-1.5rem', bottom: '-0.5rem' }}
            >
              <img src={EditIcon} alt="Edit Cover Image" className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              disabled={isUploadingCoverImage}
              className="hidden"
            />
          </div>
        </div>

        {/* Event Details Form */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Event Information</h2>
          <div className="flex flex-col gap-6">
            {/* Event Name */}
            {renderEditableField('Event Name', 'name', eventName || '')}

            {/* Event Description */}
            {renderEditableField('Event Description', 'description', eventDescription || '', 'textarea', 4)}

            {/* Date */}
            {renderDateField('Date', 'date')}

            {/* School */}
            {renderEditableField('School', 'school_name', school || '', 'text', undefined, false)}

            {/* Locality */}
            {renderEditableField('Locality', 'locality', locality || '', 'text', undefined, false)}

            {/* Seats */}
            {renderEditableField('Seats', 'number_of_seats', numberOfSeats || '')}

            {/* Fees */}
            {renderEditableField('Fees', 'fees_per_delegate', feesPerDelegate || '')}

            {/* Total Revenue */}
            <div className="w-[400px] flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">Total Revenue</span>
              <div className="text-lg text-gray-800 font-medium">AED {totalRevenue || '0'}</div>
            </div>

            {/* Website */}
            {renderEditableField('Website', 'website', website || '')}

            {/* Instagram */}
            {renderEditableField('Instagram', 'instagram', instagram || '')}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-start">
            <button
              onClick={handleUpdateEvent}
              disabled={isSaving}
              className={`text-white font-medium transition-colors`}
              style={{
                width: '105px',
                height: '44px',
                borderRadius: '30px',
                padding: '10px',
                gap: '10px',
                opacity: 1,
                background: isSaving ? '#bdbdbd' : '#C2A46D',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                border: 'none',
                boxShadow: 'none',
              }}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 'dashboard':
        return renderDashboard();
      case 'event-details':
        return renderEventDetails();
      case 'leadership-roles':
        return renderLeadershipRoles();
      case 'committees':
        return renderCommittees();
      case 'agendas':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Agendas</h2><p className="text-gray-500 mt-2">Agendas management coming soon...</p></div>;
      case 'delegates':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Delegates</h2><p className="text-gray-500 mt-2">Delegates management coming soon...</p></div>;
      case 'general-documents':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">General Documents</h2><p className="text-gray-500 mt-2">General documents management coming soon...</p></div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <PageLoader loadingText="Loading Organiser Dashboard...">
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <Header maxWidth="max-w-[88rem]" />

        {/* Main Content */}
        <div className="max-w-[85rem] mx-auto px-6 py-8" style={{ paddingLeft: '10.5rem' }}>
          {/* Page Title and Navigation */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-medium text-[#C2A46D] mb-6">
                Organiser &gt; {steps.find(step => step.id === activeStep)?.name || 'Dashboard'}
              </h1>

              {/* Step Navigation */}
              <div className="flex items-center space-x-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${activeStep === step.id
                      ? 'bg-[#395579] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                  >
                    {step.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </PageLoader>
  );
};

export default OrganiserDashboard;

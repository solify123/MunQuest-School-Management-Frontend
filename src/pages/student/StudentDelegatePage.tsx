import React, { useState, useEffect } from 'react';
import { Header, Avatar } from '../../components/ui';
import { useParams } from 'react-router-dom';
import { getEventByIdApi, getSupportContactApi, getParticipationInfoApi, getRegistrationInfoApi } from '../../apis/Events';
import { toast } from 'sonner';
import DownloadIcon from '../../assets/download_icon.svg';
import PageLoader from '../../components/PageLoader';

const StudentDelegatePage: React.FC = () => {
  const { eventId } = useParams();
  const [currentStep, setCurrentStep] = useState('Event Info');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [locality, setLocality] = useState('');
  const [feesPerDelegate, setFeesPerDelegate] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [supportContacts, setSupportContacts] = useState<any[]>([]);
  const [participationInfo, setParticipationInfo] = useState({
    committee: '',
    country: '',
    generalDocuments: [] as Array<{ name: string; url: string }>,
    committeeDocuments: [] as Array<{ name: string; url: string }>
  });
  const [registrationInfo, setRegistrationInfo] = useState({
    registrationNo: '',
    username: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    schoolName: '',
    localityOfSchool: '',
    gradeOrYear: '',
    email: '',
    mobileNumber: '',
    munExperience: '',
    preferredCommittee1: '',
    preferredCommittee2: '',
    preferredCommittee3: '',
    foodPreference: 'vegetarian',
    foodAllergies: '',
    emergencyContactName: '',
    emergencyMobileNumber: ''
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const tabs = ['Event Info', 'Support Contact', 'Participation Info', 'Registration Info'];

  useEffect(() => {
    const getEventById = async () => {
      try {
        const response = await getEventByIdApi(eventId || '');
        if (response.success) {
          console.log(response);
          setName(response.data[0].name);
          setDescription(response.data[0].description);
          setStartDate(response.data[0].start_date);
          setEndDate(response.data[0].end_date);
          setLocality(response.data[0].locality);
          setFeesPerDelegate(response.data[0].fees_per_delegate);
          setWebsite(response.data[0].website);
          setInstagram(response.data[0].instagram);
          setCoverImage(response.data[0].cover_image);
        } else {
          toast.error('Failed to get event by id: ' + response.message);
        }
      } catch (error: any) {
        toast.error('Failed to get event by id: ' + error.message);
      }
    };
    getEventById();
  }, [eventId]);

  useEffect(() => {
    const getSupportContact = async () => {
      try {
        const response = await getSupportContactApi(eventId || '');
        if (response.success) {
          setSupportContacts(response.data || []);
        } else {
          // If no support contacts, show placeholder data
          setSupportContacts([
            {
              abbr: 'DA',
              role: 'Head of Delegate Affairs',
              username: '@iman1234',
              name: 'Iman Praveesh Hassan',
              mobile: '971 506505125',
              email: 'imanphassan@gmail.com'
            }
          ]);
        }
      } catch (error: any) {
        console.log('Support contact API not available, using placeholder data');
        // Fallback to placeholder data if API is not available
        setSupportContacts([
          {
            abbr: 'DA',
            role: 'Head of Delegate Affairs',
            username: '@iman1234',
            name: 'Iman Praveesh Hassan',
            mobile: '971 506505125',
            email: 'imanphassan@gmail.com'
          }
        ]);
      }
    };
    getSupportContact();
  }, [eventId]);

  useEffect(() => {
    const getParticipationInfo = async () => {
      try {
        const response = await getParticipationInfoApi(eventId || '');
        if (response.success) {
          setParticipationInfo(response.data || {
            committee: '',
            country: '',
            generalDocuments: [],
            committeeDocuments: []
          });
        } else {
          // Fallback to placeholder data
          setParticipationInfo({
            committee: 'UNGA - United Nations General Assembly',
            country: 'Australia',
            generalDocuments: [
              { name: 'MUN Handbook', url: '#' }
            ],
            committeeDocuments: [
              { name: 'UNGA_Agenda', url: '#' },
              { name: 'UNGA_Resolutions', url: '#' }
            ]
          });
        }
      } catch (error: any) {
        console.log('Participation info API not available, using placeholder data');
        // Fallback to placeholder data
        setParticipationInfo({
          committee: 'UNGA - United Nations General Assembly',
          country: 'Australia',
          generalDocuments: [
            { name: 'MUN Handbook', url: '#' }
          ],
          committeeDocuments: [
            { name: 'UNGA_Agenda', url: '#' },
            { name: 'UNGA_Resolutions', url: '#' }
          ]
        });
      }
    };
    getParticipationInfo();
  }, [eventId]);

  useEffect(() => {
    const getRegistrationInfo = async () => {
      try {
        const response = await getRegistrationInfoApi(eventId || '');
        if (response.success) {
          setRegistrationInfo(response.data || {
            registrationNo: '',
            username: '',
            name: '',
            dateOfBirth: '',
            gender: '',
            schoolName: '',
            localityOfSchool: '',
            gradeOrYear: '',
            email: '',
            mobileNumber: '',
            munExperience: '',
            preferredCommittee1: '',
            preferredCommittee2: '',
            preferredCommittee3: '',
            foodPreference: 'vegetarian',
            foodAllergies: '',
            emergencyContactName: '',
            emergencyMobileNumber: ''
          });
        } else {
          // Fallback to placeholder data
          setRegistrationInfo({
            registrationNo: '223344',
            username: '@sommt234',
            name: 'Sam Morgen Lee',
            dateOfBirth: '5 Oct 2008',
            gender: 'Male',
            schoolName: 'Oasis World School',
            localityOfSchool: 'Dubai',
            gradeOrYear: 'IB DP 2',
            email: 'somlee@gmail.com',
            mobileNumber: '+971 50 6382040',
            munExperience: '5',
            preferredCommittee1: 'UNSC - United Nations Security Council',
            preferredCommittee2: 'UNGA - United Nations General Assembly',
            preferredCommittee3: 'WHO - World Health Organization',
            foodPreference: 'vegetarian',
            foodAllergies: 'Peanut',
            emergencyContactName: 'Jim Morgan',
            emergencyMobileNumber: '+971 655 3131'
          });
        }
      } catch (error: any) {
        console.log('Registration info API not available, using placeholder data');
        // Fallback to placeholder data
        setRegistrationInfo({
          registrationNo: '223344',
          username: '@sommt234',
          name: 'Sam Morgen Lee',
          dateOfBirth: '5 Oct 2008',
          gender: 'Male',
          schoolName: 'Oasis World School',
          localityOfSchool: 'Dubai',
          gradeOrYear: 'IB DP 2',
          email: 'somlee@gmail.com',
          mobileNumber: '+971 50 6382040',
          munExperience: '5',
          preferredCommittee1: 'UNSC - United Nations Security Council',
          preferredCommittee2: 'UNGA - United Nations General Assembly',
          preferredCommittee3: 'WHO - World Health Organization',
          foodPreference: 'vegetarian',
          foodAllergies: 'Peanut',
          emergencyContactName: 'Jim Morgan',
          emergencyMobileNumber: '+971 655 3131'
        });
      }
    };
    getRegistrationInfo();
  }, [eventId]);

  const renderEventInfo = () => (
    <div className="space-y-6">
      <div className="w-[400px]">
        <img
          src={coverImage}
          alt="Event"
          className="w-[400px] h-64 object-cover rounded-lg"
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Event Name
          </label>
          <input
            type="text"
            value={name}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Event Description
          </label>
          <textarea
            value={description}
            readOnly
            rows={6}
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700 resize-none"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Date
          </label>
          <input
            type="text"
            value={startDate + ' - ' + endDate}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Locality
          </label>
          <input
            type="text"
            value={locality}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Fees
          </label>
          <input
            type="text"
            value={feesPerDelegate}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Website
          </label>
          <input
            type="text"
            value={website}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-700 mb-2">
            Instagram
          </label>
          <input
            type="text"
            value={instagram}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>
      </div>
    </div>
  );

  const renderSupportContact = () => (
    <div className="space-y-6">
      <div >
        {/* Table Headers */}
        <div className="flex gap-4 mb-4 ">
          <div className="bg-[#E3F2FD] rounded-lg text-center border border-gray-800" style={{ width: '80px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-sm font-medium text-[#1976D2]">ABBR</span>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg text-center border border-gray-800" style={{ width: '200px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-sm font-medium text-[#1976D2]">Role</span>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg text-center border border-gray-800" style={{ width: '140px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-sm font-medium text-[#1976D2]">Username</span>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg text-center border border-gray-800" style={{ width: '200px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-sm font-medium text-[#1976D2]">Name</span>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg text-center border border-gray-800" style={{ width: '120px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-sm font-medium text-[#1976D2]">Mobile</span>
          </div>
          <div className="bg-[#E3F2FD] rounded-lg text-center border border-gray-800" style={{ width: '220px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="text-sm font-medium text-[#1976D2]">Email</span>
          </div>
        </div>

        {/* Contact Data Rows */}
        {supportContacts.length > 0 ? (
          supportContacts.map((contact, index) => (
            <div key={index} className="flex gap-4 mb-3">
              <div className="bg-white border border-gray-200 flex justify-center items-center rounded-lg text-center" style={{ width: '80px', height: '60px' }}>
                <span className="text-sm text-gray-900">{contact.abbr}</span>
              </div>
              <div className="bg-white border border-gray-200 flex justify-center items-center rounded-lg text-center" style={{ width: '200px', height: '60px' }}>
                <span className="text-sm text-gray-900">{contact.role}</span>
              </div>
              <div className="bg-white border border-gray-200 flex justify-center items-center rounded-lg text-center" style={{ width: '140px', height: '60px' }}>
                <span className="text-sm text-gray-900">{contact.username}</span>
              </div>
              <div className="bg-white border border-gray-200 flex justify-center items-center rounded-lg text-center" style={{ width: '200px', height: '60px' }}>
                <span className="text-sm text-gray-900">{contact.name}</span>
              </div>
              <div className="bg-white border border-gray-200 flex justify-center items-center rounded-lg text-center" style={{ width: '120px', height: '60px' }}>
                <span className="text-sm text-gray-900">{contact.mobile}</span>
              </div>
              <div className="bg-white border border-gray-200 flex justify-center items-center rounded-lg text-center" style={{ width: '220px', height: '60px' }}>
                <span className="text-sm text-gray-900">{contact.email}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Support Contacts</h3>
            <p className="text-gray-500">Contact information will be displayed here when available.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderParticipationInfo = () => (
    <div className="space-y-8">
      {/* Committee Section */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Committee</h3>
          <input
            type="text"
            value={participationInfo.committee}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>
      </div>

      {/* Country Section */}
      <div className="flex items-center gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Country</h3>
          <input
            type="text"
            value={participationInfo.country}
            readOnly
            className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
          />
        </div>
      </div>

      {/* Documents Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-gray-900">Documents</h3>

        {/* General Documents Sub-section */}
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-800 mb-3">General</h4>
            <div className="space-y-3">
              {participationInfo.generalDocuments.map((doc, index) => (
                <div key={index} className="w-[400px] w-[400px] flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3">
                  <span className="text-sm text-gray-900">{doc.name}</span>
                  <button
                    onClick={() => window.open(doc.url, '_blank')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <img src={DownloadIcon} alt="Download" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Committee Related Documents Sub-section */}
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <h4 className="text-base font-semibold text-gray-800 mb-3">Committee Related</h4>
            <div className="space-y-3">
              {participationInfo.committeeDocuments.map((doc, index) => (
                <div key={index} className="w-[400px] flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3">
                  <span className="text-sm text-gray-900">{doc.name}</span>
                  <button
                    onClick={() => window.open(doc.url, '_blank')}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <img src={DownloadIcon} alt="Download" className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegistrationInfo = () => (
    <div className="flex gap-8">
      {/* Left Column - Registration Form */}
      <div className="flex-1 space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4 mb-8">
          <div style={{ width: '160px', height: '160px' }}>
            <Avatar 
              size="large" 
              className="w-[160px] h-[160px]"
            />
          </div>
        </div>

        {/* Registration Form */}
        <div className="w-[400px] gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Registration No. */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Registration No.</label>
            <input
              type="text"
              value={registrationInfo.registrationNo}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={registrationInfo.username}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={registrationInfo.name}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="text"
              value={registrationInfo.dateOfBirth}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
            <input
              type="text"
              value={registrationInfo.gender}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* School Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">School Name</label>
            <input
              type="text"
              value={registrationInfo.schoolName}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Locality of School */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Locality of School</label>
            <input
              type="text"
              value={registrationInfo.localityOfSchool}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Grade or Year */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Grade or Year</label>
            <input
              type="text"
              value={registrationInfo.gradeOrYear}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
            <input
              type="text"
              value={registrationInfo.email}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
            <input
              type="text"
              value={registrationInfo.mobileNumber}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* MUN Experience in Years */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">MUN Experience in Years</label>
            <input
              type="text"
              value={registrationInfo.munExperience}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Preferred Committee - Choice 1 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Committee - Choice 1</label>
            <input
              type="text"
              value={registrationInfo.preferredCommittee1}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Preferred Committee - Choice 2 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Committee - Choice 2</label>
            <input
              type="text"
              value={registrationInfo.preferredCommittee2}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Preferred Committee - Choice 3 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Committee - Choice 3</label>
            <input
              type="text"
              value={registrationInfo.preferredCommittee3}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Food Preference */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Food Preference</label>
            <div className="flex gap-3">
              <button
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  registrationInfo.foodPreference === 'vegetarian'
                    ? 'bg-[#D9C7A1] text-gray-900'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
              >
                Vegetarian
              </button>
              <button
                className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                  registrationInfo.foodPreference === 'non-vegetarian'
                    ? 'bg-[#D9C7A1] text-gray-900'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
              >
                Non-Vegetarian
              </button>
            </div>
          </div>

          {/* Food Allergies */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Food Allergies</label>
            <input
              type="text"
              value={registrationInfo.foodAllergies}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Contact Name</label>
            <input
              type="text"
              value={registrationInfo.emergencyContactName}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>

          {/* Emergency Mobile Number */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Mobile Number</label>
            <input
              type="text"
              value={registrationInfo.emergencyMobileNumber}
              readOnly
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        {/* Cancel Registration Button */}
        <div className="mt-8 relative">
          <button
            onClick={() => setShowCancelDialog(!showCancelDialog)}
            className="bg-[#D9C7A1] text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-[#C5B595] transition-colors"
          >
            Cancel Registration
          </button>

          {/* Cancel Confirmation Dialog */}
          {showCancelDialog && (
            <div className="absolute top-12 left-0 bg-white border border-gray-800 rounded-lg p-4 shadow-lg z-50">
              <div className="mb-3">
                <h4 className="font-medium text-gray-900">Confirm Cancel</h4>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowCancelDialog(false);
                    // Handle cancel registration logic here
                    toast.success('Registration cancelled successfully');
                  }}
                  className="text-red-600 font-medium hover:text-red-800 transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowCancelDialog(false)}
                  className="text-gray-900 font-medium hover:text-gray-700 transition-colors"
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (currentStep) {
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
    <PageLoader loadingText="Loading Delegate Page...">
      <div className="min-h-screen bg-gray-50">
        <Header />

      <div className="max-w-[80rem] px-6 py-8 flex flex-col items-left" style={{ marginLeft: '13rem' }}>
        <div className="flex items-center space-x-2 mb-8">
          {tabs.map((tab, index) => (
            <React.Fragment key={tab}>
              <button
                className={`flex items-center border border-gray-800 justify-center w-[200px] h-[58px] p-[5px] rounded-[20px] text-sm font-medium transition-all ${currentStep === tab
                  ? 'bg-[#1E395D] text-white'
                  : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                onClick={() => setCurrentStep(tab)}
              >
                {tab}
              </button>
              {index < tabs.length - 1 && (
                <span className="mx-3 text-gray-600 text-sm">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="">
          <div >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
    </PageLoader>
  );
};

export default StudentDelegatePage;

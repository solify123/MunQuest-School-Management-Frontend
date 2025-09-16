import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/ui';
import { toast } from 'sonner';
import { getCurrentEventsOfOrganiserApi } from '../apis/Events';
import PageLoader from '../components/PageLoader';

const Organiser: React.FC = () => {
  const navigate = useNavigate();
  const { step } = useParams<{ step?: string }>();
  const [activeStep, setActiveStep] = useState(step || 'dashboard');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);


  useEffect(() => {
    const getCurrentEvents = async () => {
      try {
        const response = await getCurrentEventsOfOrganiserApi();
        console.log('API Response:', response);
        if (response.success) {
          console.log('Events data:', response.data);
          if (response.data && response.data.length > 0) {
            console.log('First event structure:', response.data[0]);
            setSelectedEvent(response.data[0]); // Set first event as default
          }
        }
        else {
          toast.error(response.message);
        }
      } catch (error: any) {
        console.error('Error fetching events:', error);
        toast.error(error.message);
      }
    };
    getCurrentEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate('/event-create');
  };

  const handleStepChange = (step: string) => {
    setActiveStep(step);
    navigate(`/organiser/${step}`);
  };

  const steps = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'event-details', name: 'Event Details', icon: '📅' },
    { id: 'leadership-roles', name: 'Leadership Roles', icon: '👥' },
    { id: 'committees', name: 'Committees', icon: '🏛️' },
    { id: 'agendas', name: 'Agendas', icon: '📋' },
    { id: 'delegates', name: 'Delegates', icon: '🎓' },
    { id: 'general-documents', name: 'General Documents', icon: '📄' }
  ];

  const renderDashboard = () => {
    if (!selectedEvent) {
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Event</div>
              <div className="text-lg font-bold">{selectedEvent.name}</div>
            </div>
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Date</div>
              <div className="text-lg font-bold">{selectedEvent.start_date} - {selectedEvent.end_date}</div>
            </div>
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Locality</div>
              <div className="text-lg font-bold">{selectedEvent.locality}</div>
            </div>
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Area</div>
              <div className="text-lg font-bold">{selectedEvent.area || 'N/A'}</div>
            </div>
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Fees</div>
              <div className="text-lg font-bold">{selectedEvent.fees_per_delegate}</div>
            </div>
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Delegates</div>
              <div className="text-lg font-bold">50</div>
            </div>
            <div className="bg-[#1E395D] text-white p-4 rounded-lg">
              <div className="text-sm font-medium">Schools</div>
              <div className="text-lg font-bold">10</div>
            </div>
          </div>
        </div>

        {/* Allocation Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1E395D] text-white">
                  <th className="px-4 py-3 text-left">Count</th>
                  <th className="px-4 py-3 text-left">Seats</th>
                  <th className="px-4 py-3 text-left">Allocated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium">Total</td>
                  <td className="px-4 py-3">360</td>
                  <td className="px-4 py-3">202</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Country Committees</td>
                  <td className="px-4 py-3">150</td>
                  <td className="px-4 py-3">100</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Crisis Committees</td>
                  <td className="px-4 py-3">120</td>
                  <td className="px-4 py-3">35</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Role Committees</td>
                  <td className="px-4 py-3">90</td>
                  <td className="px-4 py-3">67</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">Open Committees</td>
                  <td className="px-4 py-3">0</td>
                  <td className="px-4 py-3">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Allocation Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Allocation Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1E395D] text-white">
                  <th className="px-4 py-3 text-left">Committee Type</th>
                  <th className="px-4 py-3 text-left">Committees</th>
                  <th className="px-4 py-3 text-left">Seats Total</th>
                  <th className="px-4 py-3 text-left">Seats Assigned</th>
                  <th className="px-4 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3">Country</td>
                  <td className="px-4 py-3 font-medium">WHO</td>
                  <td className="px-4 py-3">30</td>
                  <td className="px-4 py-3">30</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Full</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Country</td>
                  <td className="px-4 py-3 font-medium">UNGA</td>
                  <td className="px-4 py-3">30</td>
                  <td className="px-4 py-3">25</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">Filling</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3">Crisis</td>
                  <td className="px-4 py-3 font-medium">CMC</td>
                  <td className="px-4 py-3">30</td>
                  <td className="px-4 py-3">10</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Open</span>
                  </td>
                </tr>
              </tbody>
            </table>
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
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Event Details</h2><p className="text-gray-500 mt-2">Event details management coming soon...</p></div>;
      case 'leadership-roles':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Leadership Roles</h2><p className="text-gray-500 mt-2">Leadership roles management coming soon...</p></div>;
      case 'committees':
        return <div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-900">Committees</h2><p className="text-gray-500 mt-2">Committees management coming soon...</p></div>;
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
              <h1 className="text-4xl font-medium text-[#C2A46D] mb-6">Organiser &gt; Dashboard</h1>

              {/* Step Navigation */}
              <div className="flex items-center space-x-2">
                {steps.map((step) => (
                <button
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      activeStep === step.id
                        ? 'bg-[#1E395D] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {step.icon} {step.name}
                </button>
              ))}
            </div>
          </div>

          {/* Create Event Button */}
          <button
            onClick={handleCreateEvent}
            style={{
              display: 'flex',
              width: '160px',
              height: '40px',
              padding: '10px',
              justifyContent: 'center',
              alignItems: 'center',
              flexShrink: 0,
              borderRadius: '30px',
              backgroundColor: '#1E395D',
              color: 'white',
              fontWeight: 500,
              transition: 'background-color 0.2s',
            }}
            className="font-medium hover:bg-[#1a2f4a]"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Event
          </button>
        </div>

          {/* Step Content */}
          {renderStepContent()}
      </div>
    </div>
    </PageLoader>
  );
};

export default Organiser;

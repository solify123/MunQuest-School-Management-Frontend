import React, { useState } from 'react';
import { Header } from '../components/ui';
import PageLoader from '../components/PageLoader';
import MasterlistsNavigation from '../components/SuperUser/MasterlistsNavigation';
import EventsPage from '../components/SuperUser/EventsPage';
import OrganisersPage from '../components/SuperUser/OrganisersPage';
import { useApp } from '../contexts/AppContext';

const SuperUser: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Use context for dashboard statistics
  const { allUsers, allOrganisers } = useApp();
  // Convert context stats to display format
  const statsDisplay = [
    { title: 'Users', value: allUsers.length.toString() },
    { title: 'Students', value: allUsers.filter(user => user.role === 'student').length.toString() },
    { title: 'Teachers', value: allUsers.filter(user => user.role === 'teacher').length.toString() },
    { title: 'Organisers', value: allOrganisers.filter(organiser => organiser.status === 'approved').length.toString() },  
    { title: 'Pending Approvals', value: allOrganisers.filter(organiser => organiser.status === 'pending').length.toString() },
    { title: 'Schools', value: '70' },
  ];


  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'masterlists':
        return 'Masterlists';
      case 'events-related':
        return 'Masterlists > Events Related';
      case 'events':
        return 'Masterlists > Events Related > Events';
      case 'organisers':
        return 'Masterlists > Events Related > Organisers';
      case 'leadership-roles':
        return 'Masterlists > Events Related > Leadership Roles';
      case 'committees':
        return 'Masterlists > Events Related > Committees';
      case 'students':
        return 'Masterlists > Events Related > Organisers > Students';
      case 'teachers':
        return 'Masterlists > Events Related > Organisers > Teachers';
      case 'users-related':
        return 'Masterlists > Users Related';
      case 'schools-related':
        return 'Masterlists > Schools Related';
      default:
        return 'Dashboard';
    }
  }; 

  const renderDashboard = () => {
    return (
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-6 gap-6">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-[#607DA3] px-4 py-3">
                <h3 className="text-white font-semibold text-sm text-center">
                  {stat.title}
                </h3>
              </div>
              {/* Value */}
              <div className="bg-white px-4 py-6">
                <div className="text-3xl font-bold text-gray-900 text-center">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMasterlists = () => {
    return (
      <div className="space-y-6">
        {activeTab === 'events' && <EventsPage />}
        
        {/* {activeTab === 'organisers' && <OrganisersPage type="organisers" />} */}
        
        {activeTab === 'students' && <OrganisersPage type="students" />}
        
        {activeTab === 'teachers' && <OrganisersPage type="teachers" />}
        
        {activeTab === 'leadership-roles' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Leadership Roles</h2>
            <p className="text-gray-500 mt-2">Leadership roles management coming soon...</p>
          </div>
        )}
        
        {activeTab === 'committees' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Committees</h2>
            <p className="text-gray-500 mt-2">Committees management coming soon...</p>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'masterlists':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Masterlists</h2>
            <p className="text-gray-500 mt-2">Select a category to manage...</p>
          </div>
        );
      case 'events-related':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Events Related</h2>
            <p className="text-gray-500 mt-2">Select a specific category to manage...</p>
          </div>
        );
      case 'users-related':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Users Related</h2>
            <p className="text-gray-500 mt-2">Users management coming soon...</p>
          </div>
        );
      case 'schools-related':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Schools Related</h2>
            <p className="text-gray-500 mt-2">Schools management coming soon...</p>
          </div>
        );
      case 'events':
      case 'organisers':
      case 'students':
      case 'teachers':
      case 'leadership-roles':
      case 'committees':
        return renderMasterlists();
      default:
        return renderDashboard();
    }
  };

  return (
    <PageLoader loadingText="Loading Super User Dashboard...">
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <Header maxWidth="max-w-[88rem]" />

        {/* Main Content */}
        <div className="max-w-[85rem] mx-auto px-6 py-8" style={{ paddingLeft: '10.5rem' }}>
          {/* Page Title */}
          <div className="text-left mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
          </div>

          {/* Main Navigation */}
          <div className="flex justify-left mb-8">
            <MasterlistsNavigation 
              activeSection={activeTab}
              onSectionChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          {renderContent()}
        </div>
      </div>
    </PageLoader>
  );
};

export default SuperUser;

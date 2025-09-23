import React, { useState, useMemo } from 'react';
import SchoolsTable from './SchoolsTable';
import { useApp } from '../../contexts/AppContext';

interface SchoolsPageProps {
  type?: 'schools' | 'localities';
  selectedLocality?: number; // Index of selected locality (0 = Dubai, 1 = Abu Dhabi, etc.)
}

const SchoolsPage: React.FC<SchoolsPageProps> = ({ type = 'schools', selectedLocality = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { allSchools } = useApp();

  // Define locality mapping
  const localityMapping = [
    'Dubai',
    'Abu Dhabi', 
    'Al Ain',
    'Sharjah',
    'Ajman',
    'Ras Al Khaimah',
    'Umm Al Quwain',
    'Other'
  ];

  // Debug logging
  console.log('SchoolsPage - Props:', { type, selectedLocality });
  console.log('SchoolsPage - allSchools:', allSchools);
  console.log('SchoolsPage - Selected Locality Name:', localityMapping[selectedLocality]);

  // Filter schools based on type, locality, and search term
  const filteredData = useMemo(() => {
    console.log('SchoolsPage - Filtering data...');
    if (!allSchools || allSchools.length === 0) {
      console.log('SchoolsPage - No schools data available');
      return [];
    }

    let data = allSchools;
    const selectedLocalityName = localityMapping[selectedLocality];
    console.log('SchoolsPage - Filtering by locality:', selectedLocalityName);

    // Filter by locality first
    if (selectedLocalityName && selectedLocalityName !== 'Other') {
      data = allSchools.filter((school: any) => {
        const schoolLocality = school?.locality?.name || '';
        const matches = schoolLocality.toLowerCase() === selectedLocalityName.toLowerCase();
        if (matches) {
          console.log('SchoolsPage - Matching school found:', school.name, 'in', schoolLocality);
        }
        return matches;
      });
      console.log('SchoolsPage - Schools after locality filter:', data.length);
    } else if (selectedLocalityName === 'Other') {
      // For 'Other', show schools that don't match any of the main localities
      const mainLocalities = ['Dubai', 'Abu Dhabi', 'Al Ain', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Umm Al Quwain'];
      data = allSchools.filter((school: any) => {
        const schoolLocality = school?.locality?.name || '';
        const isOther = !mainLocalities.some(locality => 
          schoolLocality.toLowerCase() === locality.toLowerCase()
        );
        if (isOther) {
          console.log('SchoolsPage - Other locality school found:', school.name, 'in', schoolLocality);
        }
        return isOther;
      });
      console.log('SchoolsPage - Other locality schools:', data.length);
    }

    // Apply search filter if search term exists
    if (!searchTerm.trim()) {
      console.log('SchoolsPage - No search term, returning filtered data:', data.length);
      return data;
    }

    console.log('SchoolsPage - Applying search filter:', searchTerm);
    const searchLower = searchTerm.toLowerCase();
    const searchFiltered = data.filter((item: any) => {
      const schoolId = item?.id?.toString().toLowerCase() || '';
      const schoolCode = item?.code?.toLowerCase() || '';
      const schoolName = item?.name?.toLowerCase() || '';
      const locality = item?.locality?.name?.toLowerCase() || '';
      const area = item?.area?.name?.toLowerCase() || '';
      const status = item?.status?.toLowerCase() || '';

      const matches = schoolId.includes(searchLower) ||
        schoolCode.includes(searchLower) ||
        schoolName.includes(searchLower) ||
        locality.includes(searchLower) ||
        area.includes(searchLower) ||
        status.includes(searchLower);
      
      if (matches) {
        console.log('SchoolsPage - Search match found:', item.name);
      }
      return matches;
    });
    
    console.log('SchoolsPage - Final filtered data:', searchFiltered.length);
    return searchFiltered;
  }, [type, allSchools, searchTerm, selectedLocality]);

  const handleSchoolAction = (action: string, schoolId: string) => {
    console.log(`Action: ${action} on School: ${schoolId}`);
    // Implement action logic here
    switch (action) {
      case 'active':
        // Handle activate action
        break;
      case 'inactive':
        // Handle deactivate action
        break;
      case 'edit':
        // Handle edit action
        break;
      case 'delete':
        // Handle delete action
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-[1000px] space-y-6">
      {/* Search Bar */}
      <div className="flex justify-left">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-800 rounded-[10px] leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Data Table */}
      <SchoolsTable
        schools={filteredData}
        onAction={handleSchoolAction}
        schoolType={type}
      />
    </div>
  );
};

export default SchoolsPage;

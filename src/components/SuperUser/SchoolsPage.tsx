import React, { useState, useMemo } from 'react';
import SchoolsTable from './SchoolsTable';
import SchoolsLocalitiesTable from './Schools-LocalitiesTable';
import { useApp } from '../../contexts/AppContext';

interface SchoolsPageProps {
  type?: 'schools' | 'localities';
  selectedLocality?: number; // Index of selected locality (0 = Dubai, 1 = Abu Dhabi, etc.)
}

const SchoolsPage: React.FC<SchoolsPageProps> = ({ type = 'schools', selectedLocality = 0 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { allSchools, allLocalities, allUsers } = useApp();

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
  // Filter data based on type, locality, and search term
  const filteredData = useMemo(() => {
    let data: any[] = [];
    
    if (type === 'localities') {
      // Create localities data from schools data if allLocalities is empty
      if (!allLocalities || allLocalities.length === 0) {
        if (allSchools && allSchools.length > 0) {
          // Group schools by locality and area to create localities data
          const localityMap = new Map();
          console.log('----------------------allSchools:', allSchools);
          allSchools.forEach((school: any) => {
            const localityName = school?.locality?.name || 'Unknown';
            const areaName = school?.area?.name || 'Unknown';
            const localityCode = school?.locality?.code || localityName.substring(0, 2).toUpperCase();
            const areaCode = school?.area?.code || areaName.substring(0, 3).toUpperCase();
            
            const key = `${localityName}-${areaName}`;
            
            if (!localityMap.has(key)) {
              localityMap.set(key, {
                id: key,
                locality: {
                  code: localityCode,
                  name: localityName
                },
                area: {
                  code: areaCode,
                  name: areaName
                },
                linkedSchoolsCount: 0,
                linkedStudentsCount: 0,
                status: 'Active'
              });
            }
            
            // Count schools in this area
            localityMap.get(key).linkedSchoolsCount += 1;
          });
          
          data = Array.from(localityMap.values());
          
          // Calculate actual student count by checking user.school relationships
          if (allUsers && allUsers.length > 0) {
            console.log('Calculating student counts for localities...');
            data.forEach((localityItem: any) => {
              const areaCode = localityItem.area.code;
              const localityCode = localityItem.locality.code;
              
              // Find schools in this area and locality
              const schoolsInArea = allSchools.filter((school: any) => {
                return school.area && school.area.code === areaCode && 
                       school.locality && school.locality.code === localityCode;
              });
              
              // Count students who belong to schools in this area and locality
              const studentCount = allUsers.filter((user: any) => {
                if (!user.school || typeof user.school !== 'object') return false;
                
                // Check if user's school is in the current area and locality
                return schoolsInArea.some((school: any) => {
                  return user.school.id === school.id && 
                         user.school.area_id === school.area_id && 
                         user.school.locality_id === school.locality_id;
                });
              }).length;
              
              localityItem.linkedStudentsCount = studentCount;
              console.log(`Area ${areaCode}, Locality ${localityCode}: ${studentCount} students`);
            });
          }
        } else {
          // Mock localities data for demonstration
          data = [
            {
              id: 'DU-NAS',
              locality: { code: 'DU', name: 'Dubai' },
              area: { code: 'NAS', name: 'Nad Al Shiba' },
              linkedSchoolsCount: 20,
              linkedStudentsCount: 300,
              status: 'Active'
            },
            {
              id: 'DU-ALQ',
              locality: { code: 'DU', name: 'Dubai' },
              area: { code: 'ALQ', name: 'Al Quoz' },
              linkedSchoolsCount: 10,
              linkedStudentsCount: 200,
              status: 'Active'
            },
            {
              id: 'AD-COR',
              locality: { code: 'AD', name: 'Abu Dhabi' },
              area: { code: 'COR', name: 'Corniche' },
              linkedSchoolsCount: 15,
              linkedStudentsCount: 250,
              status: 'Active'
            }
          ];
        }
      } else {
        data = allLocalities;
      }
    } else {
      if (!allSchools || allSchools.length === 0) {
        return [];
      }
      data = allSchools;
    }

    const selectedLocalityName = localityMapping[selectedLocality];

    // Filter by locality first (for both schools and localities)
    if (selectedLocalityName && selectedLocalityName !== 'Other') {
      data = data.filter((item: any) => {
        const itemLocality = type === 'localities' ? item?.locality?.name : item?.locality?.name || '';
        const matches = itemLocality.toLowerCase() === selectedLocalityName.toLowerCase();
        return matches;
      });
    } else if (selectedLocalityName === 'Other') {
      // For 'Other', show items that don't match any of the main localities
      const mainLocalities = ['Dubai', 'Abu Dhabi', 'Al Ain', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Umm Al Quwain'];
      data = data.filter((item: any) => {
        const itemLocality = type === 'localities' ? item?.locality?.name : item?.locality?.name || '';
        const isOther = !mainLocalities.some(locality => 
          itemLocality.toLowerCase() === locality.toLowerCase()
        );
        if (isOther) {
          console.log(`SchoolsPage - Other locality ${type} found:`, type === 'localities' ? item.area?.name : item.name, 'in', itemLocality);
        }
        return isOther;
      });
      console.log(`SchoolsPage - Other locality ${type}:`, data.length);
    }

    // Apply search filter if search term exists
    if (!searchTerm.trim()) {
      console.log('SchoolsPage - No search term, returning filtered data:', data.length);
      return data;
    }

    console.log('SchoolsPage - Applying search filter:', searchTerm);
    const searchLower = searchTerm.toLowerCase();
    const searchFiltered = data.filter((item: any) => {
      if (type === 'localities') {
        const localityCode = item?.localityCode || item?.code || '';
        const localityName = item?.localityName || item?.locality?.name || '';
        const areaCode = item?.areaCode || item?.area?.code || '';
        const areaName = item?.areaName || item?.area?.name || '';
        const linkedSchools = item?.linkedSchools || item?.schoolsCount || '';
        const linkedStudents = item?.linkedStudents || item?.studentsCount || '';
        const status = item?.status || '';

        const matches = localityCode.toLowerCase().includes(searchLower) ||
          localityName.toLowerCase().includes(searchLower) ||
          areaCode.toLowerCase().includes(searchLower) ||
          areaName.toLowerCase().includes(searchLower) ||
          linkedSchools.toString().includes(searchLower) ||
          linkedStudents.toString().includes(searchLower) ||
          status.toLowerCase().includes(searchLower);
        
        if (matches) {
          console.log('SchoolsPage - Search match found:', item.localityName || item.name);
        }
        return matches;
      } else {
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
      }
    });
    
    console.log('SchoolsPage - Final filtered data:', searchFiltered.length);
    return searchFiltered;
  }, [type, allSchools, allLocalities, searchTerm, selectedLocality]);

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
      {type === 'localities' ? (
        <SchoolsLocalitiesTable
          localities={filteredData}
          onAction={handleSchoolAction}
          localityType={type}
        />
      ) : (
        <SchoolsTable
          schools={filteredData}
          onAction={handleSchoolAction}
          schoolType={type}
        />
      )}
    </div>
  );
};

export default SchoolsPage;

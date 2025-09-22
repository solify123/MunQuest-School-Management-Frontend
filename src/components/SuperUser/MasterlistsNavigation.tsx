import React, { useEffect } from 'react';

interface MasterlistsNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  usersSubSection: boolean;
  setUsersSubSection: (section: boolean) => void;
}

const MasterlistsNavigation: React.FC<MasterlistsNavigationProps> = ({
  activeSection,
  onSectionChange,
  usersSubSection,
  setUsersSubSection
}) => {
  const sections = [
    { id: 'events-related', label: 'Events Related' },
    { id: 'users-related', label: 'Users Related' },
    { id: 'schools-related', label: 'Schools Related' }
  ];
  const subSections = {
    'events-related': [
      { id: 'events', label: 'Events' },
      { id: 'organisers', label: 'Organisers' },
      { id: 'leadership-roles', label: 'Leadership Roles' },
      { id: 'committees', label: 'Committees' }
    ],
    'users-related': [
      { id: 'users', label: 'Users' },
      { id: 'superusers', label: 'Superusers' },
    ],
    'schools-related': [
      { id: 'schools', label: 'Schools' },
      { id: 'departments', label: 'Departments' },
      { id: 'programs', label: 'Programs' }
    ]
  };


  const getButtonStyle = (isActive: boolean, isSubSection: boolean = false, isParent: boolean = false) => {
    const baseStyle = "font-medium transition-colors duration-200";

    if (isSubSection) {
      return `${baseStyle} ${isActive
          ? 'bg-[#C6DAF4] text-white'
          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
        }`;
    }

    // Handle parent state with lighter blue
    if (isParent && !isActive) {
      return `${baseStyle} bg-[#607DA3] text-white`;
    }

    return `${baseStyle} ${isActive
        ? 'bg-[#1E395D] text-white'
        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
      }`;
  };

  const isMainSectionActive = (sectionId: string) => {
    return activeSection === sectionId ||
      (sectionId === 'masterlists' && ['events-related', 'users-related', 'schools-related', 'events', 'organisers', 'leadership-roles', 'committees', 'students', 'teachers', 'users', 'superusers', 'global-students', 'global-teachers', 'users-students', 'users-teachers'].includes(activeSection));
  };

  const isSubSectionActive = (sectionId: string) => {
    // Only highlight the main category if we're on that category page, not on a sub-page
    if (sectionId === 'events-related') {
      return activeSection === 'events-related' || activeSection === 'events' || activeSection === 'organisers' || activeSection === 'leadership-roles' || activeSection === 'committees' || activeSection === 'students' || activeSection === 'teachers';
    }
    if (sectionId === 'users-related') {
      return activeSection === 'users-related' || activeSection === 'global-students' || activeSection === 'global-teachers';
    }
    if (sectionId === 'schools-related') {
      return activeSection === 'schools-related';
    }
    if (sectionId === 'organisers') {
      return activeSection === 'students' || activeSection === 'teachers';
    }
    if (sectionId === 'users') {
      return activeSection === 'users' || activeSection === 'users-students';
    }
    if (sectionId === 'superusers') {
      return activeSection === 'superusers' || activeSection === 'users-teachers';
    }
    return activeSection === sectionId;
  };

  const isSubSectionParent = (sectionId: string) => {
    // Check if this section is a parent of the currently active section
    if (sectionId === 'events-related') {
      return ['events', 'organisers', 'leadership-roles', 'committees', 'students', 'teachers'].includes(activeSection);
    }
    if (sectionId === 'users-related') {
      return ['users', 'superusers', 'users-students', 'users-teachers'].includes(activeSection);
    }
    if (sectionId === 'schools-related') {
      return ['schools', 'departments', 'programs'].includes(activeSection);
    }
    if (sectionId === 'organisers') {
      return ['students', 'teachers'].includes(activeSection);
    }
    return false;
  };
  
  useEffect(() => {
    if (activeSection === 'users') {
      setUsersSubSection(true);
    } else {
      setUsersSubSection(true);
    }
  }, [activeSection])
  
  return (
    <div className="space-y-4">
      {/* Main Navigation Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => onSectionChange('dashboard')}
          className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isMainSectionActive('dashboard'))}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSectionChange('events')}
          className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isMainSectionActive('masterlists'))}`}
        >
          Masterlists
        </button>
      </div>

      {/* Sub Navigation Buttons */}
      {(isMainSectionActive('masterlists') || activeSection === 'events' || activeSection === 'students' || activeSection === 'teachers' || activeSection === 'users' || activeSection === 'superusers' || activeSection === 'global-students' || activeSection === 'global-teachers' || activeSection === 'users-students' || activeSection === 'users-teachers') && (
        <div className="space-y-2">
          {/* First row of sub-sections */}
          <div className="flex space-x-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id === 'users-related' ? 'users' : section.id);
                }}
                className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isSubSectionActive(section.id), false, isSubSectionParent(section.id))}`}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Second row of sub-sections */}
          {(activeSection === 'events-related' || activeSection === 'events' || activeSection === 'organisers' || activeSection === 'leadership-roles' || activeSection === 'committees' || activeSection === 'students' || activeSection === 'teachers') ? (
            <div className="flex space-x-2">
              {subSections['events-related']?.map((subSection) => (
                <button
                  key={subSection.id}
                  onClick={() => onSectionChange(subSection.id === 'organisers' ? 'students' : subSection.id)}
                  className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isSubSectionActive(subSection.id), true, isSubSectionParent(subSection.id))}`}
                >
                  {subSection.label}
                </button>
              ))}
            </div>
          ) : null}
          
          {/* Third row for Organisers sub-sections */}
          {activeSection === 'students' || activeSection === 'teachers' ? (
            <div className="flex space-x-2">
              <button
                onClick={() => onSectionChange('students')}
                className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isSubSectionActive('students'), true)}`}
              >
                Students
              </button>
              <button
                onClick={() => onSectionChange('teachers')}
                className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isSubSectionActive('teachers'), true)}`}
              >
                Teachers
              </button>
            </div>
          ) : null}

          {/* new users related sub-sections */}
          {
            (activeSection === 'users-related' || activeSection === 'users' || activeSection === 'superusers' || activeSection === 'users-students' || activeSection === 'users-teachers') ? (
              <div className="flex space-x-2">
                {subSections['users-related']?.map((subSection) => (
                  <button
                    key={subSection.id}
                    onClick={() => {
                      onSectionChange(subSection.id);
                    }}
                    className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] ${getButtonStyle(isSubSectionActive(subSection.id), true, isSubSectionParent(subSection.id))}`}
                  >
                    {subSection.label}
                  </button>
                ))}
              </div>
            ) : null
          }

          {/* new users related sub-sections */}
          {(activeSection === 'users-related' || activeSection === 'users' || activeSection === 'superusers' || activeSection === 'users-students' || activeSection === 'users-teachers') ? (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setUsersSubSection(true);
                }}
                className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] font-medium transition-colors duration-200 ${usersSubSection ? 'bg-[#C6DAF4] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              >
                Students
              </button>
              <button
                onClick={() => {
                  setUsersSubSection(false);
                }}
                className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm rounded-[20px] font-medium transition-colors duration-200 ${!usersSubSection ? 'bg-[#C6DAF4] text-white' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              >
                Teachers
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default MasterlistsNavigation;

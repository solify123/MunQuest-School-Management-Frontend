import React, { useState, useRef, useEffect } from 'react';

interface LeadershipRole {
  id: number;
  abbr: string;
  role: string;
  username: string;
  name: string;
}

interface LeadershipRolesPageProps {
  leadershipRoles: LeadershipRole[];
  editingRole: number | null;
  editingFieldType: 'username' | 'name' | null;
  tempValue: string;
  isSaving: boolean;
  onRoleFieldEdit: (roleId: number, fieldType: 'username' | 'name', currentValue: string) => void;
  onRoleFieldChange: (value: string) => void;
  onRoleFieldSave: () => void;
  onRoleFieldCancel: () => void;
  onAddRole: () => void;
  onSaveLeadershipRoles: () => void;
}

const LeadershipRolesPage: React.FC<LeadershipRolesPageProps> = ({
  leadershipRoles,
  editingRole,
  editingFieldType,
  tempValue,
  isSaving,
  onRoleFieldEdit,
  onRoleFieldChange,
  onRoleFieldSave,
  onRoleFieldCancel,
  onAddRole,
  onSaveLeadershipRoles
}) => {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDropdownToggle = (roleId: number) => {
    setActiveDropdown(activeDropdown === roleId ? null : roleId);
  };

  const handleMenuAction = (action: string, roleId: number) => {
    console.log(`Action: ${action}, Role ID: ${roleId}`);
    // TODO: Implement specific actions based on the action type
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="space-y-6">
      <div >
        {/* Grid Container */}
        <div className="grid grid-cols-[100px_200px_220px_280px_80px] gap-4">
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">ABBR</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Leadership Role</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Username</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Name</div>
          <div ></div>

          {leadershipRoles.map((role) => (
            <React.Fragment key={role.id}>
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-900">{role.abbr}</span>
              </div>

              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                <span className="text-sm text-gray-900">{role.role}</span>
              </div>

              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingRole === role.id && editingFieldType === 'username' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onRoleFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="Enter username"
                      autoFocus
                    />
                    <button
                      onClick={onRoleFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onRoleFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onRoleFieldEdit(role.id, 'username', role.username)}
                  >
                    {role.username || 'Enter username to populate fields'}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingRole === role.id && editingFieldType === 'name' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onRoleFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="Enter name"
                      autoFocus
                    />
                    <button
                      onClick={onRoleFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onRoleFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onRoleFieldEdit(role.id, 'name', role.name)}
                  >
                    {role.name || '-'}
                  </div>
                )}
              </div>

              {/* Actions Column */}
              <div className="bg-gray-50 px-3 py-2 text-sm font-medium relative">
                <div className="relative flex items-center justify-center space-x-3">
                  <button className="text-gray-600 hover:text-gray-800 p-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M7 13l3 3 3-3" />
                      <path d="M7 6l3-3 3 3" />
                    </svg>
                  </button>

                  {/* Special headphone icon for Head of Delegate Affairs */}
                  {role.role === 'Head of Delegate Affairs' && (
                    <button className="text-gray-600 hover:text-gray-800 p-1">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 14v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
                        <path d="M12 2a5 5 0 0 0-5 5v6a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                      </svg>
                    </button>
                  )}

                  {/* Three dots menu icon */}
                  <div ref={dropdownRef} className="relative">
                    <button 
                      onClick={() => handleDropdownToggle(role.id)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    {activeDropdown === role.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleMenuAction('edit', role.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleMenuAction('delete', role.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleMenuAction('add_role', role.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200"
                          >
                            Add Role
                          </button>
                          <button
                            onClick={() => handleMenuAction('add_support', role.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200"
                          >
                            Add as Support
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-[925px] flex justify-between">
        <button
          onClick={onAddRole}
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
          onClick={onSaveLeadershipRoles}
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

export default LeadershipRolesPage;

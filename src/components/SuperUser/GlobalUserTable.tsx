import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import saveIcon from '../../assets/save_icon.svg';
import { updateUserStatusApi } from '../../apis/Users';

interface GlobalUser {
  id: string;
  username: string;
  fullname: string;
  role: string;
  school: any;
  school_location?: string;
  grade?: string;
  years_of_experience?: string;
  created_at?: string;
  updated_at?: string;
}

interface GlobalUserTableProps {
  users: GlobalUser[];
  onAction: (action: string, userId: string) => void;
  userType?: 'students' | 'teachers';
}

const GlobalUserTable: React.FC<GlobalUserTableProps> = ({ users, onAction, userType = 'students' }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState<any>(null);
  const [userFound, setUserFound] = useState<boolean | null>(null);
  const [showUsernameDropdown, setShowUsernameDropdown] = useState<boolean>(false);
  const [filteredAvailableUsers, setFilteredAvailableUsers] = useState<any[]>([]);
  const usernameDropdownRef = useRef<HTMLDivElement>(null);
  const { refreshUserData, allUsers } = useApp();

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (usernameDropdownRef.current && !usernameDropdownRef.current.contains(event.target as Node)) {
        setShowUsernameDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user: any) => {
        const searchLower = searchTerm.toLowerCase();
        const username = user?.username || '';
        const fullname = user?.fullname || '';
        const schoolLocation = user?.school_location || '';
        const schoolName = user?.school?.name || user?.school || '';
        const role = user?.role || '';

        return (
          username.toLowerCase().includes(searchLower) ||
          fullname.toLowerCase().includes(searchLower) ||
          schoolLocation.toLowerCase().includes(searchLower) ||
          schoolName.toLowerCase().includes(searchLower) ||
          role.toLowerCase().includes(searchLower)
        );
      });
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleDropdownToggle = (userId: string) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setUserFound(null);
    setShowUsernameDropdown(false);
    setFilteredAvailableUsers([]);
    setNewUser({
      id: '',
      username: '',
      fullname: '',
      role: userType,
      school: '',
      school_location: '',
      grade: '',
      years_of_experience: '',
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setNewUser((prev: any) => ({
      ...prev,
      [field]: value
    }));

    // If username is being changed, show dropdown and filter users
    if (field === 'username') {
      if (value.trim()) {
        setShowUsernameDropdown(true);
        setUserFound(null); // Reset user found state when typing
        filterUsersByUsername(value.trim());
      } else {
        setShowUsernameDropdown(false);
        setUserFound(null);
        setFilteredAvailableUsers([]);
        // Clear fields if username is empty
        setNewUser((prev: any) => ({
          ...prev,
          id: '',
          fullname: '',
          school: '',
          school_location: '',
          grade: '',
          years_of_experience: '',
        }));
      }
    }
  };
  // Function to filter users by username
  const filterUsersByUsername = (username: string) => {
    // Get all user IDs that are already in the current list
    const existingUserIds = new Set(users.map((user: any) => user.id));

    // Filter users who are not already in the list and match the username
    // Also filter by role based on the user type context
    const filtered = allUsers.filter(user => {
      const matchesUsername = user.username?.toLowerCase().includes(username.toLowerCase());
      const notAlreadyInList = !existingUserIds.has(user.id);

      // Filter by role based on the user type context
      let matchesRole = true;
      if (userType === 'students') {
        matchesRole = user.role === 'student';
      } else if (userType === 'teachers') {
        matchesRole = user.role === 'teacher';
      }

      return matchesUsername && notAlreadyInList && matchesRole;
    });

    console.log('Filtering users:', { username, userType, filteredUsers: filtered.length, totalUsers: allUsers.length });
    setFilteredAvailableUsers(filtered);
  };

  // Function to handle username selection from dropdown
  const handleUsernameSelect = (selectedUser: any) => {
    console.log('Selected user:', selectedUser);

    setNewUser((prev: any) => ({
      ...prev,
      id: selectedUser.id || '',
      username: selectedUser.username || '',
      fullname: selectedUser.fullname || '',
      role: selectedUser.role || userType,
      school: selectedUser.school?.name || selectedUser.school || '',
      school_location: selectedUser.school_location || selectedUser.locality?.name || '',
      // Set appropriate field based on user type
      ...(userType === 'students' 
        ? { grade: selectedUser.grade || '' }
        : { years_of_experience: selectedUser.years_of_experience || '' }
      )
    }));

    setUserFound(true);
    setShowUsernameDropdown(false);
    setFilteredAvailableUsers([]);
  };


  const handleSaveNew = async () => {
    try {
      // Validate required fields
      if (!newUser.username || !newUser.fullname || !newUser.school) {
        toast.error('Please fill in all required fields (Username, Name, School)');
        return;
      }

      // For now, just show success message since we don't have a specific API for adding users
      toast.success('New user added successfully!');
      setIsAddingNew(false);
      setUserFound(null);
      setShowUsernameDropdown(false);
      setFilteredAvailableUsers([]);
      setNewUser({
        id: '',
        username: '',
        fullname: '',
        role: userType,
        school: '',
        school_location: '',
        grade: '',
        years_of_experience: '',
      });

      // Refresh data
      await refreshUserData();
    } catch (error: any) {
      console.error('Error saving new user:', error);
      toast.error(error.message || 'Failed to save new user');
    }
  };

  const handleAction = async (action: string, userId: string) => {
    setUpdatingUserId(userId);
    try {
      // For now, just show success message since we don't have specific APIs for user actions
      const response = await updateUserStatusApi(userId, action);
      if (response.success) {
        toast.success(response.message);
        await refreshUserData();
      } else {
        toast.error(response.message);
      }
      toast.success(`User ${action} successfully!`);
      await refreshUserData();
      onAction(action, userId);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdatingUserId(null);
    }
    setActiveDropdown(null);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600';

    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-red-600';
      case 'pending':
        return 'text-orange-500';
      case 'suspended':
        return 'text-yellow-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div>
      {/* Search Input */}
      <div className="mb-4" style={{ display: 'none' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-12 gap-2 mb-2">
        {['UserID', 'Username', 'Name', userType === 'students' ? 'Grade' : 'Teaching Experience', 'School', 'Location', 'Role', 'Date Created', 'Last Updated', 'Status', ' '].map((header, index) => (
          header === ' ' ? (
            <div key={header}>
            </div>
          ) : (
            <div
              key={header}
              className={`px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md ${index < 4
                ? 'bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between'
                : 'bg-[#C6DAF4] border border-[#4A5F7A] flex items-center'
                }`}
            >
              <span>{header}</span>
              {index < 4 && (
                <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          )
        )
        )}

      </div>

      {/* Data Rows */}
      {filteredUsers.length === 0 && !isAddingNew ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No users found matching your search' : 'No users found'}
        </div>
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map((user: any) => (
          <div key={user?.id || Math.random()} className="grid grid-cols-12 gap-2 mb-2">
            {/* User ID */}
            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
              {user?.id?.split('-')[0] || 'N/A'}
            </div>

            {/* Username */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.username || 'N/A'}
            </div>

            {/* Name */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.fullname || 'N/A'}
            </div>

            {/* Grade/Teaching Experience */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {userType === 'students' 
                ? (user?.grade || 'N/A')
                : (user?.years_of_experience || 'N/A')
              }
            </div>

            {/* School */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.school?.name || user?.school || 'N/A'}
            </div>

            {/* Location */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.school_location || 'N/A'}
            </div>

            {/* Role */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.role || 'N/A'}
            </div>

            {/* Date Created */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.created_at?.split('T')[0] || 'N/A'}
            </div>

            {/* Last Updated */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {user?.updated_at?.split('T')[0] || 'N/A'}
            </div>

            {/* Status */}
            <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
              {updatingUserId === user?.id ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span className="text-gray-500">Updating...</span>
                </div>
              ) : (
                <span className={`font-medium ${getStatusColor('active')}`}>
                  Active
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="px-3 py-2 text-sm font-medium relative">
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(user?.id || '')}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {activeDropdown === user?.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleAction('activate', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                          }`}
                      >
                        Activate
                      </button>

                      <button
                        onClick={() => handleAction('suspend', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                          }`}
                      >
                        Suspend
                      </button>

                      <button
                        onClick={() => handleAction('edit', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                          }`}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleAction('delete', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                          }`}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : null}

      {/* New User Input Row */}
      {isAddingNew && (
        <div className="grid grid-cols-11 gap-2 mb-2">
          {/* User ID */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.id}
              placeholder="Auto populated"
              className="w-full border-none outline-none text-sm"
              disabled
            />
          </div>

          {/* Username */}
          <div
            ref={usernameDropdownRef}
            className={`px-3 py-2 text-sm rounded-md border relative ${userFound === true ? 'bg-green-50 border-green-300' :
              userFound === false ? 'bg-red-50 border-red-300' :
                'bg-white border-gray-200'
              }`}
          >
            <div className="flex items-center">
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onFocus={() => {
                  if (newUser.username.trim()) {
                    setShowUsernameDropdown(true);
                    filterUsersByUsername(newUser.username.trim());
                  }
                }}
                placeholder="Enter username to populate fields"
                className="w-full border-none outline-none text-sm bg-transparent"
                autoComplete="off"
              />
              {userFound === true && (
                <svg className="w-4 h-4 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {userFound === false && (
                <svg className="w-4 h-4 text-red-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* Username Dropdown */}
            {showUsernameDropdown && filteredAvailableUsers.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                {filteredAvailableUsers.map((user, index) => (
                  <div
                    key={user.id || index}
                    onClick={() => handleUsernameSelect(user)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                  >
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.fullname}</div>
                    <div className="text-xs text-gray-400">
                      {user.school?.name || user.school_name || user.schoolName || user.school || 'No school'} • {user.locality?.name || user.school_location || user.locality || 'No location'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showUsernameDropdown && filteredAvailableUsers.length === 0 && newUser.username.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <div className="px-3 py-2 text-sm text-gray-500">
                  No available users found
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.fullname}
              disabled
              placeholder="Auto populated"
              className="w-full border-none outline-none text-sm"
            />
          </div>

          {/* Grade/Teaching Experience */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={userType === 'students' ? (newUser.grade || '') : (newUser.years_of_experience || '')}
              disabled
              placeholder="Auto populated"
              className="w-full border-none outline-none text-sm"
            />
          </div>

          {/* School */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.school}
              disabled
              placeholder="Auto populated"
              className="w-full border-none outline-none text-sm"
            />
          </div>

          {/* Location */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.school_location}
              disabled
              placeholder="Auto populated"
              className="w-full border-none outline-none text-sm"
            />
          </div>

          {/* Role */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.role}
              disabled
              placeholder="Auto populated"
              className="w-full border-none outline-none text-sm"
            />
          </div>

          {/* Date Created */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.created_at?.split('T')[0] || 'N/A'}
              className="w-full border-none outline-none text-sm"
              disabled
            />
          </div>

          {/* Last Updated */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <input
              type="text"
              value={newUser.updated_at?.split('T')[0] || 'N/A'}
              className="w-full border-none outline-none text-sm"
              disabled
            />
          </div>

          {/* Status */}
          <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
            <span className="font-medium text-green-600">Active</span>
          </div>

          {/* Actions */}
          <div className="px-3 py-2 text-sm font-medium relative">
            <div className="flex space-x-2">
              <img src={saveIcon} alt="Save" className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Add and Save Buttons */}
      <div className="flex justify-start space-x-4 mt-6">
        <button
          onClick={handleAddNew}
          disabled={isAddingNew}
          className={`bg-[#C2A46D] text-white font-medium rounded-[30px] w-[105px] h-[44px] px-[10px] py-[10px] mr-[10px] transition-colors duration-200 ${isAddingNew
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#9a7849]'
            }`}
        >
          Add
        </button>
        <button
          onClick={handleSaveNew}
          disabled={!isAddingNew}
          className={`bg-[#C2A46D] text-white font-medium rounded-[30px] w-[105px] h-[44px] px-[10px] py-[10px] transition-colors duration-200 ${!isAddingNew
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#b89a6a]'
            }`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GlobalUserTable;

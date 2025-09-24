import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { deleteUserBySuperUserApi, updateUserStatusApi } from '../../apis/Users';
import { ConfirmationModal } from '../ui';
import OrganiserIcon from '../../assets/organiser_icon.svg';

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
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const { refreshUserData, allOrganisers } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to check if user is an organizer
  const isUserOrganiser = (userId: string) => {
    return allOrganisers.some((organiser: any) => organiser.userid === userId);
  };

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user: any) => {
        const searchLower = searchTerm.toLowerCase();
        const username = user?.username || '';
        const fullname = user?.fullname || '';
        const schoolLocation = user?.school.code || '';
        const schoolName = user?.school?.name || '';
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

  // Handle clicking outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleDropdownToggle = (userId: string) => {
    setActiveDropdown(activeDropdown === userId ? null : userId);
  };

  // Delete confirmation handlers
  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleAction('delete', userToDelete);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleAction = async (action: string, userId: string) => {
    setActiveDropdown(null); // Close dropdown immediately when action is triggered
    
    try {
      if (action === 'delete') {
        const response = await deleteUserBySuperUserApi(userId);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
        } else {
          toast.error(response.message);
        }
      } else {
        setUpdatingUserId(userId);
        const response = await updateUserStatusApi(userId, action);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
        } else {
          toast.error(response.message);
        }
      }
      await refreshUserData();
      onAction(action, userId);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600';

    switch (status.toLowerCase()) {
      case 'actived':
        return 'text-green-600';
      case 'flagged':
        return 'text-yellow-500';
      case 'blocked':
        return 'text-red-600';
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
      {filteredUsers.length === 0 ? (
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
                  <span className="text-gray-500">Updating</span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-3 py-2 text-sm font-medium relative" ref={dropdownRef}>
              <div className="relative flex items-center justify-left">
                {isUserOrganiser(user?.id) && (
                  <div className="ml-2">
                    <img
                      src={OrganiserIcon}
                      alt="Organiser"
                      className="w-5 h-5"
                      title="This user is an organizer"
                    />
                  </div>
                )}
                <button
                  onClick={() => handleDropdownToggle(user?.id || '')}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {activeDropdown === user?.id && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border-2">
                    <div className="py-1">
                      <button
                        onClick={() => handleAction('actived', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                          }`}
                      >
                        Activate
                      </button>

                      <button
                        onClick={() => handleAction('flagged', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                          }`}
                      >
                        Flag
                      </button>

                      <button
                        onClick={() => handleAction('blocked', user?.id || '')}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                          }`}
                      >
                        Block
                      </button>

                      <button
                        onClick={() => {
                          setActiveDropdown(null); // Close dropdown when delete modal is triggered
                          setUserToDelete(user?.id || '');
                          setShowDeleteModal(true);
                        }}
                        disabled={updatingUserId === user?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
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

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Yes"
        cancelText="No"
        confirmButtonColor="text-red-600"
      />
    </div>
  );
};

export default GlobalUserTable;

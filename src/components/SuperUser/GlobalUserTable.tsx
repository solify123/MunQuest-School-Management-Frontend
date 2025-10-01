import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { removeSuperUserInviteApi, sendSuperUserInviteApi, updateUserStatusApi } from '../../apis/Users';
import { ConfirmationModal } from '../ui';
import OrganiserIcon from '../../assets/organiser_icon.svg';
import { assignOrganiserToSchoolApi } from '../../apis/Organisers';

interface GlobalUser {
  id: string;
  username: string;
  fullname: string;
  global_role: string;
  school: any;
  mun_experience?: string;
  grade?: string;
  years_of_experience?: string;
  created_at?: string;
  updated_at?: string;
}

interface GlobalUserTableProps {
  users: GlobalUser[];
  onAction: (action: string, username: string, email: string) => void;
  userType?: 'students' | 'teachers';
  isSuperUser?: boolean;
}

const GlobalUserTable: React.FC<GlobalUserTableProps> = ({ users, onAction, isSuperUser = false }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<{ username: string, email: string } | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [showInviteForm, setShowInviteForm] = useState<boolean>(false);
  const [inviteName, setInviteName] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const { refreshUserData, allOrganisers } = useApp();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Helper function to check if user is an organizer
  const isUserOrganiser = (userId: string) => {
    return allOrganisers.some((organiser: any) => organiser.userid === userId);
  };

  // Helper function to get user status color
  const getUserStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'text-green-600';
      case 'flagged':
        return 'text-yellow-600';
      case 'blocked':
        return 'text-red-600';
      case 'deleted':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
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
        const role = user?.global_role || '';

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
  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        if (isSuperUser) {
          // For superusers section, use the original handleAction
          await handleAction('delete', userToDelete.username, userToDelete.email);
        } else {
          // For users section, use updateUserStatusApi for delete
          setUpdatingUserId(userToDelete.username);
          const response = await updateUserStatusApi(userToDelete.username, 'delete');
          if (response.success) {
            toast.success(response.message);
            await refreshUserData();
            onAction('delete', userToDelete.username, userToDelete.email);
          } else {
            toast.error(response.message);
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      } finally {
        setUpdatingUserId(null);
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleSendInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.error('Please fill in both name and email fields');
      return;
    }

    try {
      const response = await sendSuperUserInviteApi(inviteName, inviteEmail);
      if (response.success) {
        toast.success(response.message);
        await refreshUserData();
      } else {
        toast.error(response.message);
      }
      setInviteName('');
      setInviteEmail('');
      setShowInviteForm(false);
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Failed to send invitation');
    }
  };

  const handleAction = async (action: string, username: string, email: string) => {
    setActiveDropdown(null); // Close dropdown immediately when action is triggered
    try {
      if (action === 'delete') {
        const response = await removeSuperUserInviteApi(username, email);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
        } else {
          toast.error(response.message);
        }
      } else {
        setUpdatingUserId(username);
        const response = await updateUserStatusApi(username, action);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
        } else {
          toast.error(response.message);
        }
      }
      onAction(action, username, email);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleUserSectionAction = async (action: string, userId: string, email: string) => {
    try {
      if (action === 'delete') {
        setUserToDelete({ username: userId, email: email });
        setShowDeleteModal(true);
      } else {
        setUpdatingUserId(userId);
        const response = await updateUserStatusApi(userId, action);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
          onAction(action, userId, email);
        } else {
          toast.error(response.message);
        }
      }
      setActiveDropdown(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdatingUserId(null);
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
      <div className={`grid gap-2 mb-2 ${isSuperUser ? 'grid-cols-12' : 'grid-cols-10'}`}>
        {(isSuperUser ? [
          { label: 'UserID', span: 'col-span-1' },
          { label: 'Username', span: 'col-span-1' },
          { label: 'Name', span: 'col-span-2' },
          { label: 'Email', span: 'col-span-3' },
          { label: 'Global Role', span: 'col-span-1' },
          { label: ' ', span: 'col-span-1' }
        ] : [
          { label: 'Student ID', span: 'col-span-1' },
          { label: 'Username', span: 'col-span-1' },
          { label: 'Name', span: 'col-span-1' },
          { label: 'Academic Level', span: 'col-span-1' },
          { label: 'School', span: 'col-span-2' },
          { label: 'MUN Experience', span: 'col-span-1' },
          { label: 'Global Role', span: 'col-span-1' },
          { label: 'User Status', span: 'col-span-1' },
          { label: ' ', span: 'col-span-1' }
        ]).map((header, index) => (
          header.label === ' ' ? (
            <div key={header.label} className={header.span}>
            </div>
          ) : (
            <div
              key={header.label}
              className={`${header.span} px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md ${index < (isSuperUser ? 4 : 7)
                ? 'bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between'
                : 'bg-[#C6DAF4] border border-[#4A5F7A] flex items-center'
                }`}
            >
              <span>{header.label}</span>
              {index < (isSuperUser ? 4 : 7) && (
                <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          )
        ))}

      </div>

      {/* Data Rows */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No users found matching your search' : 'No users found'}
        </div>
      ) : filteredUsers.length > 0 ? (
        filteredUsers.map((user: any) => (
          <div key={user?.id || Math.random()} className={`grid gap-2 mb-2 ${isSuperUser ? 'grid-cols-12' : 'grid-cols-10'}`}>
            {isSuperUser ? (
              // Superusers section columns
              <>
                {/* User ID */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
                  {user?.id?.split('-')[0] || 'N/A'}
                </div>

                {/* Username */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.username || 'N/A'}
                </div>

                {/* Name */}
                <div className="col-span-2 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.fullname || 'N/A'}
                </div>

                {/* Email */}
                <div className="col-span-3 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.email || 'N/A'}
                </div>

                {/* Global Role */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.global_role || 'N/A'}
                </div>
              </>
            ) : (
              // Users section columns
              <>
                {/* Student ID */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
                  {user?.student_id || user?.id?.split('-')[0] || 'N/A'}
                </div>

                {/* Username */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.username ? `@${user.username}` : 'N/A'}
                </div>

                {/* Name */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.fullname || 'N/A'}
                </div>

                {/* Academic Level */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.academic_level || user?.grade || 'N/A'}
                </div>

                {/* School */}
                <div className="col-span-2 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.school?.name || 'N/A'}
                </div>

                {/* MUN Experience */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.mun_experience || user?.years_of_experience || 'N/A'}
                </div>

                {/* Global Role */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                  {user?.global_role === 'superuser' ? 'Super User' : 'User'}
                </div>

                {/* User Status */}
                <div className="col-span-1 bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                  <span className={`font-medium ${getUserStatusColor(user?.user_status || user?.status || 'active')}`}>
                    {user?.user_status || user?.status || 'Active'}
                  </span>
                </div>
              </>
            )}

            {/* Actions */}
            <div className="col-span-1 px-3 py-2 text-sm font-medium relative" >
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
                  <div ref={dropdownRef} className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border-2">
                    <div className="py-1">
                      {isSuperUser ? (
                        // Superusers section menu options
                        <button
                          onClick={() => {
                            setActiveDropdown(null); // Close dropdown when delete modal is triggered
                            setUserToDelete({ username: user?.username || '', email: user?.email || '' });
                            setShowDeleteModal(true);
                          }}
                          disabled={updatingUserId === user?.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                            }`}
                        >
                          Remove Super User
                        </button>
                      ) : (
                        // Regular Users section menu options - dynamic based on current status
                        <>
                          <button
                            onClick={async () => {
                              setActiveDropdown(null);
                              const response = await assignOrganiserToSchoolApi(user?.id);
                              if (response.success) {
                                toast.success(response.message);
                                await refreshUserData();
                                onAction('assign-organiser', user?.id, user?.email);
                                await refreshUserData();
                              } else {
                                toast.error(response.message);
                              }
                            }}
                            disabled={updatingUserId === user?.id}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                              }`}
                          >
                            Assign Organiser
                          </button>

                          {/* Show Active option if user is flagged or blocked */}
                          {(user?.user_status?.toLowerCase() === 'flagged' || user?.user_status?.toLowerCase() === 'blocked') && (
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                handleUserSectionAction('active', user?.id, user?.email);
                              }}
                              disabled={updatingUserId === user?.id}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                }`}
                            >
                              Active
                            </button>
                          )}

                          {/* Show Flag option if user is not already flagged */}
                          {user?.user_status?.toLowerCase() !== 'flagged' && (
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                handleUserSectionAction('flagged', user?.id, user?.email);
                              }}
                              disabled={updatingUserId === user?.id}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                }`}
                            >
                              Flag
                            </button>
                          )}

                          {/* Show Block option if user is not already blocked */}
                          {user?.user_status?.toLowerCase() !== 'blocked' && (
                            <button
                              onClick={() => {
                                setActiveDropdown(null);
                                handleUserSectionAction('blocked', user?.id, user?.email);
                              }}
                              disabled={updatingUserId === user?.id}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                }`}
                            >
                              Block
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              setUserToDelete({ username: user?.username || '', email: user?.email || '' });
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
                          <button
                            onClick={() => {
                              setActiveDropdown(null);
                              handleUserSectionAction('invite', user?.id, user?.email);
                              console.log('Invite non-user:', user?.id);
                            }}
                            disabled={updatingUserId === user?.id}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingUserId === user?.id
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                              }`}
                          >
                            Invite Non-user
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      ) : null}

      {/* Invite Superuser Section - Only show for Superusers section */}
      {isSuperUser && (
        <div className="mt-6">
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="px-6 py-3 bg-[#C4A35A] hover:bg-[#B8973F] text-white font-medium rounded-[20px] transition-colors duration-200 shadow-md"
          >
            Invite a Superuser
          </button>

          {/* Invite Form */}
          {showInviteForm && (
            <div className="mt-6 p-6 max-w-md flex items-end justify-between">
              <div>
                {/* Name Field */}
                <div className="mb-4">
                  <label htmlFor="invite-name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    id="invite-name"
                    type="text"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="E.g. Ivy Grace Turner"
                    className="w-full px-4 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C4A35A] focus:border-transparent text-gray-700"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="invite-email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    id="invite-email"
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="E.g. ivy.grace@example.com"
                    className="w-full px-4 py-2 border border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C4A35A] focus:border-transparent text-gray-700"
                  />
                </div>
              </div>
              <div>
                {/* Send Invite Button */}
                <button
                  onClick={handleSendInvite}
                  className="w-[150px] px-6 py-3 bg-[#7FB539] hover:bg-[#6FA329] text-white font-semibold rounded-[20px]"
                >
                  Send Invite
                </button>
              </div>
            </div>
          )}
        </div>
      )}

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

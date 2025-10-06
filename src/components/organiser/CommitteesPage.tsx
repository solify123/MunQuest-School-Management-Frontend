import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { createCommitteeApi, updateCommitteeApi } from '../../apis/Committees';
import { useApp } from '../../contexts/AppContext';
import { getAllEventCommitteesApi } from '../../apis/Event_committes';
import { useParams } from 'react-router-dom';

interface Committee {
  id: number;
  abbr: string;
  committee: string;
  seatsTotal: string;
  chairUsername: string;
  chairName: string;
  deputyChair1Username: string;
  deputyChair1Name: string;
  deputyChair2Username: string;
  deputyChair2Name: string;
}

const CommitteesPage: React.FC = () => {

  // State variables
  const [activeCommitteeType, setActiveCommitteeType] = useState('country');
  const [committees, setCommittees] = useState<any[]>([]);
  const [editingCommittee, setEditingCommittee] = useState<number | null>(null);
  const [editingCommitteeField, setEditingCommitteeField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [contextMenuCommitteeId, setContextMenuCommitteeId] = useState<number | null>(null);

  // Committee autocomplete states
  const [showCommitteeDropdown, setShowCommitteeDropdown] = useState<boolean>(false);
  const [filteredCommittees, setFilteredCommittees] = useState<any[]>([]);
  const [activeCommitteeDropdown, setActiveCommitteeDropdown] = useState<number | null>(null);
  const committeeDropdownRef = useRef<HTMLDivElement>(null);

  // User autocomplete states
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [activeUserDropdown, setActiveUserDropdown] = useState<number | null>(null);
  const [activeUserField, setActiveUserField] = useState<string | null>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const committeeTypes = [
    { id: 'country', name: 'Country Committees' },
    { id: 'role', name: 'Role Committees' },
    { id: 'crisis', name: 'Crisis Committees' },
    { id: 'open', name: 'Open Committees' }
  ];


  const { eventId } = useParams();
  const { allCommittees, allUsers, refreshCommitteesData, isLoading } = useApp();

  useEffect(() => {
    refreshCommitteesData();
  }, []);

  // Filter committees based on active committee type
  useEffect(() => {
    const fetchEventCommittees = async () => {
      try {
        const response = await getAllEventCommitteesApi(eventId as string);
        // Only update if we don't have unsaved changes
        if (!hasUnsavedChanges) {
          setCommittees(response.data || []);
        }
      } catch (error: any) {
        console.error('Error fetching event committees:', error);
        toast.error(error.message || 'Failed to fetch event committees');
      }
    };

    if (eventId) {
      fetchEventCommittees();
    }
  }, [eventId, activeCommitteeType, hasUnsavedChanges]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (committeeDropdownRef.current && !committeeDropdownRef.current.contains(event.target as Node)) {
        setShowCommitteeDropdown(false);
        setFilteredCommittees([]);
        setActiveCommitteeDropdown(null);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
        setFilteredUsers([]);
        setActiveUserDropdown(null);
        setActiveUserField(null);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
    setContextMenuCommitteeId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handler functions
  const handleCommitteeTypeChange = (type: string) => {
    setActiveCommitteeType(type);
    // Clear dropdown states when switching tabs
    setShowCommitteeDropdown(false);
    setFilteredCommittees([]);
    setActiveCommitteeDropdown(null);
    setShowUserDropdown(false);
    setFilteredUsers([]);
    setActiveUserDropdown(null);
    setActiveUserField(null);
    setShowContextMenu(false);
    setContextMenuCommitteeId(null);
    setContextMenuCommitteeId(null);
    setEditingCommittee(null);
    setEditingCommitteeField(null);
    setTempValue('');
    // Reset unsaved changes when switching tabs
    setHasUnsavedChanges(false);
  };

  const handleCommitteeFieldEdit = (committeeId: number, fieldType: string, currentValue: string) => {
    setEditingCommittee(committeeId);
    setEditingCommitteeField(fieldType);
    setTempValue(currentValue);

    // Clear user dropdown states when starting to edit a field
    setShowUserDropdown(false);
    setFilteredUsers([]);
    setActiveUserDropdown(null);
    setActiveUserField(null);
    setShowContextMenu(false);
    setContextMenuCommitteeId(null);
    setContextMenuCommitteeId(null);
  };

  const handleCommitteeFieldChange = (value: string, committeeId?: number) => {
    setTempValue(value);

    // If committee field is being changed, show dropdown and filter committees
    if (editingCommitteeField === 'committee') {
      if (value.trim()) {
        setShowCommitteeDropdown(true);
        setActiveCommitteeDropdown(committeeId || null);
        filterCommitteesByInput(value.trim());
      } else {
        setShowCommitteeDropdown(false);
        setFilteredCommittees([]);
        setActiveCommitteeDropdown(null);
      }
    }

    // If username field is being changed, show dropdown and filter users
    if (editingCommitteeField === 'chairUsername' || editingCommitteeField === 'deputyChair1Username' || editingCommitteeField === 'deputyChair2Username') {
      if (value.trim()) {
        setShowUserDropdown(true);
        setActiveUserDropdown(committeeId || null);
        setActiveUserField(editingCommitteeField);
        filterUsersByInput(value.trim());
      } else {
        setShowUserDropdown(false);
        setFilteredUsers([]);
        setActiveUserDropdown(null);
        setActiveUserField(null);
      }
    }
  };

  // Function to filter committees by input and current tab category
  const filterCommitteesByInput = (input: string) => {

    if (!allCommittees || allCommittees.length === 0) {
      setFilteredCommittees([]);
      return;
    }

    // Filter committees by current active tab category
    const filteredByCategory = allCommittees.filter((committee: any) => {
      return committee.category === activeCommitteeType;
    });


    // Then filter by input text
    const filtered = filteredByCategory.filter((committee: any) => {
      const committeeName = committee.committee || '';
      const abbreviation = committee.abbr || '';

      return (
        committeeName.toLowerCase().includes(input.toLowerCase()) ||
        abbreviation.toLowerCase().includes(input.toLowerCase())
      );
    });

    setFilteredCommittees(filtered);
  };

  // Function to filter users by input
  const filterUsersByInput = (input: string) => {
    if (!allUsers || allUsers.length === 0) {
      setFilteredUsers([]);
      return;
    }

    // Filter users by username or fullname
    const filtered = allUsers.filter((user: any) => {
      const username = user.username || '';
      const fullname = user.fullname || '';

      return (
        username.toLowerCase().includes(input.toLowerCase()) ||
        fullname.toLowerCase().includes(input.toLowerCase())
      );
    });

    setFilteredUsers(filtered);
  };

  // Handle committee selection from dropdown
  const handleCommitteeSelect = (selectedCommittee: any) => {
    if (editingCommittee && editingCommitteeField === 'committee') {
      setCommittees(prev => prev.map((committee: any) =>
        committee.id === editingCommittee
          ? {
            ...committee,
            committee: selectedCommittee.committee || selectedCommittee.name || '',
            abbr: selectedCommittee.abbr || 'Auto'
          }
          : committee
      ));
      // Mark as having unsaved changes after committee selection
      setHasUnsavedChanges(true);
    }
    setShowCommitteeDropdown(false);
    setFilteredCommittees([]);
    setActiveCommitteeDropdown(null);
    setEditingCommittee(null);
    setEditingCommitteeField(null);
    setTempValue('');
  };

  // Handle user selection from dropdown
  const handleUserSelect = (selectedUser: any) => {
    if (editingCommittee && activeUserField) {
      setCommittees(prev => prev.map((committee: any) =>
        committee.id === editingCommittee
          ? {
            ...committee,
            [activeUserField]: selectedUser.username || '',
            [activeUserField.replace('Username', 'Name')]: selectedUser.fullname || ''
          }
          : committee
      ));
      // Mark as having unsaved changes after user selection
      setHasUnsavedChanges(true);
    }
    setShowUserDropdown(false);
    setFilteredUsers([]);
    setActiveUserDropdown(null);
    setActiveUserField(null);
    setEditingCommittee(null);
    setEditingCommitteeField(null);
    setTempValue('');
  };

  const handleCommitteeFieldSave = async () => {
    if (editingCommittee && editingCommitteeField) {
      try {
        setIsSaving(true);
        const committeeToUpdate = committees.find((c: any) => c.id === editingCommittee);
        if (committeeToUpdate) {
          const response = await updateCommitteeApi(
            editingCommittee.toString(),
            committeeToUpdate.abbr,
            editingCommitteeField === 'committee' ? tempValue : committeeToUpdate.committee,
            activeCommitteeType
          );

          if (response.success) {
            setCommittees(prev => prev.map((committee: any) =>
              committee.id === editingCommittee
                ? { ...committee, [editingCommitteeField]: tempValue }
                : committee
            ));
            toast.success('Committee updated successfully');
            // Mark as having unsaved changes after successful update
            setHasUnsavedChanges(true);
          } else {
            toast.error(response.message || 'Failed to update committee');
          }
        }
      } catch (error: any) {
        console.error('Error updating committee:', error);
        toast.error(error.message || 'Failed to update committee');
      } finally {
        setIsSaving(false);
        setEditingCommittee(null);
        setEditingCommitteeField(null);
        setTempValue('');
      }
    }
  };

  const handleCommitteeFieldCancel = () => {
    setEditingCommittee(null);
    setEditingCommitteeField(null);
    setTempValue('');
  };

  const handleContextMenuClick = (event: React.MouseEvent, committeeId: number) => {
    event.preventDefault();
    event.stopPropagation();
    
    const rect = event.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      x: rect.right,
      y: rect.bottom
    });
    setContextMenuCommitteeId(committeeId);
    setShowContextMenu(true);
  };

  const handleAddCommittee = () => {
    const newId = committees.length > 0 ? Math.max(...committees.map((c: any) => c.id)) + 1 : 1;
    const newCommittee: Committee = {
      id: newId,
      abbr: 'Auto Generated',
      committee: '',
      seatsTotal: '30',
      chairUsername: '',
      chairName: '',
      deputyChair1Username: '',
      deputyChair1Name: '',
      deputyChair2Username: '',
      deputyChair2Name: ''
    };
    setCommittees(prev => [...prev, newCommittee as any]);

    // Mark as having unsaved changes
    setHasUnsavedChanges(true);

    // Clear any existing dropdown states
    setShowCommitteeDropdown(false);
    setFilteredCommittees([]);
    setActiveCommitteeDropdown(null);
    setShowUserDropdown(false);
    setFilteredUsers([]);
    setActiveUserDropdown(null);
    setActiveUserField(null);
    setShowContextMenu(false);
    setContextMenuCommitteeId(null);
  };

  const handleDeleteCommittee = () => {
    if (contextMenuCommitteeId) {
      setCommittees(prev => prev.filter((c: any) => c.id !== contextMenuCommitteeId));
      setHasUnsavedChanges(true);
    }
    setShowContextMenu(false);
    setContextMenuCommitteeId(null);
    setContextMenuCommitteeId(null);
  };

  const handleEditCommittee = () => {
    if (contextMenuCommitteeId) {
      const committee = committees.find((c: any) => c.id === contextMenuCommitteeId);
      if (committee) {
        setEditingCommittee(contextMenuCommitteeId);
        setEditingCommitteeField('committee');
        setTempValue(committee.committee || '');
      }
    }
    setShowContextMenu(false);
    setContextMenuCommitteeId(null);
    setContextMenuCommitteeId(null);
  };

  const handleSaveCommittees = async () => {
    try {
      setIsSaving(true);
      // Save all committees that have been modified
      for (const committee of committees as any) {
        if (committee.committee && committee.committee !== '') {
          const response = await createCommitteeApi(
            committee.abbr,
            committee.committee,
            activeCommitteeType
          );

          if (!response.success) {
            toast.error(`Failed to save committee: ${committee.committee}`);
            return;
          }
        }
      }
      toast.success('Committees saved successfully');
      // Reset unsaved changes flag after successful save
      setHasUnsavedChanges(false);
    } catch (error: any) {
      console.error('Error saving committees:', error);
      toast.error(error.message || 'Failed to save committees');
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading committees...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        {committeeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleCommitteeTypeChange(type.id)}
            className={`w-[200px] h-[58px] rounded-[20px] p-[5px] opacity-100 transition-colors text-sm font-medium ${activeCommitteeType === type.id
              ? 'bg-[#6A8BAF] text-white'
              : 'bg-white text-black border border-gray-800'
              }`}
            style={{ transform: 'rotate(0deg)' }}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Show message if no committees */}
      {committees.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No committees available</h3>
          <p className="text-gray-500 mb-4">Click "Add Committee" to create your first committee.</p>
        </div>
      )}

      {/* Only show table if there are committees */}
      {committees.length > 0 && (
        <div className="space-y-6 " style={{ marginBottom: '16px' }}>
          {/* Grid Container */}
          <div className="grid grid-cols-[80px_200px_70px_100px_100px_100px_100px_100px_100px_0px] gap-4">
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">ABBR</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Committee</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Seats Total</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Chair Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Chair Name</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 1 Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 1 Name</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 2 Username</div>
            <div className="bg-[#C6DAF4] text-grey-800 px-3 py-2 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 2 Name</div>
            <div></div>

            {committees.map((committee: any) => (
              <React.Fragment key={committee.id}>
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-center">
                  <div className="text-sm text-gray-900 text-center w-full">
                    {committee.abbr}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'committee' ? (
                    <div className=" text-sm rounded-md relative w-full" ref={committeeDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="E.g. United Nations Security Council"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                        {tempValue && (
                          <button
                            onClick={() => {
                              setTempValue('');
                              setShowCommitteeDropdown(false);
                              setFilteredCommittees([]);
                              setActiveCommitteeDropdown(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Committee Dropdown */}
                      {showCommitteeDropdown && activeCommitteeDropdown === committee.id && filteredCommittees.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredCommittees.map((committeeOption, index) => (
                            <button
                              key={committeeOption.id || index}
                              type="button"
                              onClick={() => handleCommitteeSelect(committeeOption)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">{committeeOption.committee || committeeOption.name}</div>
                              {committeeOption.abbr && (
                                <div className="text-xs text-gray-500">ABBR: {committeeOption.abbr}</div>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full cursor-pointer"
                      onClick={() => handleCommitteeFieldEdit(committee.id, 'committee', committee.committee)}
                    >
                      {committee.committee || 'E.g. United Nations Security Council'}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'seatsTotal' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => handleCommitteeFieldChange(e.target.value)}
                        placeholder="30"
                        className="w-full border-none outline-none text-gray-900"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900 w-full">
                      {committee.seatsTotal}
                    </div>
                  )}
                </div>

                {/* Chair Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'chairUsername' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full" ref={userDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="@username"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                        {tempValue && (
                          <button
                            onClick={() => {
                              setTempValue('');
                              setShowUserDropdown(false);
                              setFilteredUsers([]);
                              setActiveUserDropdown(null);
                              setActiveUserField(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* User Dropdown */}
                      {showUserDropdown && activeUserDropdown === committee.id && activeUserField === 'chairUsername' && filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredUsers.map((user, index) => (
                            <button
                              key={user.id || index}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">@{user.username}</div>
                              <div className="text-xs text-gray-500">{user.fullname}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900 w-full">
                      {committee.chairUsername || '-'}
                    </div>
                  )}
                </div>

                {/* Chair Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  <div className="text-sm text-gray-900 w-full">
                    {committee.chairName || '-'}
                  </div>
                </div>

                {/* Deputy Chair 1 Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair1Username' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full" ref={userDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="@username"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                        {tempValue && (
                          <button
                            onClick={() => {
                              setTempValue('');
                              setShowUserDropdown(false);
                              setFilteredUsers([]);
                              setActiveUserDropdown(null);
                              setActiveUserField(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* User Dropdown */}
                      {showUserDropdown && activeUserDropdown === committee.id && activeUserField === 'deputyChair1Username' && filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredUsers.map((user, index) => (
                            <button
                              key={user.id || index}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">@{user.username}</div>
                              <div className="text-xs text-gray-500">{user.fullname}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900 w-full">
                      {committee.deputyChair1Username || '-'}
                    </div>
                  )}
                </div>

                {/* Deputy Chair 1 Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  <div className="text-sm text-gray-900 w-full">
                    {committee.deputyChair1Name || '-'}
                  </div>
                </div>

                {/* Deputy Chair 2 Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair2Username' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full" ref={userDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="@username"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                        {tempValue && (
                          <button
                            onClick={() => {
                              setTempValue('');
                              setShowUserDropdown(false);
                              setFilteredUsers([]);
                              setActiveUserDropdown(null);
                              setActiveUserField(null);
                            }}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* User Dropdown */}
                      {showUserDropdown && activeUserDropdown === committee.id && activeUserField === 'deputyChair2Username' && filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredUsers.map((user, index) => (
                            <button
                              key={user.id || index}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium">@{user.username}</div>
                              <div className="text-xs text-gray-500">{user.fullname}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-900 w-full">
                      {committee.deputyChair2Username || '-'}
                    </div>
                  )}
                </div>

                {/* Deputy Chair 2 Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                  <div className="text-sm text-gray-900 w-full">
                    {committee.deputyChair2Name || '-'}
                  </div>
                </div>

                {/* Actions Column */}
                <div className="bg-gray-50 px-3 py-2 text-sm font-medium relative">
                  <div className="relative flex items-center justify-center space-x-3">
                    {/* Edit/Save/Cancel buttons */}
                    {editingCommittee === committee.id ? (
                      <>
                        <button
                          onClick={handleCommitteeFieldSave}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Save"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </button>
                        <button
                          onClick={handleCommitteeFieldCancel}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Cancel"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => handleContextMenuClick(e, committee.id)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Actions"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-gray-100 border border-black rounded-lg shadow-lg z-50"
          style={{
            left: `${contextMenuPosition.x}px`,
            top: `${contextMenuPosition.y}px`,
            minWidth: '150px'
          }}
        >
          <div className="py-1">
            <button
              onClick={handleEditCommittee}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-yellow-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={handleDeleteCommittee}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-yellow-200 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={handleAddCommittee}
              className="w-full px-4 py-2 text-left text-sm text-black hover:bg-yellow-200 transition-colors"
            >
              Add Committee
            </button>
          </div>
        </div>
      )}

      <div className="w-[925px] flex justify-between">
        <button
          onClick={handleAddCommittee}
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
          Add
        </button>
        <button
          onClick={handleSaveCommittees}
          className={`text-white font-medium transition-colors`}
          style={{
            width: '105px',
            height: '44px',
            borderRadius: '30px',
            padding: '10px',
            gap: '10px',
            opacity: 1,
            background: isSaving ? '#bdbdbd' : '#607DA3',
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

export default CommitteesPage;

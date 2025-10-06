import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { getAllEventCommitteesApi } from '../../apis/Event_committes';
import { deleteEventCommitteesByEventIdApi } from '../../apis/Event_committes';
import { useParams } from 'react-router-dom';
import { saveEventCommitteesByEventIdApi } from '../../apis/Event_committes';
// import { updateCommitteeApi } from '../../apis/Committees';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Committee {
  id: number;
  abbr: string;
  committee: string;
  // The selected master committee id from dropdown selection
  committeeId?: number;
  seatsTotal: string;
  chairUsername: string;
  chairName: string;
  deputyChair1Username: string;
  deputyChair1Name: string;
  deputyChair2Username: string;
  deputyChair2Name: string;
  // Local-only flag to prevent multiple unsaved rows
  isNew?: boolean;
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  // Keep a ref in sync with hasUnsavedChanges to avoid stale closures in async effects
  const hasUnsavedChangesRef = useRef<boolean>(false);

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
  const { allCommittees, allRegistrations, refreshCommitteesData, refreshRegistrationsData, isLoading } = useApp();

  useEffect(() => {
    refreshCommitteesData();
  }, []);

  // Load registrations for this event
  useEffect(() => {
    if (eventId) {
      refreshRegistrationsData(eventId);
    }
  }, [eventId]);

  // Keep ref synced with state
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  // Fetch committees for event and active type. Avoid overwriting local edits using ref.
  useEffect(() => {
    const fetchEventCommittees = async () => {
      try {
        const response = await getAllEventCommitteesApi(eventId as string);
        // Only update if we don't have unsaved changes at response time
        if (!hasUnsavedChangesRef.current) {
          const raw = response.data || [];
          const normalized = raw.map((item: any) => {
            console.log('[CommitteesPage] Normalizing committee:', item);
            const master = item && typeof item.committee === 'object' ? item.committee : null;
            const committeeText = master
              ? (master.committee ?? master.name ?? '')
              : (typeof item.committee === 'string' ? item.committee : '');
            const abbreviation = master ? (master.abbr ?? item.abbr ?? '') : (item.abbr ?? '');
            const masterId = master ? master.id : (item.committee_id ?? item.committeeId ?? undefined);
            return {
              id: item.id,
              committee: committeeText,
              abbr: abbreviation,
              committeeId: masterId,
              seatsTotal: String(item.seats ?? item.seatsTotal ?? ''),
              chairUsername: item.chair_username ?? '',
              chairName: item.chair_name ?? '',
              deputyChair1Username: item.deputy_chair_1_username ?? '',
              deputyChair1Name: item.deputy_chair_1_name ?? '',
              deputyChair2Username: item.deputy_chair_2_username ?? '',
              deputyChair2Name: item.deputy_chair_2_name ?? '',
              isNew: false
            };
          });
          setCommittees(Array.isArray(normalized) ? normalized : []);
        }
      } catch (error: any) {
        console.error('Error fetching event committees:', error);
        toast.error(error.message || 'Failed to fetch event committees');
      }
    };

    if (eventId) {
      fetchEventCommittees();
    }
  }, [eventId, activeCommitteeType]);

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

    // Prepare user dropdown state if editing a username field
    if (
      fieldType === 'chairUsername' ||
      fieldType === 'deputyChair1Username' ||
      fieldType === 'deputyChair2Username'
    ) {
      setActiveUserDropdown(committeeId);
      setActiveUserField(fieldType);
      setShowUserDropdown(false);
      setFilteredUsers([]);
    } else {
      setShowUserDropdown(false);
      setFilteredUsers([]);
      setActiveUserDropdown(null);
      setActiveUserField(null);
    }
    setShowContextMenu(false);
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

    // If username or name field is being changed, show dropdown and filter users
    if (
      editingCommitteeField === 'chairUsername' ||
      editingCommitteeField === 'deputyChair1Username' ||
      editingCommitteeField === 'deputyChair2Username' ||
      editingCommitteeField === 'chairName' ||
      editingCommitteeField === 'deputyChair1Name' ||
      editingCommitteeField === 'deputyChair2Name'
    ) {
      console.log('[CommitteesPage] User input for', editingCommitteeField, ':', value);
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
    console.log('[CommitteesPage] Filtering registrations by input:', input);
    if (!allRegistrations || allRegistrations.length === 0) {
      console.log('[CommitteesPage] No registrations available to filter');
      setFilteredUsers([]);
      return;
    }

    // Filter registrations by username or fullname
    const filtered = allRegistrations.filter((registration: any) => {
      const user = registration.user || registration;
      const username = user.username || '';
      const fullname = user.fullname || '';

      return (
        username.toLowerCase().includes(input.toLowerCase()) ||
        fullname.toLowerCase().includes(input.toLowerCase())
      );
    });

    console.log('[CommitteesPage] Filtered registrations count:', filtered.length);
    console.log('[CommitteesPage] Filtered registrations sample:', filtered.slice(0, 5));
    setFilteredUsers(filtered);
  };

  // Handle committee selection from dropdown
  const handleCommitteeSelect = (selectedCommittee: any) => {
    console.log('[CommitteesPage] Selected committee from dropdown:', selectedCommittee);
    if (editingCommittee && editingCommitteeField === 'committee') {
      setCommittees(prev => prev.map((committee: any) =>
        committee.id === editingCommittee
          ? {
            ...committee,
            committee: selectedCommittee.committee || selectedCommittee.name || '',
            abbr: selectedCommittee.abbr || 'Auto',
            // store actual committee id from master list
            committeeId: selectedCommittee.id
          }
          : committee
      ));
      // Mark as having unsaved changes after committee selection
      setHasUnsavedChanges(true);
    }
    setShowCommitteeDropdown(false);
    setFilteredCommittees([]);
    setActiveCommitteeDropdown(null);
    // Keep row in edit mode; advance to seats for continued input
    if (editingCommittee) {
      const c = committees.find((c: any) => c.id === editingCommittee);
      setEditingCommitteeField('seatsTotal');
      setTempValue(c?.seatsTotal || '');
    }
  };

  // Handle user selection from dropdown
  const handleUserSelect = (selectedUser: any) => {
    const selected = selectedUser && selectedUser.user ? selectedUser.user : selectedUser;
    if (editingCommittee && activeUserField) {
      setCommittees(prev => prev.map((committee: any) => {
        if (committee.id !== editingCommittee) return committee;
        // If editing a Username field, set both username and corresponding Name
        if (
          activeUserField === 'chairUsername' ||
          activeUserField === 'deputyChair1Username' ||
          activeUserField === 'deputyChair2Username'
        ) {
          const nameField = activeUserField.replace('Username', 'Name');
          return {
            ...committee,
            [activeUserField]: selected?.username || '',
            [nameField]: selected?.fullname || ''
          };
        }
        // If editing a Name field, set both name and corresponding Username
        if (
          activeUserField === 'chairName' ||
          activeUserField === 'deputyChair1Name' ||
          activeUserField === 'deputyChair2Name'
        ) {
          const usernameField = activeUserField.replace('Name', 'Username');
          return {
            ...committee,
            [activeUserField]: selected?.fullname || '',
            [usernameField]: selected?.username || ''
          };
        }
        return committee;
      }));
      // Mark as having unsaved changes after user selection
      setHasUnsavedChanges(true);
    }
    setShowUserDropdown(false);
    setFilteredUsers([]);
    setActiveUserDropdown(null);
    setActiveUserField(null);
    // Keep row in edit mode to continue editing other fields
    setTempValue('');
  };

  // Removed per-cell save function (superseded by unified Save)
  // const handleCommitteeFieldSave = async () => {};

  // Removed per-cell cancel (use context menu or leave edit mode by Save)
  // const handleCommitteeFieldCancel = () => {};

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
    // Prevent generating another row if one unsaved new row already exists
    const hasPendingNewRow = committees.some((c: any) => c.isNew);
    if (hasPendingNewRow) {
      return;
    }
    const newId = committees.length > 0 ? Math.max(...committees.map((c: any) => c.id)) + 1 : 1;
    const newCommittee: Committee = {
      id: newId,
      abbr: 'Auto Generated',
      committee: '',
      committeeId: undefined,
      seatsTotal: '30',
      chairUsername: '',
      chairName: '',
      deputyChair1Username: '',
      deputyChair1Name: '',
      deputyChair2Username: '',
      deputyChair2Name: '',
      isNew: true
    };
    setCommittees(prev => [...prev, newCommittee as any]);
    // Immediately enable editing for the chair username field on the newly added row
    setEditingCommittee(newId);
    setEditingCommitteeField('chairUsername');
    setTempValue(newCommittee.chairUsername);

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

  const handleDeleteCommittee = async () => {
    try {
      if (!contextMenuCommitteeId) return;
      const target = committees.find((c: any) => c.id === contextMenuCommitteeId);
      if (!target) return;

      // If it's a new unsaved row, just remove locally
      if (target.isNew) {
        setCommittees(prev => prev.filter((c: any) => c.id !== contextMenuCommitteeId));
        setShowContextMenu(false);
        setContextMenuCommitteeId(null);
        return;
      }

      const response = await deleteEventCommitteesByEventIdApi(String(contextMenuCommitteeId));
      if (!response.success) {
        toast.error('Failed to delete committee');
        return;
      }
      // After successful delete, refresh from backend to reflect latest data
      try {
        const refreshed = await getAllEventCommitteesApi(eventId as string);
        const raw = refreshed.data || [];
        const normalized = raw.map((item: any) => {
          const master = item && typeof item.committee === 'object' ? item.committee : null;
          const committeeText = master
            ? (master.committee ?? master.name ?? '')
            : (typeof item.committee === 'string' ? item.committee : '');
          const abbreviation = master ? (master.abbr ?? item.abbr ?? '') : (item.abbr ?? '');
          const masterId = master ? master.id : (item.committee_id ?? item.committeeId ?? undefined);
          return {
            id: item.id,
            committee: committeeText,
            abbr: abbreviation,
            committeeId: masterId,
            seatsTotal: String(item.seats ?? item.seatsTotal ?? ''),
            chairUsername: item.chair_username ?? '',
            chairName: item.chair_name ?? '',
            deputyChair1Username: item.deputy_chair_1_username ?? '',
            deputyChair1Name: item.deputy_chair_1_name ?? '',
            deputyChair2Username: item.deputy_chair_2_username ?? '',
            deputyChair2Name: item.deputy_chair_2_name ?? '',
            isNew: false
          };
        });
        setCommittees(Array.isArray(normalized) ? normalized : []);
      } catch (refreshErr) {
        // Fallback to local removal if refresh fails
        setCommittees(prev => prev.filter((c: any) => c.id !== contextMenuCommitteeId));
      }
      toast.success('Committee deleted');
    } catch (error: any) {
      console.error('Error deleting committee:', error);
      toast.error(error.message || 'Failed to delete committee');
    } finally {
      setShowContextMenu(false);
      setContextMenuCommitteeId(null);
    }
  };

  const handleEditCommittee = () => {
    if (contextMenuCommitteeId) {
      const committee = committees.find((c: any) => c.id === contextMenuCommitteeId);
      if (committee) {
        // Prevent editing fields for rows that are pending new (still allowed, but we set editing to specific field)
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
      // Only save the currently editing row (or the new pending row if present)
      const target =
        (editingCommittee && committees.find((c: any) => c.id === editingCommittee)) ||
        committees.find((c: any) => c.isNew) ||
        null;

      if (!target) {
        toast.error('No row selected to save');
        return;
      }

      if (!target.committee || target.committee === '') {
        toast.error('Please select a committee before saving');
        return;
      }

      // Require a selected master committee id; do not fallback to local row id
      const committeeIdentifier = (target as any).committeeId;
      if (!committeeIdentifier) {
        toast.error('Please select a committee from the dropdown before saving');
        return;
      }
      console.log('[CommitteesPage] Saving committee with identifier:', committeeIdentifier, 'target:', target);
      const response = await saveEventCommitteesByEventIdApi(
        committeeIdentifier.toString(),
        eventId as string,
        activeCommitteeType,
        target.seatsTotal,
        target.chairUsername,
        target.chairName,
        target.deputyChair1Username,
        target.deputyChair1Name,
        target.deputyChair2Username,
        target.deputyChair2Name
      );

      if (!response.success) {
        toast.error(`Failed to save committee: ${target.committee}`);
        return;
      }

      // Clear isNew flag after successful save
      setCommittees(prev => prev.map((c: any) => (c.id === target.id ? { ...c, isNew: false } : c)));
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
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center justify-center">
                  <div className="text-sm text-gray-900 text-center w-full">
                    {committee.abbr}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
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
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'committee', committee.committee || '') : undefined}
                    >
                      {committee.committee || 'E.g. United Nations Security Council'}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'seatsTotal' ? (
                    <div className="text-sm relative w-full">
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
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'seatsTotal', committee.seatsTotal) : undefined}
                    >
                      {committee.seatsTotal}
                    </div>
                  )}
                </div>

                {/* Chair Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
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
                          {filteredUsers.map((user, index) => {
                            const u = user && user.user ? user.user : user;
                            return (
                              <button
                                key={u?.id || index}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">@{u?.username}</div>
                                <div className="text-xs text-gray-500">{u?.fullname}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'chairUsername', committee.chairUsername || '') : undefined}
                    >
                      {committee.chairUsername || '-'}
                    </div>
                  )}
                </div>

                {/* Chair Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'chairName' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full" ref={userDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="Full name"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                      </div>
                      {showUserDropdown && activeUserDropdown === committee.id && activeUserField === 'chairName' && filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredUsers.map((user, index) => {
                            const u = user && user.user ? user.user : user;
                            return (
                              <button
                                key={u?.id || index}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">{u?.fullname}</div>
                                <div className="text-xs text-gray-500">@{u?.username}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'chairName', committee.chairName || '') : undefined}
                    >
                      {committee.chairName || '-'}
                    </div>
                  )}
                </div>

                {/* Deputy Chair 1 Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
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
                          {filteredUsers.map((user, index) => {
                            const u = user && user.user ? user.user : user;
                            return (
                              <button
                                key={u?.id || index}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">@{u?.username}</div>
                                <div className="text-xs text-gray-500">{u?.fullname}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'deputyChair1Username', committee.deputyChair1Username || '') : undefined}
                    >
                      {committee.deputyChair1Username || '-'}
                    </div>
                  )}
                </div>

                {/* Deputy Chair 1 Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair1Name' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full" ref={userDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="Full name"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                      </div>
                      {showUserDropdown && activeUserDropdown === committee.id && activeUserField === 'deputyChair1Name' && filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredUsers.map((user, index) => {
                            const u = user && user.user ? user.user : user;
                            return (
                              <button
                                key={u?.id || index}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">{u?.fullname}</div>
                                <div className="text-xs text-gray-500">@{u?.username}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'deputyChair1Name', committee.deputyChair1Name || '') : undefined}
                    >
                      {committee.deputyChair1Name || '-'}
                    </div>
                  )}
                </div>

                {/* Deputy Chair 2 Username */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
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
                          {filteredUsers.map((user, index) => {
                            const u = user && user.user ? user.user : user;
                            return (
                              <button
                                key={u?.id || index}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">@{u?.username}</div>
                                <div className="text-xs text-gray-500">{u?.fullname}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'deputyChair2Username', committee.deputyChair2Username || '') : undefined}
                    >
                      {committee.deputyChair2Username || '-'}
                    </div>
                  )}
                </div>

                {/* Deputy Chair 2 Name */}
                <div className="bg-gray-50 border border-gray-800 rounded-lg px-3 py-2 flex items-center">
                  {editingCommittee === committee.id && editingCommitteeField === 'deputyChair2Name' ? (
                    <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200 relative w-full" ref={userDropdownRef}>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          value={tempValue}
                          onChange={(e) => handleCommitteeFieldChange(e.target.value, committee.id)}
                          placeholder="Full name"
                          className="w-full border-none outline-none text-gray-900"
                          autoFocus
                          autoComplete="off"
                        />
                      </div>
                      {showUserDropdown && activeUserDropdown === committee.id && activeUserField === 'deputyChair2Name' && filteredUsers.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                          {filteredUsers.map((user, index) => {
                            const u = user && user.user ? user.user : user;
                            return (
                              <button
                                key={u?.id || index}
                                type="button"
                                onClick={() => handleUserSelect(user)}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-medium">{u?.fullname}</div>
                                <div className="text-xs text-gray-500">@{u?.username}</div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      className="text-sm text-gray-900 w-full"
                      onClick={editingCommittee === committee.id ? () => handleCommitteeFieldEdit(committee.id, 'deputyChair2Name', committee.deputyChair2Name || '') : undefined}
                    >
                      {committee.deputyChair2Name || '-'}
                    </div>
                  )}
                </div>

                {/* Actions Column */}
                <div className="bg-gray-50 px-3 py-2 text-sm font-medium relative">
                  <div className="relative flex items-center justify-center space-x-3">
                    <button
                      onClick={(e) => handleContextMenuClick(e, committee.id)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Actions"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
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
              onClick={() => { setShowDeleteConfirm(true); setShowContextMenu(false); }}
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

      {/* Delete confirmation modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          await handleDeleteCommittee();
          setShowDeleteConfirm(false);
        }}
        title="Delete committee?"
        message="Are you sure you want to delete this committee from this event?"
        confirmText="Yes"
        cancelText="No"
        confirmButtonColor="text-red-600"
      />

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

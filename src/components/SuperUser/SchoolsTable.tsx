import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { ConfirmationModal } from '../ui';
import { updateSchoolStatusApi, deleteSchoolApi, createSchoolApi } from '../../apis/schools';

interface School {
    id: string;
    code: string;
    name: string;
    locality: {
        name: string;
    };
    area: {
        name: string;
    };
    status?: string;
    created_at?: string;
    updated_at?: string;
}

interface SchoolsTableProps {
    schools: School[];
    onAction: (action: string, schoolId: string) => void;
    schoolType?: 'schools' | 'localities';
}

const SchoolsTable: React.FC<SchoolsTableProps> = ({ schools, onAction }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [updatingSchoolId, setUpdatingSchoolId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [schoolToDelete, setSchoolToDelete] = useState<string | null>(null);
    const [filteredSchools, setFilteredSchools] = useState<any[]>([]);
    const [showNewRow, setShowNewRow] = useState<boolean>(false);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const [newRowData, setNewRowData] = useState({
        schoolCode: '',
        schoolName: '',
        locality: '',
        area: '',
        status: 'Active'
    });
    const { refreshSchoolsData } = useApp();
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Filter schools based on search term
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredSchools(schools);
        } else {
            const filtered = schools.filter((school: any) => {
                const searchLower = searchTerm.toLowerCase();
                const schoolId = school?.id?.toString() || '';
                const schoolCode = school?.code || '';
                const schoolName = school?.name || '';
                const locality = school?.locality?.name || '';
                const area = school?.area?.name || '';
                const status = school?.status || '';

                return (
                    schoolId.toLowerCase().includes(searchLower) ||
                    schoolCode.toLowerCase().includes(searchLower) ||
                    schoolName.toLowerCase().includes(searchLower) ||
                    locality.toLowerCase().includes(searchLower) ||
                    area.toLowerCase().includes(searchLower) ||
                    status.toLowerCase().includes(searchLower)
                );
            });
            setFilteredSchools(filtered);
        }
    }, [searchTerm, schools]);

    // Handle clicking outside dropdown to close it
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
    //             setActiveDropdown(null);
    //         }
    //     };

    //     if (activeDropdown) {
    //         document.addEventListener('mousedown', handleClickOutside);
    //     }

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [activeDropdown]);

    const handleDropdownToggle = (schoolId: string) => {
        setActiveDropdown(activeDropdown === schoolId ? null : schoolId);
    };

    // Delete confirmation handlers
    const handleDeleteConfirm = () => {
        if (schoolToDelete) {
            handleAction('delete', schoolToDelete);
            setShowDeleteModal(false);
            setSchoolToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSchoolToDelete(null);
    };

    const handleAction = async (action: string, schoolId: string) => {
        try {
            setActiveDropdown(null); // Close dropdown immediately when action is triggered
            setUpdatingSchoolId(schoolId);
            if (action === 'delete') {
                const response = await deleteSchoolApi(schoolId);
                if (response.success) {
                    toast.success(response.message || 'School deleted successfully');
                    await refreshSchoolsData();
                    onAction(action, schoolId);
                } else {
                    toast.error(response.message || 'Failed to delete school');
                }
            } else {
                const response = await updateSchoolStatusApi(schoolId, action);
                if (response.success) {
                    toast.success(response.message || `School ${action} successfully`);
                    await refreshSchoolsData();
                    onAction(action, schoolId);
                } else {
                    toast.error(response.message || 'Failed to update school');
                }
            }
        } catch (error: any) {
            console.error('Error updating school:', error);
            toast.error(error.message || 'Failed to update school');
        } finally {
            setUpdatingSchoolId(null);
        }
    };

    const handleNewRowInputChange = (field: string, value: string) => {
        setNewRowData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveNewRow = async () => {
        try {
            // Validate required fields
            if (!newRowData.schoolCode.trim() || !newRowData.schoolName.trim() || !newRowData.locality.trim() || !newRowData.area.trim()) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Create school data object
            const schoolData = {
                code: newRowData.schoolCode.trim(),
                name: newRowData.schoolName.trim(),
                locality: newRowData.locality.trim(),
                area: newRowData.area.trim(),
                status: newRowData.status
            };

            const response = await createSchoolApi(schoolData);
            if (response.success) {
                toast.success('New school added successfully');
                setShowNewRow(false);
                setIsAddingNew(false);
                setNewRowData({
                    schoolCode: '',
                    schoolName: '',
                    locality: '',
                    area: '',
                    status: 'Active'
                });
                // Refresh data
                await refreshSchoolsData();
            } else {
                toast.error(response.message || 'Failed to save new school');
            }
        } catch (error: any) {
            console.error('Error saving new school:', error);
            toast.error(error.message || 'Failed to save new school');
        }
    };

    const getStatusColor = (status: string | undefined) => {
        if (!status) return 'text-gray-600';

        switch (status.toLowerCase()) {
            case 'active':
                return 'text-green-600';
            case 'blocked':
                return 'text-red-600';
            case 'flagged':
                return 'text-yellow-500';
            default:
                return 'text-gray-600';
        }
    };

    const handleAddNewRow = () => {
        setShowNewRow(true);
        setIsAddingNew(true);
        setNewRowData({
            schoolCode: '',
            schoolName: '',
            locality: '',
            area: '',
            status: 'Active'
        });
    };

    return (
        <div>
            {/* Search Input - Hidden as search is handled in parent */}
            <div className="mb-4" style={{ display: 'none' }}>
                <input
                    type="text"
                    placeholder="Search schools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Header Row */}
            <div className="flex gap-2 mb-2">
                {/* School ID */}
                <div className="w-24 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>School ID</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* School Code */}
                <div className="w-32 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>School Code</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* School Name */}
                <div className="flex-1 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>School Name</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Locality */}
                <div className="w-28 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center">
                    <span>Locality</span>
                </div>

                {/* Area */}
                <div className="w-28 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center">
                    <span>Area</span>
                </div>

                {/* Status */}
                <div className="w-24 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center">
                    <span>Status</span>
                </div>

                {/* Actions */}
                <div className="w-16 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md flex items-center">
                    <span></span>
                </div>
            </div>

            {/* Data Rows */}
            {filteredSchools.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No schools found matching your search' : 'No schools found'}
                </div>
            ) : filteredSchools.length > 0 ? (
                filteredSchools.map((school: any) => {
                    return (
                        <div key={school?.id || Math.random()} className="flex gap-2 mb-2">
                            {/* School ID */}
                            <div className="w-24 bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
                                {school?.id ? String(school.id).split('-')[0] : 'N/A'}
                            </div>

                            {/* School Code */}
                            <div className="w-32 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {school?.code || 'N/A'}
                            </div>

                            {/* School Name */}
                            <div className="flex-1 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {school?.name || 'N/A'}
                            </div>

                            {/* Locality */}
                            <div className="w-28 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {school?.locality?.name || 'N/A'}
                            </div>

                            {/* Area */}
                            <div className="w-28 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {school?.area?.code || 'N/A'}
                            </div>

                            {/* Status */}
                            <div className="w-24 bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                                {updatingSchoolId === school?.id ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                        <span className="text-gray-500">Updating</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${getStatusColor(school.status)}`}>
                                            {school.status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="w-16 px-3 py-2 text-sm font-medium relative" ref={dropdownRef}>
                                <div className="relative flex items-center justify-left">
                                    <button
                                        onClick={() => handleDropdownToggle(school?.id || '')}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>

                                    {activeDropdown === school?.id && (
                                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border-2">
                                            <div className="py-1">
                                                {/* Main management options - always show for all statuses */}
                                                <button
                                                    disabled={updatingSchoolId === school?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    disabled={updatingSchoolId === school?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    Add
                                                </button>

                                                <button
                                                    disabled={updatingSchoolId === school?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    List
                                                </button>

                                                <button
                                                    disabled={updatingSchoolId === school?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    Merge
                                                </button>

                                                {/* Status-specific buttons based on current status */}
                                                {/* Show Active button when status is not active */}
                                                {school?.status?.toLowerCase() !== 'active' && (
                                                    <button
                                                        onClick={() => handleAction('active', school?.id || '')}
                                                        disabled={updatingSchoolId === school?.id}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                            }`}
                                                    >
                                                        Active
                                                    </button>
                                                )}

                                                {/* Show Flag button when status is not flagged */}
                                                {school?.status?.toLowerCase() !== 'flagged' && (
                                                    <button
                                                        onClick={() => handleAction('flagged', school?.id || '')}
                                                        disabled={updatingSchoolId === school?.id}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                            }`}
                                                    >
                                                        Flag
                                                    </button>
                                                )}

                                                {/* Show Block button when status is not blocked */}
                                                {school?.status?.toLowerCase() !== 'blocked' && (
                                                    <button
                                                        onClick={() => handleAction('blocked', school?.id || '')}
                                                        disabled={updatingSchoolId === school?.id}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                            }`}
                                                    >
                                                        Block
                                                    </button>
                                                )}

                                                {/* Delete button - always show */}
                                                <button
                                                    onClick={() => { handleAction('delete', school?.id || ''); }}
                                                    disabled={updatingSchoolId === school?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingSchoolId === school?.id
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
                    );
                })
            ) : null}

            {/* New Row Input Fields */}
            {showNewRow && (
                <div className="flex gap-2 mb-2">
                    {/* School ID - Auto generated */}
                    <div className="w-24 bg-gray-100 px-3 py-2 text-sm text-gray-500 rounded-md border border-gray-200">
                        Auto
                    </div>

                    {/* School Code */}
                    <div className="w-32 bg-white px-3 py-2 rounded-md border border-gray-200">
                        <input
                            type="text"
                            value={newRowData.schoolCode}
                            onChange={(e) => handleNewRowInputChange('schoolCode', e.target.value)}
                            placeholder="Enter code"
                            className="w-full text-sm text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* School Name */}
                    <div className="flex-1 bg-white px-3 py-2 rounded-md border border-gray-200">
                        <input
                            type="text"
                            value={newRowData.schoolName}
                            onChange={(e) => handleNewRowInputChange('schoolName', e.target.value)}
                            placeholder="Enter school name"
                            className="w-full text-sm text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* Locality */}
                    <div className="w-28 bg-white px-3 py-2 rounded-md border border-gray-200">
                        <input
                            type="text"
                            value={newRowData.locality}
                            onChange={(e) => handleNewRowInputChange('locality', e.target.value)}
                            placeholder="Enter locality"
                            className="w-full text-sm text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* Area */}
                    <div className="w-28 bg-white px-3 py-2 rounded-md border border-gray-200">
                        <input
                            type="text"
                            value={newRowData.area}
                            onChange={(e) => handleNewRowInputChange('area', e.target.value)}
                            placeholder="Enter area"
                            className="w-full text-sm text-gray-900 focus:outline-none"
                        />
                    </div>

                    {/* Status */}
                    <div className="w-24 bg-white px-3 py-2 rounded-md border border-gray-200">
                        <select
                            value={newRowData.status}
                            onChange={(e) => handleNewRowInputChange('status', e.target.value)}
                            className="w-full text-sm text-gray-900 focus:outline-none"
                        >
                            <option value="Active">Active</option>
                            <option value="Blocked">Blocked</option>
                            <option value="Flagged">Flagged</option>
                        </select>
                    </div>

                    {/* Actions - Empty for new row */}
                    <div className="w-16 px-3 py-2 text-sm font-medium">
                        <span></span>
                    </div>
                </div>
            )}

            <div className="flex justify-start space-x-4 mt-6">
                <button
                    onClick={handleAddNewRow}
                    disabled={isAddingNew}
                    className={`bg-[#C2A46D] text-white font-medium rounded-[30px] w-[105px] h-[44px] px-[10px] py-[10px] mr-[10px] transition-colors duration-200 ${isAddingNew
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#9a7849]'
                        }`}
                >
                    Add
                </button>
                <button
                    onClick={handleSaveNewRow}
                    disabled={!isAddingNew}
                    className={`bg-[#C2A46D] text-white font-medium rounded-[30px] w-[105px] h-[44px] px-[10px] py-[10px] mr-[10px] transition-colors duration-200 ${!isAddingNew
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#b89a6a]'
                        }`}
                >
                    Save
                </button>
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirm Delete"
                message="Are you sure you want to delete this school? This action cannot be undone."
                confirmText="Yes"
                cancelText="No"
                confirmButtonColor="text-red-600"
            />
        </div>
    );
};

export default SchoolsTable;

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { ConfirmationModal } from '../ui';
import { updateSchoolStatusApi, deleteSchoolApi } from '../../apis/schools';

interface Locality {
    id: string;
    code: string;
    name: string;
    area: {
        code: string;
        name: string;
    };
    linkedSchoolsCount?: number;
    linkedStudentsCount?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

interface LocalitiesTableProps {
    localities: Locality[];
    onAction: (action: string, localityId: string) => void;
    localityType?: 'localities' | 'areas';
}

const LocalitiesTable: React.FC<LocalitiesTableProps> = ({ localities, onAction }) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [updatingLocalityId, setUpdatingLocalityId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [localityToDelete, setLocalityToDelete] = useState<string | null>(null);
    const [filteredLocalities, setFilteredLocalities] = useState<any[]>([]);
    const [showNewRow, setShowNewRow] = useState<boolean>(false);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const [newRowData, setNewRowData] = useState({
        localityCode: '',
        localityName: '',
        areaCode: '',
        areaName: '',
        linkedSchools: '',
        linkedStudents: '',
        status: 'Active'
    });
    const { refreshAreasData, refreshLocalitiesData } = useApp();
    const dropdownRef = useRef<HTMLDivElement>(null);
    // Filter localities based on search term
    console.log('----------------------localities:', localities);
    useEffect(() => {
        if (!localities || !Array.isArray(localities)) {
            setFilteredLocalities([]);
            return;
        }

        if (!searchTerm.trim()) {
            setFilteredLocalities(localities);
        } else {
            const filtered = localities.filter((locality: any) => {
                const searchLower = searchTerm.toLowerCase();
                const localityId = locality?.id?.toString() || '';
                const localityCode = locality.locality?.code || '';
                const localityName = locality.locality?.name || '';
                const areaCode = locality.area?.code || '';
                const areaName = locality.area?.name || '';
                const linkedSchools = locality?.linkedSchoolsCount?.toString() || '';
                const linkedStudents = locality?.linkedStudentsCount?.toString() || '';
                const status = locality?.status || '';

                return (
                    localityId.toLowerCase().includes(searchLower) ||
                    localityCode.toLowerCase().includes(searchLower) ||
                    localityName.toLowerCase().includes(searchLower) ||
                    areaCode.toLowerCase().includes(searchLower) ||
                    areaName.toLowerCase().includes(searchLower) ||
                    linkedSchools.includes(searchLower) ||
                    linkedStudents.includes(searchLower) ||
                    status.toLowerCase().includes(searchLower)
                );
            });
            setFilteredLocalities(filtered);
        }
    }, [searchTerm, localities]);

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

    const handleDropdownToggle = (localityId: string) => {
        setActiveDropdown(activeDropdown === localityId ? null : localityId);
    };

    // Delete confirmation handlers
    const handleDeleteConfirm = () => {
        if (localityToDelete) {
            handleAction('delete', localityToDelete);
            setShowDeleteModal(false);
            setLocalityToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setLocalityToDelete(null);
    };

    const handleAction = async (action: string, localityId: string) => {
        try {

            console.log('----------------------handleAction - Action:', action);
            console.log('----------------------handleAction - Locality ID:', localityId);
            setActiveDropdown(null); // Close dropdown immediately when action is triggered
            setUpdatingLocalityId(localityId);
            if (action === 'delete') {
                // Note: Using school API for locality deletion - may need locality-specific API
                const response = await deleteSchoolApi(localityId);
                if (response.success) {
                    toast.success(response.message || 'Locality deleted successfully');
                    await refreshAreasData();
                    await refreshLocalitiesData();
                    onAction(action, localityId);
                } else {
                    toast.error(response.message || 'Failed to delete locality');
                }
            } else {
                // Note: Using school API for locality status update - may need locality-specific API
                const response = await updateSchoolStatusApi(localityId, action);
                if (response.success) {
                    toast.success(response.message || `Locality ${action} successfully`);
                    await refreshAreasData();
                    await refreshLocalitiesData();
                    onAction(action, localityId);
                } else {
                    toast.error(response.message || 'Failed to update locality');
                }
            }
        } catch (error: any) {
            console.error('Error updating locality:', error);
            toast.error(error.message || 'Failed to update locality');
        } finally {
            setUpdatingLocalityId(null);
        }
    };

    const handleAddNewRow = () => {
        setShowNewRow(true);
        setIsAddingNew(true);
        setNewRowData({
            localityCode: 'Auto generated',
            localityName: '',
            areaCode: 'Auto generated',
            areaName: '',
            linkedSchools: '',
            linkedStudents: '',
            status: 'Active'
        });
    };

    const handleAddNew = () => {
        handleAddNewRow();
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
            if (!newRowData.localityName.trim() || !newRowData.areaName.trim()) {
                toast.error('Please fill in all required fields');
                return;
            }

            // Here you would typically call an API to create the new locality/area
            // For now, we'll just show a success message and close the row
            toast.success('New area added successfully');
            setShowNewRow(false);
            setIsAddingNew(false);
            setNewRowData({
                localityCode: '',
                localityName: '',
                areaCode: '',
                areaName: '',
                linkedSchools: '',
                linkedStudents: '',
                status: 'Active'
            });

            // Refresh data
            await refreshAreasData();
            await refreshLocalitiesData();
        } catch (error: any) {
            console.error('Error saving new row:', error);
            toast.error('Failed to save new area');
        }
    };

    const handleSaveNew = () => {
        handleSaveNewRow();
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

    return (
        <div>
            {/* Search Input - Hidden as search is handled in parent */}
            <div className="mb-4" style={{ display: 'none' }}>
                <input
                    type="text"
                    placeholder="Search localities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Header Row */}
            <div className="flex gap-2 mb-2">
                {/* Locality Code */}
                <div className="w-32 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>Locality Code</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Locality Name */}
                <div className="w-40 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>Locality Name</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Area Code */}
                <div className="w-32 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>Area Code</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Area Name */}
                <div className="w-40 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>Area Name</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Linked Schools (Area) */}
                <div className="w-36 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>Linked Schools (Area)</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {/* Linked Students (Area) */}
                <div className="w-36 px-3 py-2 text-xs font-medium text-gray-900 uppercase tracking-wider rounded-md bg-[#C6DAF4] border border-[#4A5F7A] flex items-center justify-between">
                    <span>Linked Students (Area)</span>
                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
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
            {!filteredLocalities || filteredLocalities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No localities found matching your search' : 'No localities found'}
                </div>
            ) : filteredLocalities.length > 0 ? (
                filteredLocalities.map((locality: any) => {
                    return (
                        <div key={locality?.id || Math.random()} className="flex gap-2 mb-2">
                            {/* Locality Code */}
                            <div className="w-32 bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
                                {locality?.locality?.code || 'N/A'}
                            </div>

                            {/* Locality Name */}
                            <div className="w-40 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {locality?.locality?.name || 'N/A'}
                            </div>

                            {/* Area Code */}
                            <div className="w-32 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {locality?.area?.code || 'N/A'}
                            </div>

                            {/* Area Name */}
                            <div className="w-40 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {locality?.area?.name || 'N/A'}
                            </div>

                            {/* Linked Schools (Area) */}
                            <div className="w-36 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {locality?.linkedSchoolsCount || '-'}
                            </div>

                            {/* Linked Students (Area) */}
                            <div className="w-36 bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {locality?.linkedStudentsCount || '-'}
                            </div>

                            {/* Status */}
                            <div className="w-24 bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                                {updatingLocalityId === locality?.id ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                                        <span className="text-gray-500">Updating</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <span className={`font-medium ${getStatusColor(locality.status)}`}>
                                            {locality.status}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="w-16 px-3 py-2 text-sm font-medium relative" ref={dropdownRef}>
                                <div className="relative flex items-center justify-left">
                                    <button
                                        onClick={() => handleDropdownToggle(locality?.id || '')}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>

                                    {activeDropdown === locality?.id && (
                                        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border-2">
                                            <div className="py-1">
                                                {/* Main management options - always show for all statuses */}
                                                <button
                                                    disabled={updatingLocalityId === locality?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    disabled={updatingLocalityId === locality?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    Add
                                                </button>

                                                <button
                                                    disabled={updatingLocalityId === locality?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    List
                                                </button>

                                                <button
                                                    disabled={updatingLocalityId === locality?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                        ? 'text-gray-400 cursor-not-allowed'
                                                        : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                        }`}
                                                >
                                                    Merge
                                                </button>

                                                {/* Status-specific buttons based on current status */}
                                                {/* Show Active button when status is not active */}
                                                {locality?.status?.toLowerCase() !== 'active' && (
                                                    <button
                                                        onClick={() => handleAction('active', locality?.id || '')}
                                                        disabled={updatingLocalityId === locality?.id}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                            }`}
                                                    >
                                                        Active
                                                    </button>
                                                )}

                                                {/* Show Flag button when status is not flagged */}
                                                {locality?.status?.toLowerCase() !== 'flagged' && (
                                                    <button
                                                        onClick={() => handleAction('flagged', locality?.id || '')}
                                                        disabled={updatingLocalityId === locality?.id}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                            }`}
                                                    >
                                                        Flag
                                                    </button>
                                                )}

                                                {/* Show Block button when status is not blocked */}
                                                {locality?.status?.toLowerCase() !== 'blocked' && (
                                                    <button
                                                        onClick={() => handleAction('blocked', locality?.id || '')}
                                                        disabled={updatingLocalityId === locality?.id}
                                                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-[#C6DAF4] hover:text-gray-900'
                                                            }`}
                                                    >
                                                        Block
                                                    </button>
                                                )}

                                                {/* Delete button - always show */}
                                                <button
                                                    onClick={() => { handleAction('delete', locality?.id || ''); }}
                                                    disabled={updatingLocalityId === locality?.id}
                                                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingLocalityId === locality?.id
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

            {/* New Row Input */}
            {showNewRow && (
                <div className="flex gap-2 mb-2">
                    {/* Locality Code */}
                    <div className="w-32 bg-white px-3 py-2 text-sm text-gray-500 rounded-md border border-gray-200">
                        {newRowData.localityCode}
                    </div>

                    {/* Locality Name */}
                    <div className="w-40 bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                        <input
                            type="text"
                            value={newRowData.localityName}
                            onChange={(e) => handleNewRowInputChange('localityName', e.target.value)}
                            placeholder="Enter locality name"
                            className="w-full border-none outline-none text-gray-900"
                        />
                    </div>

                    {/* Area Code */}
                    <div className="w-32 bg-white px-3 py-2 text-sm text-gray-500 rounded-md border border-gray-200">
                        {newRowData.areaCode}
                    </div>

                    {/* Area Name */}
                    <div className="w-40 bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                        <input
                            type="text"
                            value={newRowData.areaName}
                            onChange={(e) => handleNewRowInputChange('areaName', e.target.value)}
                            placeholder="Add area"
                            className="w-full border-none outline-none text-gray-900"
                        />
                    </div>

                    {/* Linked Schools (Area) */}
                    <div className="w-36 bg-white px-3 py-2 text-sm text-gray-500 rounded-md border border-gray-200">
                        -
                    </div>

                    {/* Linked Students (Area) */}
                    <div className="w-36 bg-white px-3 py-2 text-sm text-gray-500 rounded-md border border-gray-200">
                        -
                    </div>

                    {/* Status */}
                    <div className="w-24 bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                        <select
                            value={newRowData.status}
                            onChange={(e) => handleNewRowInputChange('status', e.target.value)}
                            className="w-full border-none outline-none text-gray-900 bg-transparent"
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="w-16 px-3 py-2 text-sm font-medium relative">
                        <div className="relative flex items-center justify-left">
                            <button
                                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                message="Are you sure you want to delete this locality? This action cannot be undone."
                confirmText="Yes"
                cancelText="No"
                confirmButtonColor="text-red-600"
            />
        </div>
    );
};

export default LocalitiesTable;

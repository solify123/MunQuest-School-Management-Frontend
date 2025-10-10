import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ConfirmationModal from '../ui/ConfirmationModal';
import { useApp } from '../../contexts/AppContext';
import DelegatesContactInfoPage from './Delegates-ContactInfoPage';
import DelegatesFoodInfoPage from './Delegates-FoodInfoPage';
import DelegatesAllocationPage from './Delegates-AllocationPage';

interface DelegateItem {
    id: number;
    uniqueId: string;
    registrationId: string;
    name: string;
    academicLevel: string;
    school: string;
    munExperience: number;
    preferredCommittees: string[];
    assignedCommittees: string[];
    assignedCountry: string;
    isLocked: boolean;
}

const DelegatesPage: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState('key-info');
    const [delegates, setDelegates] = useState<DelegateItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showDelegateMenu, setShowDelegateMenu] = useState<number | null>(null);

    // Refs for detecting clicks outside menus
    const delegateMenuRef = useRef<HTMLDivElement>(null);

    // Confirmation modal state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [delegateToDelete, setDelegateToDelete] = useState<number | null>(null);

    const { eventId } = useParams();
    const { allRegistrations, refreshRegistrationsData } = useApp();


    const subTabs = [
        { id: 'key-info', name: 'Key Info' },
        { id: 'contact-info', name: 'Contact Info' },
        { id: 'food-info', name: 'Food Info' },
        { id: 'allocation', name: 'Allocation' }
    ];

    // Load delegates when component mounts
    useEffect(() => {
        const loadDelegates = async () => {
            setIsLoading(true);
            try {
                await refreshRegistrationsData(eventId as string);
            } catch (error) {
                toast.error('Failed to load delegates');
            } finally {
                setIsLoading(false);
            }
        };

        if (eventId) {
            loadDelegates();
        }
    }, [eventId, refreshRegistrationsData]);

    // Update delegates when allRegistrations changes
    useEffect(() => {
        if (allRegistrations && allRegistrations.length > 0) {
            const mockDelegates: DelegateItem[] = allRegistrations
                .map((registration: any) => ({
                    id: registration.id || 0,
                    uniqueId: registration.user_id.slice(0, 6) || '',
                    registrationId: registration.id.slice(0, 6) || '',
                    name: registration.user.fullname || '',
                    academicLevel: registration.user.grade || 'N/A',
                    school: registration.user.school.name || '',
                    munExperience: registration.mun_experience || 0,
					preferredCommittees: [
						registration.pref_committee_1?.abbr,
						registration.pref_committee_2?.abbr,
						registration.pref_committee_3?.abbr
					].filter(Boolean) as string[],
                    assignedCommittees: registration.assignedCommittees || [],
                    assignedCountry: registration.assignedCountry || '',
                    isLocked: registration.isLocked || false
                }));
            setDelegates(mockDelegates);
        } else {
            setDelegates([]);
        }
    }, [allRegistrations]);

    // Handle clicks outside menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (delegateMenuRef.current && !delegateMenuRef.current.contains(event.target as Node)) {
                setShowDelegateMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        // Implement search logic here
    };

    const handleGlobalAllocation = () => {
        toast.success('Global Allocation feature coming soon');
    };

    const handleUploadDelegates = () => {
        toast.success('Upload Delegates feature coming soon');
    };
    

    const handleAssign = (_delegateId: number) => {
        setShowDelegateMenu(null);
        toast.success('Assign feature coming soon');
    };

    const handleUnassign = (_delegateId: number) => {
        setShowDelegateMenu(null);
        toast.success('Unassign feature coming soon');
    };

    const handleRemoveFromEvent = (delegateId: number) => {
        setDelegateToDelete(delegateId);
        setShowDeleteConfirm(true);
        setShowDelegateMenu(null);
    };

    const handleViewProfile = (_delegateId: number) => {
        setShowDelegateMenu(null);
        toast.success('View Profile feature coming soon');
    };

    const handleFlag = (_delegateId: number) => {
        setShowDelegateMenu(null);
        toast.success('Flag feature coming soon');
    };

    const handleMerge = (_delegateId: number) => {
        setShowDelegateMenu(null);
        toast.success('Merge feature coming soon');
    };

    const handleLockAll = () => {
        setDelegates(prev => prev.map(delegate => ({ ...delegate, isLocked: true })));
        toast.success('All delegates locked');
    };

    const handleUnlockAll = () => {
        setDelegates(prev => prev.map(delegate => ({ ...delegate, isLocked: false })));
        toast.success('All delegates unlocked');
    };

    const confirmDelete = async () => {
        if (!delegateToDelete) return;

        try {
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setDelegates(prev => prev.filter(delegate => delegate.id !== delegateToDelete));
            toast.success('Delegate removed successfully');
        } catch (error) {
            console.error('Error removing delegate:', error);
            toast.error('Failed to remove delegate');
        } finally {
            setShowDeleteConfirm(false);
            setDelegateToDelete(null);
        }
    };

    const filteredDelegates = delegates.filter(delegate =>
        (delegate.name && delegate.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (delegate.registrationId && delegate.registrationId.includes(searchTerm)) ||
        (delegate.school && delegate.school.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#395579]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Sub Navigation Tabs */}
            <div className="flex space-x-2">
                {subTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`w-[150px] h-[58px] rounded-[20px] p-[5px] opacity-100 transition-colors text-sm font-medium ${activeSubTab === tab.id
                            ? 'bg-[#6A8BAF] text-white'
                            : 'bg-white text-black border border-gray-800'
                            } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        style={{ transform: 'rotate(0deg)' }}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

			{/* Conditional content for sub-tabs */}
			{activeSubTab === 'contact-info' ? (
				<DelegatesContactInfoPage />
			) : activeSubTab === 'food-info' ? (
				<DelegatesFoodInfoPage />
			) : activeSubTab === 'allocation' ? (
				<DelegatesAllocationPage />
			) : (
				<>
					{/* Search and Action Bar */}
					<div className="flex items-center justify-between p-4 rounded-lg shadow-sm">
						<div className="flex items-center space-x-4">
							<div className="relative">
								<input
									type="text"
									placeholder="Search"
									value={searchTerm}
									onChange={(e) => handleSearch(e.target.value)}
									className="pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
								/>
								<svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<button
								onClick={handleGlobalAllocation}
								className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-[20px] hover:bg-green-700 transition-colors duration-200"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
								</svg>
								<span>Global Allocation</span>
							</button>

							<button
								onClick={handleUploadDelegates}
								className="flex items-center space-x-2 bg-[#C2A46D] text-white px-4 py-2 rounded-[20px] hover:opacity-90 transition-colors duration-200"
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								<span>Upload Delegates</span>
							</button>
						</div>
					</div>

					{/* Delegates Table */}
					<div>
                {/* Header Row */}
                <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '80px 80px 120px 100px 140px 80px 160px 140px 140px 80px' }}>
                    {['Unique ID', 'Registration ID', 'Name', 'Academic Level', 'School', 'MUN Experience', 'Preferred Committees', 'Assigned Committees', 'Assigned Country', ' '].map((header, index) => (
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
                                <span style={{ width: '100%', wordWrap: 'break-word' }}>{header}</span>
                                {index < 4 && (
                                    <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </div>
                        )
                    ))}
                </div>

                {/* Data Rows */}
                {filteredDelegates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        {searchTerm ? 'No delegates found matching your search' : 'No delegates found'}
                    </div>
                ) : (
                    filteredDelegates.map((delegate) => (
                        <div key={delegate.id} className="grid gap-2 mb-2" style={{ gridTemplateColumns: '80px 80px 120px 100px 140px 80px 160px 140px 140px 80px' }}>
                            {/* Unique ID */}
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {delegate.uniqueId}
                            </div>

                            {/* Registration ID */}
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {delegate.registrationId}
                            </div>

                            {/* Name */}
                            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
                                {delegate.name}
                            </div>

                            {/* Academic Level */}
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {delegate.academicLevel}
                            </div>

                            {/* School */}
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {delegate.school}
                            </div>

                            {/* MUN Experience */}
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {delegate.munExperience}
                            </div>

                            {/* Preferred Committees */}
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
                                {delegate.preferredCommittees.join(', ')}
                            </div>

                            {/* Assigned Committees */}
                            <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                                {delegate.assignedCommittees.length > 0 ? (
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-900">{delegate.assignedCommittees.join(', ')}</span>
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-1">
                                        <span className="text-red-600">Unassigned</span>
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Assigned Country */}
                            <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
                                {delegate.assignedCountry ? (
                                    <div className="flex items-center space-x-1">
                                        <span className="text-gray-900">{delegate.assignedCountry}</span>
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-1">
                                        <span className="text-red-600">Unassigned</span>
                                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="bg-white px-3 py-2 rounded-md border border-gray-200">
                                <div className="flex items-center space-x-2">
                                    <button className="p-1 hover:bg-gray-100 rounded">
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </button>

                                    <div className="relative" ref={delegateMenuRef}>
                                        <button
                                            onClick={() => setShowDelegateMenu(showDelegateMenu === delegate.id ? null : delegate.id)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>

                                        {showDelegateMenu === delegate.id && (
                                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                <button
                                                    onClick={() => handleAssign(delegate.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                                >
                                                    Assign
                                                </button>
                                                <button
                                                    onClick={() => handleUnassign(delegate.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                                >
                                                    Unassign
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveFromEvent(delegate.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                                >
                                                    Remove from Event
                                                </button>
                                                <button
                                                    onClick={() => handleViewProfile(delegate.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                                >
                                                    View Profile
                                                </button>
                                                <button
                                                    onClick={() => handleFlag(delegate.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-200"
                                                >
                                                    Flag
                                                </button>
                                                <button
                                                    onClick={() => handleMerge(delegate.id)}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Merge
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex items-center justify-start space-x-4">
                <button
                    onClick={handleLockAll}
                    className="bg-[#C2A46D] text-white px-6 py-2 rounded-[20px] hover:opacity-90 transition-colors duration-200"
                >
                    Lock All
                </button>
                <button
                    onClick={handleUnlockAll}
                    className="bg-[#C2A46D] text-white px-6 py-2 rounded-[20px] hover:opacity-90 transition-colors duration-200"
                >
                    Unlock All
                </button>
            </div>

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={confirmDelete}
                title="Remove Delegate"
                message="Are you sure you want to remove this delegate from the event? This action cannot be undone."
                confirmText="Remove"
                cancelText="Cancel"
                confirmButtonColor="text-red-600"
            />

			</>
		)}
		</div>
	);
};

export default DelegatesPage;

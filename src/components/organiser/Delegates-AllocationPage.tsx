import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';
import { getAllEventCommitteesApi } from '../../apis/Event_committes';

interface DelegateItem {
    id: number;
    uniqueId: string;
    name: string;
    academicLevel: string;
    school: string;
    munExperience: number | string;
    preferredCommittees: string[];
    assignedCommittees: string[];
    assignedCountry: string;
    isLocked?: boolean;
}

const DelegatesAllocationPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [subTabLoading, setSubTabLoading] = useState<boolean>(false);
    const [activeCommitteeType, setActiveCommitteeType] = useState('country');
    const [activeCommittee, setActiveCommittee] = useState<string>('FULL');
    const [allCommitteesData, setAllCommitteesData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showDelegateMenu, setShowDelegateMenu] = useState<number | null>(null);
    const delegateMenuRef = useRef<HTMLDivElement>(null);

    const { eventId } = useParams();
    const { allRegistrations, refreshRegistrationsData } = useApp();

    // Close menus when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (delegateMenuRef.current && !delegateMenuRef.current.contains(event.target as Node)) {
                setShowDelegateMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Initial load
    useEffect(() => {
        const load = async () => {
            try {
                setIsLoading(true);
                if (eventId) {
                    await refreshRegistrationsData(eventId);
                    const response = await getAllEventCommitteesApi(eventId);
                    const raw = response?.data || [];
                    const normalized = raw.map((item: any) => {
                        const master = item && typeof item.committee === 'object' ? item.committee : null;
                        return {
                            id: String(item.id),
                            abbr: master ? (master.abbr ?? item.abbr ?? '') : (item.abbr ?? ''),
                            committee: master ? (master.committee ?? master.name ?? '') : (item.committee ?? ''),
                            category: master ? master.category : item.category || 'country'
                        };
                    });
                    setAllCommitteesData(Array.isArray(normalized) ? normalized : []);
                }
            } catch (error: any) {
                toast.error(error?.message || 'Failed to load allocation data');
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [eventId, refreshRegistrationsData]);

    // Sub-tab abbreviations by committee type
    const committeeAbbreviations = useMemo(() => {
        const filtered = allCommitteesData.filter(c => c.category === activeCommitteeType);
        const abbrs = filtered.map(c => c.abbr).filter(Boolean);
        const unique = Array.from(new Set(abbrs));
        return [...unique, 'FULL LIST'];
    }, [allCommitteesData, activeCommitteeType]);

    // Build delegates
    const delegates: DelegateItem[] = useMemo(() => {
        if (!Array.isArray(allRegistrations)) return [];
        return allRegistrations.map((registration: any) => {
            const user = registration?.user || {};
            const preferred = [
                registration?.pref_committee_1?.abbr,
                registration?.pref_committee_2?.abbr,
                registration?.pref_committee_3?.abbr
            ].filter(Boolean) as string[];
            return {
                id: registration?.id || 0,
                uniqueId: String(registration?.user_id || '').slice(0, 8),
                name: user?.fullname || '',
                academicLevel: user?.grade || 'N/A',
                school: user?.school?.name || user?.school_name || '',
                munExperience: registration?.mun_experience ?? 0,
                preferredCommittees: preferred,
                assignedCommittees: registration?.assignedCommittees || registration?.assigned_committees || [],
                assignedCountry: registration?.assignedCountry || registration?.assigned_country || '',
                isLocked: registration?.isLocked || false
            } as DelegateItem;
        });
    }, [allRegistrations]);

    // Filter by active sub-tab and search term
    const filteredDelegates = useMemo(() => {
        let list = delegates;
        if (activeCommittee && activeCommittee !== 'FULL') {
            const abbr = activeCommittee;
            list = list.filter(d =>
                (Array.isArray(d.assignedCommittees) && d.assignedCommittees.includes(abbr)) ||
                (Array.isArray(d.preferredCommittees) && d.preferredCommittees.includes(abbr))
            );
        }
        const term = searchTerm.trim().toLowerCase();
        if (!term) return list;
        return list.filter(d =>
            (d.name && d.name.toLowerCase().includes(term)) ||
            (d.uniqueId && d.uniqueId.includes(searchTerm)) ||
            (d.school && d.school.toLowerCase().includes(term))
        );
    }, [delegates, activeCommittee, searchTerm]);

    const handleCommitteeTypeChange = (type: string) => {
        setActiveCommitteeType(type);
        setSubTabLoading(true);
        // Switch to FULL list on type switch
        setActiveCommittee('FULL');
        setTimeout(() => setSubTabLoading(false), 200);
    };

    const handleSubTabChange = (abbr: string) => {
        setSubTabLoading(true);
        setActiveCommittee(abbr);
        setTimeout(() => setSubTabLoading(false), 150);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#395579]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Committee Type Tabs */}
            <div className="flex space-x-2">
                {[
                    { id: 'country', name: 'Country Committees' },
                    { id: 'role', name: 'Role Committees' },
                    { id: 'crisis', name: 'Crisis Committees' },
                    { id: 'open', name: 'Open Committees' }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => handleCommitteeTypeChange(type.id)}
                        className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${activeCommitteeType === type.id
                            ? 'bg-[#84B5F3]'
                            : 'bg-white text-black border border-gray-800'
                            }`}
                    >
                        {type.name}
                    </button>
                ))}
            </div>

            {/* Committee Abbreviation Sub-tabs */}
            {committeeAbbreviations.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {committeeAbbreviations.map((abbr) => (
                        <button
                            key={abbr}
                            onClick={() => handleSubTabChange(abbr)}
                            disabled={subTabLoading}
                            className={`w-[190px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${activeCommittee === abbr
                                ? 'bg-[#C6DAF4]'
                                : 'bg-white text-black border border-gray-800'
                                } ${subTabLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                                style={{fontSize: '14px'}}
                        >
                            {abbr}
                            <div className="text-black flex items-center justify-center gap-2" style={{ fontSize: '14px', fontWeight: 300 }}>
                                <span className='flex items-center justify-center gap-2'>
                                    Total:
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>30</span>
                                </span>
                                <span className='flex items-center justify-center gap-2'>
                                    Assigned:
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>10</span>
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Search + Download */}
            <div className="flex items-center justify-start p-4 rounded-lg gap-8">
                <button
                    onClick={() => toast.success('Download coming soon')}
                    className="w-[250px] text-white font-medium transition-colors hover:opacity-90"
                    style={{
                        height: '44px',
                        borderRadius: '30px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: 'none',
                        background: '#4CAF50',
                    }}
                >
                    Committee Allocations
                </button>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or MUN experience or school and assign"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="min-w-[415px] pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Search + Download */}
            <div className="flex items-center justify-between p-4 mt-0 mr-16" style={{ marginTop: '0px' }}>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <h1
                            style={{
                                fontWeight: 700,
                                fontStyle: 'normal',
                                fontSize: '30px',
                                lineHeight: '150%',
                                letterSpacing: '0%',
                                verticalAlign: 'middle',
                                margin: 0,
                            }}
                        >
                            {activeCommittee}
                        </h1>
                    </div>
                </div>

                <button
                    onClick={() => toast.success('Download coming soon')}
                    className="text-white font-medium transition-colors hover:opacity-90"
                    style={{
                        height: '44px',
                        borderRadius: '30px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        background: '#C2A46D',
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: 'none',
                    }}
                >
                    Download List
                </button>
            </div>

            {/* Delegates Table */}
            <div>
                {/* Header Row */}
                <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: '100px 120px 100px 140px 100px 170px 120px 100px 40px' }}>
                    {['Unique ID', 'Name', 'Academic Level', 'School', 'MUN Experience', 'Preferred Committees', 'Assigned Committees', 'Assigned Country', ' '].map((header, index) => (
                        header === ' ' ? (
                            <div key={header}></div>
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
                {subTabLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E395D]"></div>
                        <span className="ml-2 text-gray-600">Loading...</span>
                    </div>
                ) : filteredDelegates.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">{searchTerm ? 'No delegates found matching your search' : 'No delegates found'}</div>
                ) : (
                    filteredDelegates.map((delegate) => (
                        <div key={delegate.id} className="grid gap-2 mb-2" style={{ gridTemplateColumns: '100px 120px 100px 140px 100px 170px 120px 100px 40px' }}>
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200 text-wrap">{delegate.uniqueId}</div>
                            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">{delegate.name}</div>
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200 text-wrap">{delegate.academicLevel}</div>
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200 text-wrap">{delegate.school}</div>
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200 text-wrap">{delegate.munExperience}</div>
                            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">{delegate.preferredCommittees.join(', ')}</div>
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
                            <div className="px-2 py-3">
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
                                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDelegateMenu(null)}>
                                                Assign
                                            </button>
                                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" onClick={() => setShowDelegateMenu(null)}>
                                                Unassign
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center justify-start space-x-4">
                <button
                    onClick={() => toast.success('All delegates locked')}
                    className="bg-[#C2A46D] text-white px-6 py-2 rounded-[20px] hover:opacity-90 transition-colors duration-200"
                >
                    Lock All
                </button>
                <button
                    onClick={() => toast.success('All delegates unlocked')}
                    className="bg-[#C2A46D] text-white px-6 py-2 rounded-[20px] hover:opacity-90 transition-colors duration-200"
                >
                    Unlock All
                </button>
            </div>
        </div>
    );
};

export default DelegatesAllocationPage;



import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Header } from '../ui';
import PageLoader from '../PageLoader';

interface UploadResult {
    linked: number;
    created: number;
    needsReview: number;
    errors: string[];
}

interface DelegateData {
    email: string;
    name: string;
    school: string;
    academicLevel?: string;
    munExperience?: string;
    preferredCommittees?: string[];
    phone?: string;
}

interface ProcessResult {
    status: 'linked' | 'created' | 'needs_review' | 'error';
    error?: string;
}

interface User {
    id: number;
    email: string;
    name: string;
}

interface EventRegistration {
    id: number;
    userId: number;
    eventId: number;
}

interface FallbackMatch {
    user: User;
    registration: EventRegistration;
}

const DelegatesUploadPage: React.FC = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadGoogleSheets = () => {
        // Trigger file input for Google Sheets
        if (fileInputRef.current) {
            fileInputRef.current.accept = '.csv,.xlsx,.xls';
            fileInputRef.current.click();
        }
    };

    const handleUploadGoogleForm = () => {
        // Trigger file input for Google Form data
        if (fileInputRef.current) {
            fileInputRef.current.accept = '.csv,.xlsx,.xls';
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadResult(null);

        try {
            const delegateData = await parseFile(file);
            const result = await processDelegateUpload(delegateData);
            setUploadResult(result);
            
            if (result.errors.length === 0) {
                toast.success(`Upload completed! Linked: ${result.linked}, Created: ${result.created}, Needs Review: ${result.needsReview}`);
            } else {
                toast.error(`Upload completed with ${result.errors.length} errors. Check details below.`);
            }
        } catch (error) {
            console.log('Upload error:', error);
            toast.error('Failed to process upload. Please check file format and try again.');
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const parseFile = async (file: File): Promise<DelegateData[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const text = e.target?.result as string;
                    const lines = text.split('\n').filter(line => line.trim());
                    
                    if (lines.length < 2) {
                        reject(new Error('File must contain at least a header row and one data row'));
                        return;
                    }

                    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                    const data: DelegateData[] = [];

                    for (let i = 1; i < lines.length; i++) {
                        const values = lines[i].split(',').map(v => v.trim());
                        const row: any = {};
                        
                        headers.forEach((header, index) => {
                            row[header] = values[index] || '';
                        });

                        // Map common column names to our interface
                        const delegateData: DelegateData = {
                            email: normalizeEmail(row.email || row['email address'] || ''),
                            name: normalizeName(row.name || row['full name'] || ''),
                            school: normalizeSchool(row.school || row['school name'] || ''),
                            academicLevel: row['academic level'] || row.grade || row.year || '',
                            munExperience: row['mun experience'] || row.experience || '',
                            preferredCommittees: parseCommittees(row['preferred committees'] || row.committees || ''),
                            phone: normalizePhone(row.phone || row['phone number'] || row.mobile || '')
                        };

                        if (delegateData.email && delegateData.name) {
                            data.push(delegateData);
                        }
                    }

                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    };

    const processDelegateUpload = async (delegateData: DelegateData[]): Promise<UploadResult> => {
        const result: UploadResult = {
            linked: 0,
            created: 0,
            needsReview: 0,
            errors: []
        };

        for (const delegate of delegateData) {
            try {
                const processResult = await processIndividualDelegate(delegate);
                
                switch (processResult.status) {
                    case 'linked':
                        result.linked++;
                        break;
                    case 'created':
                        result.created++;
                        break;
                    case 'needs_review':
                        result.needsReview++;
                        break;
                    case 'error':
                        result.errors.push(`${delegate.name}: ${processResult.error}`);
                        break;
                }
            } catch (error) {
                result.errors.push(`${delegate.name}: ${error}`);
            }
        }

        return result;
    };

    const processIndividualDelegate = async (delegate: DelegateData): Promise<ProcessResult> => {
        // This would integrate with your backend API
        // For now, implementing the business logic structure
        
        // 1. Try to match by email (primary key)
        const emailMatch = await findUserByEmail(delegate.email);
        
        if (emailMatch) {
            // Check if user is registered for this event
            const eventRegistration = await findEventRegistration(emailMatch.id);
            
            if (eventRegistration) {
                // Scenario 2: Signed up and already registered
                return await handleExistingRegistration(emailMatch, eventRegistration, delegate);
            } else {
                // Scenario 1: Signed up but not registered for this event
                return await handleNewRegistration(emailMatch, delegate);
            }
        } else {
            // Try fallback matching
            const fallbackMatch = await tryFallbackMatching(delegate);
            
            if (fallbackMatch) {
                return await handleExistingRegistration(fallbackMatch.user, fallbackMatch.registration, delegate);
            } else {
                // Scenario 3: Not signed up, create new user
                return await handleNewUserCreation(delegate);
            }
        }
    };

    // Helper functions for data normalization
    const normalizeEmail = (email: string): string => {
        return email.toLowerCase().trim();
    };

    const normalizeName = (name: string): string => {
        return name.replace(/\s+/g, ' ').trim();
    };

    const normalizeSchool = (school: string): string => {
        // This would use your school alias map
        return school.trim();
    };

    const normalizePhone = (phone: string): string => {
        // Strip spaces and dashes, convert to E.164 format
        return phone.replace(/[\s-]/g, '');
    };

    const parseCommittees = (committees: string): string[] => {
        if (!committees) return [];
        return committees.split(',').map(c => c.trim()).filter(c => c);
    };

    // Mock API functions - these would be replaced with actual API calls
    const findUserByEmail = async (email: string): Promise<User | null> => {
        // Mock implementation - replace with actual API call
        console.log('Finding user by email:', email);
        return null;
    };

    const findEventRegistration = async (userId: number): Promise<EventRegistration | null> => {
        // Mock implementation - replace with actual API call
        console.log('Finding event registration for user:', userId);
        return null;
    };

    const tryFallbackMatching = async (delegate: DelegateData): Promise<FallbackMatch | null> => {
        // Try phone number matching, then name+school matching
        // Mock implementation - replace with actual API call
        console.log('Trying fallback matching for:', delegate.name);
        return null;
    };

    const handleExistingRegistration = async (user: User, registration: EventRegistration, delegate: DelegateData): Promise<ProcessResult> => {
        // Apply safe update rules
        // Never overwrite existing fields with blanks
        // Only fill missing event-specific fields
        // Flag conflicts for review
        console.log(registration);
        console.log(delegate)
        console.log('Handling existing registration for:', user.name);
        return { status: 'linked' };
    };

    const handleNewRegistration = async (user: User, delegate: DelegateData): Promise<ProcessResult> => {
        // Create delegate row for this event
        // Link to existing user
        console.log(delegate)
        console.log('Creating new registration for:', user.name);
        return { status: 'linked' };
    };

    const handleNewUserCreation = async (delegate: DelegateData): Promise<ProcessResult> => {
        // Generate username based on name
        const username = generateUsername(delegate.name);
        console.log('Creating new user:', delegate.name, 'with username:', username);
        
        // Create stub user with status "invited"
        // Create delegate row
        // Send magic link for activation
        
        return { status: 'created' };
    };

    const generateUsername = (fullName: string): string => {
        // Implement username generation logic from the document
        const normalized = fullName.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '');
        const parts = normalized.split(' ');
        
        let base = parts[0];
        if (base.length < 4 && parts.length > 1) {
            base += parts[1].substring(0, 4 - base.length);
        }
        
        if (base.length < 4) {
            base += 'abcdefghijklmnopqrstuvwxyz'.substring(0, 4 - base.length);
        }
        
        // Add 4 random digits
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return base.substring(0, 4) + randomDigits;
    };

    return (
        <PageLoader loadingText="Loading Upload Delegates...">
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <Header maxWidth="max-w-[88rem]" />

                {/* Main Content */}
                <div className="max-w-[85rem] mx-auto px-6 py-8" style={{ paddingLeft: '10.5rem' }}>
                    {/* Breadcrumb Navigation */}
                    <div className="flex items-center space-x-2 text-sm text-[#C2A46D] mb-6">
                        <span className='text-2xl font-medium text-[#C2A46D]'>Organiser</span>
                        <span className='text-2xl font-medium text-[#C2A46D]'>&gt;</span>
                        <span className='text-2xl font-medium text-[#C2A46D]'>Delegates</span>
                        <span className='text-2xl font-medium text-[#C2A46D]'>&gt;</span>
                        <span className='text-2xl font-medium text-[#C2A46D]'>Key Info</span>
                        <span className='text-2xl font-medium text-[#C2A46D]'>&gt;</span>
                        <span className="text-2xl font-medium text-[#C2A46D]">Upload Delegates</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Upload Delegates</h1>

                    {/* Upload Buttons */}
                    <div className="flex items-center space-x-4 mb-8">
                        <button
                            onClick={handleUploadGoogleSheets}
                            disabled={isUploading}
                            className="bg-[#C2A46D] w-[170px] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div> 
                                <div>Upload</div>
                                <div>Google Sheets</div>
                            </div>
                        </button>
                        <button
                            onClick={handleUploadGoogleForm}
                            disabled={isUploading}
                            className="bg-[#C2A46D] w-[170px] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        > 
                            <div> 
                                <div>Upload</div>
                                <div>Google Form</div>
                            </div>
                        </button>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C2A46D] mr-3"></div>
                                <span className="text-gray-700">Processing delegate upload...</span>
                            </div>
                        </div>
                    )}

                    {/* Upload Results */}
                    {uploadResult && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Results</h2>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{uploadResult.linked}</div>
                                    <div className="text-sm text-green-700">Linked to Existing</div>
                                </div>
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{uploadResult.created}</div>
                                    <div className="text-sm text-blue-700">New Users Created</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-2xl font-bold text-yellow-600">{uploadResult.needsReview}</div>
                                    <div className="text-sm text-yellow-700">Needs Review</div>
                                </div>
                            </div>
                            
                            {uploadResult.errors.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-red-600 mb-2">Errors:</h3>
                                    <ul className="list-disc list-inside text-sm text-red-600">
                                        {uploadResult.errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {/* File Input (Hidden) */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                </div>
            </div>
        </PageLoader>
    );
};

export default DelegatesUploadPage;

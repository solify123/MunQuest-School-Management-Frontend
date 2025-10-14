import React from 'react';
import { toast } from 'sonner';
import { Header } from '../ui';
import PageLoader from '../PageLoader';

const DelegatesUploadPage: React.FC = () => {

    const handleUploadGoogleSheets = () => {
        toast.success('Upload Google Sheets feature coming soon');
    };

    const handleUploadGoogleForm = () => {
        toast.success('Upload Google Form feature coming soon');
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
                        <span>Organiser</span>
                        <span>&gt;</span>
                        <span>Delegates</span>
                        <span>&gt;</span>
                        <span>Key Info</span>
                        <span>&gt;</span>
                        <span className="text-[#C2A46D] font-medium">Upload Delegates</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-8">Upload Delegates</h1>

                    {/* Upload Buttons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleUploadGoogleSheets}
                            className="bg-[#C2A46D] w-[170px] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
                        >
                            <div> 
                                <div>Upload</div>
                                <div>Google Sheets</div>
                            </div>
                        </button>
                        <button
                            onClick={handleUploadGoogleForm}
                            className="bg-[#C2A46D] w-[170px] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
                        > 
                            <div> 
                                <div>Upload</div>
                                <div>Google Form</div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </PageLoader>
    );
};

export default DelegatesUploadPage;

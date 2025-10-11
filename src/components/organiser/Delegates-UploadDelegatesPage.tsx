import React from 'react';
import { toast } from 'sonner';

const DelegatesUploadPage: React.FC = () => {

    const handleUploadGoogleSheets = () => {
        toast.success('Upload Google Sheets feature coming soon');
    };

    const handleUploadGoogleForm = () => {
        toast.success('Upload Google Form feature coming soon');
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm text-[#C2A46D]">
                <span>Organiser</span>
                <span>&gt;</span>
                <span>Delegates</span>
                <span>&gt;</span>
                <span>Key Info</span>
                <span>&gt;</span>
                <span className="text-[#C2A46D] font-medium">Upload Delegates</span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl font-bold text-gray-900">Upload Delegates</h1>

            {/* Upload Buttons */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={handleUploadGoogleSheets}
                    className="bg-[#C2A46D] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
                >
                    Upload Google Sheets
                </button>
                <button
                    onClick={handleUploadGoogleForm}
                    className="bg-[#C2A46D] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-colors duration-200 font-medium"
                >
                    Upload Google Form
                </button>
            </div>
		</div>
	);
};

export default DelegatesUploadPage;

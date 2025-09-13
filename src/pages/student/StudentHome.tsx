import React from 'react';
import { Logo } from '../../components/ui';

const StudentHome: React.FC = () => {
    return <div className="min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
        {/* Header */}
        <div className="shadow-sm">
            <div className="max-w-4xl px-6 py-4">
                <Logo size="medium" />
            </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center flex-1" style={{ height: '80vh' }}>
            <div className="text-center">
                {/* Success Message */}
                <h1 className="text-black text-center text-4xl font-medium leading-[150%] mb-8">
                    Your Student Profile is created.
                </h1>
                {/* Navigation Buttons */}
                <div className="flex gap-4 justify-center">
                    {/* Home Button */}
                    <button
                        onClick={() => {
                            // Navigate to home page
                            console.log('Navigate to home');
                        }}
                        className="flex items-center px-6 py-3 rounded-lg font-medium transition-all"
                        style={{
                            backgroundColor: '#C2A46D',
                            color: '#8B6F47'
                        }}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </button>

                    {/* Profile Button */}
                    <button
                        onClick={() => {
                            // Navigate to profile page
                            console.log('Navigate to profile');
                        }}
                        className="flex items-center px-6 py-3 rounded-lg font-medium transition-all"
                        style={{
                            backgroundColor: '#C2A46D',
                            color: '#8B6F47'
                        }}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                    </button>
                </div>
            </div>
        </div>
    </div>
};

export default StudentHome;
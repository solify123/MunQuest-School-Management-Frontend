import React, { useState } from 'react';
import { updateOrganiserStatusApi, deleteOrganiserApi } from '../../apis/Organisers';
import { toast } from 'sonner';
import { useApp } from '../../contexts/AppContext';

interface Student {
  id: string;
  student_id: string;
  username: string;
  name: string;
  academic_level: string;
  school: string;
  role_in_event: string;
  evidence: string;
  date_received: string;
  date_actioned: string;
  status: string;
}

interface OrganisersTableProps {
  organisers: Student[];
  onAction: (action: string, studentId: string) => void;
}

const OrganisersTable: React.FC<OrganisersTableProps> = ({ organisers, onAction }) => {

  console.log(organisers, "==========");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);
  const { refreshUserData } = useApp();

  const handleDropdownToggle = (studentId: string) => {
    setActiveDropdown(activeDropdown === studentId ? null : studentId);
  };

  const handleAction = async (action: string, studentId: string) => {
    setUpdatingStudentId(studentId);
    try {
      if (action === 'delete') {
        const response = await deleteOrganiserApi(studentId);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await updateOrganiserStatusApi(studentId, action);
        if (response.success) {
          toast.success(response.message);
          await refreshUserData();
        } else {
          toast.error(response.message);
        }
      }
      onAction(action, studentId);
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Failed to update student status');
    } finally {
      setUpdatingStudentId(null);
    }
    setActiveDropdown(null);
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-gray-600';

    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-orange-500';
      case 'rejected':
        return 'text-red-600';
      case 'flagged':
        return 'text-yellow-500';
      case 'blocked':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div>
      {/* Header Row */}
      <div className="grid grid-cols-11 gap-2 mb-2">
        {['Student ID', 'Username', 'Name', 'Academic Level', 'School', 'Role in Event', 'Evidence', 'Date Received', 'Date Actioned', 'Status', ' '].map((header, index) => (
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
              <span>{header}</span>
              {index < 4 && (
                <svg className="w-3 h-3 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
          )
        )
        )}

      </div>

      {/* Data Rows */}
      {organisers.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No students found
        </div>
      ) : (
        organisers.map((student: any) => (
          <div key={student?.id || Math.random()} className="grid grid-cols-11 gap-2 mb-2">
            {/* Student ID */}
            <div className="bg-white px-3 py-2 text-sm font-medium text-gray-900 rounded-md border border-gray-200">
              {student?.users.id || 'N/A'}
            </div>

            {/* Username */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.users.username || 'N/A'}
            </div>

            {/* Name */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.users.fullname || 'N/A'}
            </div>

            {/* Academic Level */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.users.academic_level || 'N/A'}
            </div>

            {/* School */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.school || 'N/A'}
            </div>

            {/* Role in Event */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.role || 'N/A'}
            </div>

            {/* Evidence */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.evidence ? (
                <div className="flex items-center justify-center">
                  <button
                    onClick={() => window.open(student.evidence, '_blank')}
                    className="flex items-center justify-center p-1 rounded hover:bg-gray-100 transition-colors duration-200"
                    title="Click to open document"
                  >Document
                    <svg className="w-5 h-5 text-blue-600 hover:text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
              ) : (
                'N/A'
              )}
            </div>

            {/* Date Received */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.created_at.split('T')[0] || 'N/A'}
            </div>

            {/* Date Actioned */}
            <div className="bg-white px-3 py-2 text-sm text-gray-900 rounded-md border border-gray-200">
              {student?.updated_at || 'N/A'}
            </div>

            {/* Status */}
            <div className="bg-white px-3 py-2 text-sm rounded-md border border-gray-200">
              {updatingStudentId === student?.users.id ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                  <span className="text-gray-500">Updating...</span>
                </div>
              ) : (
                <span className={`font-medium ${getStatusColor(student?.users.status)}`}>
                  {student?.status || 'N/A'}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="px-3 py-2 text-sm font-medium relative">
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle(student?.users.id || '')}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                {activeDropdown === student?.users.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      {/* Show Approve button only if status is not approved */}
                      {student?.users.status?.toLowerCase() !== 'approved' && (
                        <button
                          onClick={() => handleAction('approved', student?.id || '')}
                          disabled={updatingStudentId === student?.users.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingStudentId === student?.users.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                            }`}
                        >
                          Approve
                        </button>
                      )}

                      {/* Show Reject button only if status is not rejected */}
                      {student?.status?.toLowerCase() !== 'rejected' && (
                        <button
                          onClick={() => handleAction('rejected', student?.id || '')}
                          disabled={updatingStudentId === student?.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingStudentId === student?.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                            }`}
                        >
                          Reject
                        </button>
                      )}

                      {/* Show Flag button only if status is not flagged */}
                      {student?.status?.toLowerCase() !== 'flagged' && (
                        <button
                          onClick={() => handleAction('flagged', student?.id || '')}
                          disabled={updatingStudentId === student?.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingStudentId === student?.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                            }`}
                        >
                          Flag
                        </button>
                      )}

                      {/* Show Block button only if status is not blocked */}
                      {student?.status?.toLowerCase() !== 'blocked' && (
                        <button
                          onClick={() => handleAction('blocked', student?.id || '')}
                          disabled={updatingStudentId === student?.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingStudentId === student?.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                            }`}
                        >
                          Block
                        </button>
                      )}

                      {/* Show Activate button if status is flagged or blocked */}
                      {(student?.status?.toLowerCase() === 'flagged' || student?.status?.toLowerCase() === 'blocked') && (
                        <button
                          onClick={() => handleAction('approved', student?.id || '')}
                          disabled={updatingStudentId === student?.id}
                          className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingStudentId === student?.id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
                            }`}
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => handleAction('delete', student?.id || '')}
                        disabled={updatingStudentId === student?.id}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${updatingStudentId === student?.id
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-700 hover:bg-[#D9C7A1] hover:text-gray-900'
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
        ))
      )}

      {/* Add and Save Buttons */}
      <div className="flex justify-start space-x-4 mt-6">
        <button
          className="bg-[#C2A46D] text-white font-medium rounded-[30px] w-[105px] h-[44px] px-[10px] py-[10px] mr-[10px] opacity-100 transition-colors duration-200 hover:bg-[#9a7849]"
          style={{ top: '1025px', left: '385px', transform: 'rotate(0deg)' }}
        >
          Add
        </button>
        <button
          className="bg-[#C2A46D] text-white font-medium rounded-[30px] w-[105px] h-[44px] px-[10px] py-[10px] opacity-100 transition-colors duration-200 hover:bg-[#b89a6a]"
          style={{ top: '1025px', left: '385px', transform: 'rotate(0deg)' }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default OrganisersTable;

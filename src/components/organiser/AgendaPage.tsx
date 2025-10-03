import React, { useState } from 'react';

interface AgendaItem {
  id: number;
  title: string;
}

interface DocumentItem {
  id: number;
  name: string;
  file?: File;
}

interface AgendaPageProps {
  activeCommitteeType: string;
  activeCommittee: string;
  agendas: AgendaItem[];
  documents: DocumentItem[];
  editingAgenda: number | null;
  editingDocument: number | null;
  tempValue: string;
  isSaving: boolean;
  onCommitteeTypeChange: (type: string) => void;
  onCommitteeChange: (committee: string) => void;
  onAgendaEdit: (agendaId: number, currentValue: string) => void;
  onAgendaChange: (value: string) => void;
  onAgendaSave: () => void;
  onAgendaCancel: () => void;
  onAgendaDelete: (agendaId: number) => void;
  onAddAgenda: () => void;
  onDocumentEdit: (documentId: number, currentValue: string) => void;
  onDocumentChange: (value: string) => void;
  onDocumentSave: () => void;
  onDocumentCancel: () => void;
  onDocumentDelete: (documentId: number) => void;
  onDocumentUpload: (file: File) => void;
}

const AgendaPage: React.FC<AgendaPageProps> = ({
  activeCommitteeType,
  activeCommittee,
  agendas,
  documents,
  editingAgenda,
  editingDocument,
  tempValue,
  isSaving,
  onCommitteeTypeChange,
  onCommitteeChange,
  onAgendaEdit,
  onAgendaChange,
  onAgendaSave,
  onAgendaCancel,
  onAgendaDelete,
  onAddAgenda,
  onDocumentEdit,
  onDocumentChange,
  onDocumentSave,
  onDocumentCancel,
  onDocumentDelete,
  onDocumentUpload
}) => {
  const [showAgendaMenu, setShowAgendaMenu] = useState<number | null>(null);
  const [showDocumentMenu, setShowDocumentMenu] = useState<number | null>(null);

  const committeeTypes = [
    { id: 'country', name: 'Country Committees' },
    { id: 'role', name: 'Role Committees' },
    { id: 'crisis', name: 'Crisis Committees' },
    { id: 'open', name: 'Open Committees' }
  ];

  const committees = [
    { id: 'UNGA', name: 'UNGA' },
    { id: 'UNSC', name: 'UNSC' },
    { id: 'UNHRC', name: 'UNHRC' },
    { id: 'WHO', name: 'WHO' },
    { id: 'UNEP', name: 'UNEP' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onDocumentUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Committee Type Filters */}
      <div className="flex space-x-2">
        {committeeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onCommitteeTypeChange(type.id)}
            className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${
              activeCommitteeType === type.id
                ? 'bg-[#607DA3] text-white'
                : 'bg-white text-black border border-gray-800'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Committee Selection */}
      <div className="flex space-x-2">
        {committees.map((committee) => (
          <button
            key={committee.id}
            onClick={() => onCommitteeChange(committee.id)}
            className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${
              activeCommittee === committee.id
                ? 'bg-[#84B5F3] text-white'
                : 'bg-white text-black border border-gray-800'
            }`}
          >
            {committee.name}
          </button>
        ))}
      </div>

      {/* Committee Agendas Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Committee Agendas</h2>
        
        {/* Existing Agendas */}
        {agendas.map((agenda) => (
          <div key={agenda.id} className="flex items-center space-x-2">
            <div className="flex-1 relative">
              {editingAgenda === agenda.id ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => onAgendaChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                  placeholder="Enter agenda title"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={agenda.title}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              )}
            </div>
            
            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={() => setShowAgendaMenu(showAgendaMenu === agenda.id ? null : agenda.id)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {showAgendaMenu === agenda.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onAgendaEdit(agenda.id, agenda.title);
                        setShowAgendaMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onAgendaDelete(agenda.id);
                        setShowAgendaMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save/Cancel buttons for editing */}
            {editingAgenda === agenda.id && (
              <div className="flex space-x-2">
                <button
                  onClick={onAgendaSave}
                  className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    onAgendaCancel();
                    setShowAgendaMenu(null);
                  }}
                  className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Agenda Button */}
        <button
          onClick={onAddAgenda}
          className={`text-white font-medium transition-colors ${
            isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
          style={{
            width: '140px',
            height: '44px',
            borderRadius: '30px',
            padding: '10px',
            gap: '10px',
            opacity: isSaving ? 0.5 : 1,
            background: isSaving ? '#bdbdbd' : '#C2A46D',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            border: 'none',
            boxShadow: 'none',
          }}
          disabled={isSaving}
        >
          Add Agenda
        </button>
      </div>

      {/* Committee Documents Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Committee Documents</h2>
        
        {/* Existing Documents */}
        {documents.map((document) => (
          <div key={document.id} className="flex items-center space-x-2">
            <div className="flex-1 relative">
              {editingDocument === document.id ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => onDocumentChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                  placeholder="Enter document name"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={document.name}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              )}
            </div>
            
            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={() => setShowDocumentMenu(showDocumentMenu === document.id ? null : document.id)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {showDocumentMenu === document.id && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onDocumentEdit(document.id, document.name);
                        setShowDocumentMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDocumentDelete(document.id);
                        setShowDocumentMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save/Cancel buttons for editing */}
            {editingDocument === document.id && (
              <div className="flex space-x-2">
                <button
                  onClick={onDocumentSave}
                  className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium"
                >
                  ✓
                </button>
                <button
                  onClick={() => {
                    onDocumentCancel();
                    setShowDocumentMenu(null);
                  }}
                  className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Upload Document Button */}
        <div className="flex space-x-2">
          <input
            type="file"
            id="document-upload"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
          />
          <label
            htmlFor="document-upload"
            className={`text-white font-medium transition-colors cursor-pointer ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{
              width: '160px',
              height: '44px',
              borderRadius: '30px',
              padding: '10px',
              gap: '10px',
              opacity: isSaving ? 0.5 : 1,
              background: isSaving ? '#bdbdbd' : '#C2A46D',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Upload Document
          </label>
        </div>
      </div>
    </div>
  );
};

export default AgendaPage;

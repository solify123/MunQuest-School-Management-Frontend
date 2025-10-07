import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAllEventCommitteesApi } from '../../apis/Event_committes';
import { toast } from 'sonner';
import { saveEventCommitteesByEventIdAgendaApi } from '../../apis/agendas';

interface AgendaItem {
  id: number;
  title: string;
}

interface DocumentItem {
  id: number;
  name: string;
  file?: File;
}

const AgendaPage: React.FC = () => {
  const [showAgendaMenu, setShowAgendaMenu] = useState<number | null>(null);
  const [showDocumentMenu, setShowDocumentMenu] = useState<number | null>(null);
  const [allCommitteesData, setAllCommitteesData] = useState<any[]>([]);
  const [filteredCommittees, setFilteredCommittees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [subTabLoading, setSubTabLoading] = useState<boolean>(false);

  // Internal state management for agendas and documents
  const [activeCommitteeType, setActiveCommitteeType] = useState('country');
  const [activeCommittee, setActiveCommittee] = useState('UNGA');
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [editingAgenda, setEditingAgenda] = useState<number | null>(null);
  const [editingDocument, setEditingDocument] = useState<number | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [isSaving] = useState<boolean>(false);

  const { eventId } = useParams();

  const committeeTypes = [
    { id: 'country', name: 'Country Committees' },
    { id: 'role', name: 'Role Committees' },
    { id: 'crisis', name: 'Crisis Committees' },
    { id: 'open', name: 'Open Committees' }
  ];

  // Fetch event committees data
  useEffect(() => {
    const fetchEventCommittees = async () => {
      if (!eventId) return;

      try {
        setIsLoading(true);
        const response = await getAllEventCommitteesApi(eventId);
        const raw = response.data || [];

        const normalized = raw.map((item: any) => {
          const master = item && typeof item.committee === 'object' ? item.committee : null;
          const committeeText = master
            ? (master.committee ?? master.name ?? '')
            : (typeof item.committee === 'string' ? item.committee : '');
          const abbreviation = master ? (master.abbr ?? item.abbr ?? '') : (item.abbr ?? '');
          const masterId = master ? master.id : (item.committee_id ?? item.committeeId ?? undefined);
          const category = master ? master.category : item.category;

          return {
            id: String(item.id),
            committee: committeeText,
            abbr: abbreviation,
            committeeId: masterId,
            seatsTotal: String(item.seats ?? item.seatsTotal ?? ''),
            chairUsername: item.chair_username ?? '',
            chairName: item.chair_name ?? '',
            deputyChair1Username: item.deputy_chair_1_username ?? '',
            deputyChair1Name: item.deputy_chair_1_name ?? '',
            deputyChair2Username: item.deputy_chair_2_username ?? '',
            deputyChair2Name: item.deputy_chair_2_name ?? '',
            category: category || 'country'
          };
        });

        setAllCommitteesData(Array.isArray(normalized) ? normalized : []);
      } catch (error: any) {
        console.error('Error fetching event committees:', error);
        toast.error(error.message || 'Failed to fetch event committees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventCommittees();
  }, [eventId]);

  // Filter committees based on active category
  useEffect(() => {
    const filtered = allCommitteesData.filter(committee =>
      committee.category === activeCommitteeType
    );
    setFilteredCommittees(filtered);
  }, [allCommitteesData, activeCommitteeType]);

  // Get unique committee abbreviations for sub-tabs
  const getCommitteeAbbreviations = () => {
    const abbrs = filteredCommittees.map(committee => committee.abbr).filter(Boolean);
    return [...new Set(abbrs)];
  };

  const handleSubTabChange = async (abbr: string) => {
    setSubTabLoading(true);
    setActiveCommittee(abbr);

    // Add a small delay to show loading state
    setTimeout(() => {
      setSubTabLoading(false);
    }, 300);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDocument = {
        id: Math.max(...documents.map(d => d.id)) + 1,
        name: file.name,
        file: file
      };
      setDocuments([...documents, newDocument]);
      toast.success('Document uploaded successfully');
    }
  };

  // Agenda handlers
  const handleAgendaCommitteeTypeChange = (type: string) => {
    setActiveCommitteeType(type);
  };


  const handleAgendaEdit = (agendaId: number, currentValue: string) => {
    setEditingAgenda(agendaId);
    setTempValue(currentValue);
  };

  const handleAgendaChange = (value: string) => {
    setTempValue(value);
  };

  const handleAgendaSave = async () => {
    if (editingAgenda) {
      try {
        // Find the current committee data
        const currentCommittee = filteredCommittees.find(committee => committee.abbr === activeCommittee);
        const event_committeeId = currentCommittee?.id;
        const agenda_abbr = activeCommittee;
        const agenda_title = tempValue;

        const response = await saveEventCommitteesByEventIdAgendaApi(eventId || '', event_committeeId, agenda_abbr, agenda_title);
        if (response.success) {
          toast.success('Agenda saved successfully');
          setAgendas(prev => prev.map(agenda =>
            agenda.id === editingAgenda
              ? { ...agenda, title: tempValue }
              : agenda
          ));
        } else {
          toast.error(response.message || 'Failed to save agenda');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to save agenda');
      }
    }
    setEditingAgenda(null);
    setTempValue('');
  };

  const handleAgendaCancel = () => {
    // If canceling a new agenda item, remove it from the list
    if (editingAgenda && agendas.find(agenda => agenda.id === editingAgenda)?.title === 'New Agenda Item') {
      setAgendas(prev => prev.filter(agenda => agenda.id !== editingAgenda));
    }
    setEditingAgenda(null);
    setTempValue('');
  };

  const handleAgendaDelete = (agendaId: number) => {
    setAgendas(prev => prev.filter(agenda => agenda.id !== agendaId));
  };

  const handleAddAgenda = () => {
    const newAgenda = {
      id: Math.max(...agendas.map(a => a.id), 0) + 1,
      title: 'New Agenda Item'
    };
    setAgendas([...agendas, newAgenda]);
    setEditingAgenda(newAgenda.id);
    setTempValue('New Agenda Item');
  };
  // Document handlers
  const handleDocumentEdit = (documentId: number, currentValue: string) => {
    setEditingDocument(documentId);
    setTempValue(currentValue);
  };

  const handleDocumentChange = (value: string) => {
    setTempValue(value);
  };

  const handleDocumentSave = () => {
    if (editingDocument) {
      setDocuments(prev => prev.map(document =>
        document.id === editingDocument
          ? { ...document, name: tempValue }
          : document
      ));
    }
    setEditingDocument(null);
    setTempValue('');
  };

  const handleDocumentCancel = () => {
    setEditingDocument(null);
    setTempValue('');
  };

  const handleDocumentDelete = (documentId: number) => {
    setDocuments(prev => prev.filter(document => document.id !== documentId));
  };

  const handleUploadDocument = () => {
    toast.error('Please upload a document');
  };


  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading committee data...</span>
      </div>
    );
  }

  const committeeAbbreviations = getCommitteeAbbreviations();

  return (
    <div className="space-y-6">
      {/* Committee Type Filters */}
      <div className="flex space-x-2">
        {committeeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleAgendaCommitteeTypeChange(type.id)}
            className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${activeCommitteeType === type.id
              ? 'bg-[#607DA3] text-white'
              : 'bg-white text-black border border-gray-800'
              }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {/* Committee Sub-tabs based on abbreviations */}
      {committeeAbbreviations.length > 0 && (
        <div className="flex space-x-2">
          {committeeAbbreviations.map((abbr) => (
            <button
              key={abbr}
              onClick={() => handleSubTabChange(abbr)}
              disabled={subTabLoading}
              className={`w-[160px] h-[58px] px-[5px] py-[5px] text-sm font-medium rounded-[20px] transition-colors duration-200 ${activeCommittee === abbr
                ? 'bg-[#84B5F3] text-white'
                : 'bg-white text-black border border-gray-800'
                } ${subTabLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {abbr}
            </button>
          ))}
        </div>
      )}

      {/* Show message if no committees */}
      {filteredCommittees.length === 0 && !isLoading && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No committees available</h3>
          <p className="text-gray-500 mb-4">No committees found for the selected category.</p>
        </div>
      )}

      {/* Committee Agendas Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Committee Agendas</h2>

        {/* Existing Agendas */}
        {agendas.length === 0 ? (
          <div className="text-red-500 font-medium text-sm">None</div>
        ) : (
          agendas.map((agenda) => (
          <div key={agenda.id} className="flex items-center space-x-2">
            <div className="flex-1">
              {editingAgenda === agenda.id ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => handleAgendaChange(e.target.value)}
                  className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                  placeholder="Enter agenda title"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={agenda.title}
                  readOnly
                  className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              )}
            </div>

            {/* Cancel button for editing - only show for new agenda items */}
            {editingAgenda === agenda.id && agenda.title === 'New Agenda Item' && (
              <button
                onClick={() => {
                  handleAgendaCancel();
                  setShowAgendaMenu(null);
                }}
                className="text-white font-medium transition-colors hover:opacity-90"
                style={{
                  width: '100px',
                  height: '44px',
                  borderRadius: '30px',
                  padding: '10px',
                  gap: '10px',
                  background: '#dc3545',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: 'none',
                }}
              >
                Cancel
              </button>
            )}

            {/* Three-dot menu - hide when editing */}
            {editingAgenda !== agenda.id && (
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
                          handleAgendaEdit(agenda.id, agenda.title);
                          setShowAgendaMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleAgendaDelete(agenda.id);
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
            )}
          </div>
        ))
        )}

        {/* Add Agenda Button and Save Button */}
        <div className="flex space-x-2">
          <button
            onClick={handleAddAgenda}
            className={`text-white font-medium transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
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

          {/* Save Button - only show when there's a new agenda being edited */}
          {editingAgenda && agendas.find(agenda => agenda.id === editingAgenda)?.title === 'New Agenda Item' && (
            <button
              onClick={handleAgendaSave}
              className="text-white font-medium transition-colors hover:opacity-90"
              style={{
                width: '100px',
                height: '44px',
                borderRadius: '30px',
                padding: '10px',
                gap: '10px',
                background: '#28a745',
                cursor: 'pointer',
                border: 'none',
                boxShadow: 'none',
              }}
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Committee Documents Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Committee Documents</h2>

        {/* Existing Documents */}
        {documents.length === 0 ? (
          <div className="text-red-500 font-medium text-sm">None</div>
        ) : (
          documents.map((document) => (
          <div key={document.id} className="flex items-center space-x-2">
            <div className="flex-1">
              {editingDocument === document.id ? (
                <input
                  type="text"
                  value={tempValue}
                  onChange={(e) => handleDocumentChange(e.target.value)}
                  className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                  placeholder="Enter document name"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={document.name}
                  readOnly
                  className="w-[400px] px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              )}
            </div>

            {/* Save/Cancel buttons for editing */}
            {editingDocument === document.id && (
              <div className="flex space-x-2">
                <button
                  onClick={handleDocumentSave}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    handleDocumentCancel();
                    setShowDocumentMenu(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Three-dot menu */}
            {editingDocument !== document.id && (
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
                          handleDocumentEdit(document.id, document.name);
                          setShowDocumentMenu(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDocumentDelete(document.id);
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
            )}
          </div>
        ))
        )}

        {/* Upload Document Button */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Upload a document"
            className="w-[350px] px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
            readOnly
          />
          <label className={`px-4 py-3 rounded-r-lg transition-colors duration-200 ${isSaving
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#C2A46D] text-white cursor-pointer hover:opacity-90'
            }`}
            style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <input
              type="file"
              onChange={handleFileUpload}
              disabled={isSaving}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />
          </label>
        </div>
        <button
          onClick={handleUploadDocument}
          className={`text-white font-medium transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
            }`}
          style={{
            width: 'auto',
            height: '44px',
            borderRadius: '30px',
            paddingLeft: '10px',
            paddingRight: '10px',
            gap: '10px',
            opacity: isSaving ? 0.5 : 1,
            background: isSaving ? '#bdbdbd' : '#C2A46D',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            border: 'none',
            boxShadow: 'none',
          }}
          disabled={isSaving}
        >
          Upload Document
        </button>
      </div>
    </div>
  );
};

export default AgendaPage;

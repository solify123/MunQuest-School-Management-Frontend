import React from 'react';

interface Committee {
  id: number;
  abbr: string;
  committee: string;
  seatsTotal: string;
  chairUsername: string;
  chairName: string;
  deputyChair1Username: string;
  deputyChair1Name: string;
  deputyChair2Username: string;
  deputyChair2Name: string;
}

interface CommitteesPageProps {
  activeCommitteeType: string;
  committees: Committee[];
  editingCommittee: number | null;
  editingCommitteeField: string | null;
  tempValue: string;
  isSaving: boolean;
  onCommitteeTypeChange: (type: string) => void;
  onCommitteeFieldEdit: (committeeId: number, fieldType: string, currentValue: string) => void;
  onCommitteeFieldChange: (value: string) => void;
  onCommitteeFieldSave: () => void;
  onCommitteeFieldCancel: () => void;
  onAddCommittee: () => void;
  onSaveCommittees: () => void;
}

const CommitteesPage: React.FC<CommitteesPageProps> = ({
  activeCommitteeType,
  committees,
  editingCommittee,
  editingCommitteeField,
  tempValue,
  isSaving,
  onCommitteeTypeChange,
  onCommitteeFieldEdit,
  onCommitteeFieldChange,
  onCommitteeFieldSave,
  onCommitteeFieldCancel,
  onAddCommittee,
  onSaveCommittees
}) => {
  const committeeTypes = [
    { id: 'country', name: 'Country Committees' },
    { id: 'role', name: 'Role Committees' },
    { id: 'crisis', name: 'Crisis Committees' },
    { id: 'open', name: 'Open Committees' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-2">
        {committeeTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onCommitteeTypeChange(type.id)}
            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeCommitteeType === type.id
                ? 'bg-[#6A8BAF] text-white'
                : 'bg-white text-black border border-gray-800'
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      <div>
        <div className="grid grid-cols-[80px_200px_100px_120px_120px_120px_120px_120px_120px] gap-4">
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">ABBR</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Committee</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Seats Total</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Chair Username</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Chair Name</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 1 Username</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 1 Name</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 2 Username</div>
          <div className="bg-[#C6DAF4] text-grey-800 px-4 py-3 rounded-lg text-sm font-medium text-center border border-gray-800">Deputy Chair 2 Name</div>
          
          {committees.map((committee) => (
            <React.Fragment key={committee.id}>
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-900">{committee.abbr}</span>
              </div>
              
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'committee' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => onCommitteeFieldChange(e.target.value)}
                        className="w-full pl-10 pr-8 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                        placeholder="E.g. United Nations Security Council"
                        autoFocus
                      />
                      <button
                        onClick={() => onCommitteeFieldChange('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'committee', committee.committee)}
                  >
                    {committee.committee || 'E.g. United Nations Security Council'}
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'seatsTotal' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="30"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'seatsTotal', committee.seatsTotal)}
                  >
                    {committee.seatsTotal}
                  </div>
                )}
              </div>
              
              {/* Chair Username */}
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'chairUsername' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="@username"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'chairUsername', committee.chairUsername)}
                  >
                    {committee.chairUsername || '-'}
                  </div>
                )}
              </div>
              
              {/* Chair Name */}
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'chairName' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="Full Name"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'chairName', committee.chairName)}
                  >
                    {committee.chairName || '-'}
                  </div>
                )}
              </div>
              
              {/* Deputy Chair 1 Username */}
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'deputyChair1Username' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="@username"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'deputyChair1Username', committee.deputyChair1Username)}
                  >
                    {committee.deputyChair1Username || '-'}
                  </div>
                )}
              </div>
              
              {/* Deputy Chair 1 Name */}
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'deputyChair1Name' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="Full Name"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'deputyChair1Name', committee.deputyChair1Name)}
                  >
                    {committee.deputyChair1Name || '-'}
                  </div>
                )}
              </div>
              
              {/* Deputy Chair 2 Username */}
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'deputyChair2Username' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="@username"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'deputyChair2Username', committee.deputyChair2Username)}
                  >
                    {committee.deputyChair2Username || '-'}
                  </div>
                )}
              </div>
              
              {/* Deputy Chair 2 Name */}
              <div className="bg-gray-50 border border-gray-800 rounded-lg px-4 py-3 flex items-center">
                {editingCommittee === committee.id && editingCommitteeField === 'deputyChair2Name' ? (
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="text"
                      value={tempValue}
                      onChange={(e) => onCommitteeFieldChange(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1E395D] focus:border-transparent"
                      placeholder="Full Name"
                      autoFocus
                    />
                    <button
                      onClick={onCommitteeFieldSave}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      ✓
                    </button>
                    <button
                      onClick={onCommitteeFieldCancel}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div
                    className="text-sm text-gray-900 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded w-full"
                    onClick={() => onCommitteeFieldEdit(committee.id, 'deputyChair2Name', committee.deputyChair2Name)}
                  >
                    {committee.deputyChair2Name || '-'}
                  </div>
                )}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-[845px] flex justify-between">
        <button
          onClick={onAddCommittee}
          className={`text-white font-medium transition-colors`}
          style={{
            width: '105px',
            height: '44px',
            borderRadius: '30px',
            padding: '10px',
            gap: '10px',
            opacity: 1,
            background: isSaving ? '#bdbdbd' : '#C2A46D',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          Add Committee
        </button>
        <button
          onClick={onSaveCommittees}
          className={`text-white font-medium transition-colors`}
          style={{
            width: '105px',
            height: '44px',
            borderRadius: '30px',
            padding: '10px',
            gap: '10px',
            opacity: 1,
            background: isSaving ? '#bdbdbd' : '#C2A46D',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            border: 'none',
            boxShadow: 'none',
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default CommitteesPage;

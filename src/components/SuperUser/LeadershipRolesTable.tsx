import React, { useState } from 'react';
import { createLeadershipRoleApi, updateLeadershipRoleApi, deleteLeadershipRoleApi } from '../../apis/LeadershipRoles';
import { showToast } from '../../utils/toast';

interface LeadershipRole {
  id: string;
  abbreviation: string;
  title: string;
  created_at?: Date;
  updated_at?: Date;
}

interface LeadershipRolesTableProps {
  leadershipRoles: LeadershipRole[];
  onRefresh: () => void;
}

const LeadershipRolesTable: React.FC<LeadershipRolesTableProps> = ({ leadershipRoles, onRefresh }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({ abbreviation: '', title: '' });
  const [editRole, setEditRole] = useState({ abbreviation: '', title: '' });

  const handleAdd = async () => {
    if (!newRole.abbreviation.trim() || !newRole.title.trim()) {
      showToast.error('Please fill in all fields');
      return;
    }

    try {
      await createLeadershipRoleApi(newRole.abbreviation.trim(), newRole.title.trim());
      showToast.success('Leadership role created successfully');
      setNewRole({ abbreviation: '', title: '' });
      setIsAdding(false);
      onRefresh();
    } catch (error: any) {
      showToast.error(error.message || 'Failed to create leadership role');
    }
  };

  const handleSave = async (roleId: string) => {
    if (!editRole.abbreviation.trim() || !editRole.title.trim()) {
      showToast.error('Please fill in all fields');
      return;
    }

    try {
      await updateLeadershipRoleApi(roleId, editRole.abbreviation.trim(), editRole.title.trim());
      showToast.success('Leadership role updated successfully');
      setEditRole({ abbreviation: '', title: '' });
      setEditingId(null);
      onRefresh();
    } catch (error: any) {
      showToast.error(error.message || 'Failed to update leadership role');
    }
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this leadership role?')) {
      try {
        await deleteLeadershipRoleApi(roleId);
        showToast.success('Leadership role deleted successfully');
        onRefresh();
      } catch (error: any) {
        showToast.error(error.message || 'Failed to delete leadership role');
      }
    }
  };

  const handleEdit = (role: LeadershipRole) => {
    setEditRole({ abbreviation: role.abbreviation, title: role.title });
    setEditingId(role.id);
    setShowContextMenu(null);
  };

  const handleContextMenu = (roleId: string) => {
    setShowContextMenu(showContextMenu === roleId ? null : roleId);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditRole({ abbreviation: '', title: '' });
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewRole({ abbreviation: '', title: '' });
  };

  return (
    <div className="space-y-4">
      {/* Table Header */}
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-1/4 px-4 py-3 bg-[#607DA3] text-white font-semibold text-center">
          ID
        </div>
        <div className="w-1/4 px-4 py-3 bg-[#607DA3] text-white font-semibold text-center">
          ABBR
        </div>
        <div className="w-1/2 px-4 py-3 bg-[#607DA3] text-white font-semibold text-center">
          Leadership Role
        </div>
        <div className="w-16 px-4 py-3 bg-[#607DA3] text-white font-semibold text-center">
          Actions
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {leadershipRoles.map((role) => (
          <div key={role.id} className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-1/4 px-4 py-3 text-gray-900 text-center border-r border-gray-200">
              {role.id}
            </div>
            <div className="w-1/4 px-4 py-3 text-gray-900 text-center border-r border-gray-200">
              {editingId === role.id ? (
                <input
                  type="text"
                  value={editRole.abbreviation}
                  onChange={(e) => setEditRole({ ...editRole, abbreviation: e.target.value })}
                  className="w-full text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Abbreviation"
                />
              ) : (
                role.abbreviation
              )}
            </div>
            <div className="w-1/2 px-4 py-3 text-gray-900 text-center border-r border-gray-200">
              {editingId === role.id ? (
                <input
                  type="text"
                  value={editRole.title}
                  onChange={(e) => setEditRole({ ...editRole, title: e.target.value })}
                  className="w-full text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Leadership Role Title"
                />
              ) : (
                role.title
              )}
            </div>
            <div className="w-16 px-4 py-3 text-center relative">
              {editingId === role.id ? (
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleSave(role.id)}
                    className="text-green-600 hover:text-green-800 text-xs"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleContextMenu(role.id)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ⋮
                </button>
              )}
              
              {/* Context Menu */}
              {showContextMenu === role.id && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
                  <button
                    onClick={() => handleEdit(role)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Role Section */}
      <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="w-1/4 px-4 py-3 text-gray-500 text-center border-r border-gray-200">
          Auto generated
        </div>
        <div className="w-1/4 px-4 py-3 text-center border-r border-gray-200">
          {isAdding ? (
            <input
              type="text"
              value={newRole.abbreviation}
              onChange={(e) => setNewRole({ ...newRole, abbreviation: e.target.value })}
              className="w-full text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add an abbreviation"
            />
          ) : (
            <span className="text-gray-500">Add an abbreviation</span>
          )}
        </div>
        <div className="w-1/2 px-4 py-3 text-center border-r border-gray-200">
          {isAdding ? (
            <input
              type="text"
              value={newRole.title}
              onChange={(e) => setNewRole({ ...newRole, title: e.target.value })}
              className="w-full text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Add a title"
            />
          ) : (
            <span className="text-gray-500">Add a title</span>
          )}
        </div>
        <div className="w-16 px-4 py-3 text-center">
          {isAdding ? (
            <div className="flex space-x-1">
              <button
                onClick={handleAdd}
                className="text-green-600 hover:text-green-800 text-xs"
              >
                ✓
              </button>
              <button
                onClick={cancelAdd}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="text-gray-600 hover:text-gray-800"
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setIsAdding(true)}
          className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
        >
          Add
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#D4AF37] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default LeadershipRolesTable;

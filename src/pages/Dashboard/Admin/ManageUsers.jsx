import React, { useState } from 'react';
import { useAllUsers, useUpdateUserRole, useDeleteUser } from '../../../hooks/useAdminData';
import { FiUser, FiMail, FiDollarSign, FiTrash2, FiEdit, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const { data: users = [], isLoading, error } = useAllUsers();
  const updateUserRole = useUpdateUserRole();
  const deleteUser = useDeleteUser();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleRoleChange = async (email, newRole) => {
    try {
      await updateUserRole.mutateAsync({ email, role: newRole });
      toast.success('User role updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update user role');
    }
  };

  const handleRemoveUser = async (email) => {
    try {
      await deleteUser.mutateAsync(email);
      toast.success('User removed successfully!');
      setConfirmDelete(null);
    } catch (error) {
      toast.error(error.message || 'Failed to remove user');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'buyer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'worker':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'buyer':
        return '🛒';
      case 'worker':
        return '⚡';
      default:
        return '👤';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error.message || 'Error loading users'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
            {/* Statistics */}
            {users.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Users</p>
                <p className="text-3xl font-bold text-slate-800">{users.length}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-full">
                <FiUsers className="h-6 w-6 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Admins</p>
                <p className="text-3xl font-bold text-purple-600">
                  {users.filter(u => u.role === 'admin').length}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <span className="text-2xl">👑</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Buyers</p>
                <p className="text-3xl font-bold text-blue-600">
                  {users.filter(u => u.role === 'buyer').length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <span className="text-2xl">🛒</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Workers</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.role === 'worker').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
        </div>
      )}




      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <FiUsers className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 mb-2">No Users Found</h3>
            <p className="text-slate-500">No users are registered on the platform yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Coins
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.photoURL || user.profilePic ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.photoURL || user.profilePic}
                              alt={user.name}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{user.name}</div>
                          <div className="text-sm text-slate-500">ID: {user._id}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiMail className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-900">{user.email}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getRoleIcon(user.role)}</span>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.email, e.target.value)}
                          disabled={updateUserRole.isPending}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)} focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50`}
                        >
                          <option value="admin">Admin</option>
                          <option value="buyer">Buyer</option>
                          <option value="worker">Worker</option>
                        </select>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FiDollarSign className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-semibold text-green-600">{user.coins}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {confirmDelete === user.email ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRemoveUser(user.email)}
                              disabled={deleteUser.isPending}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                            >
                              {deleteUser.isPending ? 'Deleting...' : 'Confirm'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 text-xs font-medium rounded transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(user.email)}
                            className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded transition-colors"
                          >
                            <FiTrash2 className="h-3 w-3 mr-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


    </div>
  );
};

export default ManageUsers; 
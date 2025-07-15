import React, { useEffect, useState } from 'react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch all users
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // Placeholder: Fetch all users
        // const usersRes = await fetch('http://localhost:5000/users');
        // const usersData = await usersRes.json();
        // setUsers(usersData);
        setUsers([
          {
            _id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            profilePic: 'https://via.placeholder.com/40',
            role: 'buyer',
            coins: 150,
          },
          {
            _id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            profilePic: 'https://via.placeholder.com/40',
            role: 'worker',
            coins: 80,
          },
          {
            _id: '3',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            profilePic: 'https://via.placeholder.com/40',
            role: 'admin',
            coins: 500,
          },
          {
            _id: '4',
            name: 'Bob Wilson',
            email: 'bob@example.com',
            profilePic: 'https://via.placeholder.com/40',
            role: 'worker',
            coins: 120,
          },
          {
            _id: '5',
            name: 'Sarah Davis',
            email: 'sarah@example.com',
            profilePic: 'https://via.placeholder.com/40',
            role: 'buyer',
            coins: 200,
          },
        ]);
      } catch {
        setUsers([]);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRemoveUser = async (userEmail) => {
    setSuccess('');
    setError('');
    try {
      // Placeholder: Delete user from server
      // await fetch(`http://localhost:5000/users/${encodeURIComponent(userEmail)}`, { method: 'DELETE' })
      setUsers(users => users.filter(u => u.email !== userEmail));
      setSuccess('User removed successfully.');
    } catch {
      setError('Failed to remove user.');
    }
  };

  const handleRoleChange = async (userEmail, newRole) => {
    setSuccess('');
    setError('');
    try {
      // Placeholder: Update user role on server
      // await fetch(`http://localhost:5000/users/${encodeURIComponent(userEmail)}/role`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ role: newRole })
      // })
      setUsers(users => users.map(u => u.email === userEmail ? { ...u, role: newRole } : u));
      setSuccess('User role updated successfully.');
    } catch {
      setError('Failed to update user role.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Manage Users</h1>
      {error && <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">{error}</div>}
      {success && <div className="mb-4 text-green-600 text-sm text-center bg-green-50 p-3 rounded-md">{success}</div>}
      
      {users.length === 0 ? (
        <div className="text-center text-slate-500 py-12">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Display Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Coins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {users.map(user => (
                <tr key={user._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.email, e.target.value)}
                      className="border border-slate-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="buyer">Buyer</option>
                      <option value="worker">Worker</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-700">{user.coins}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold shadow-sm transition-colors"
                      onClick={() => handleRemoveUser(user.email)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers; 
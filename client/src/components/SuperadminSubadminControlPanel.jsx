import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [editModeAdminId, setEditModeAdminId] = useState(null); // Track admin id in edit mode
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/sub-admins');
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins', error);
      toast.error('Error fetching admins');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/admin/delete/${id}`);
      setAdmins(admins.filter(admin => admin._id !== id));
      toast.success('Admin deleted successfully');
    } catch (error) {
      console.error('Error deleting admin', error);
      toast.error('Error deleting admin');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/user/admin/update/${id}`, {
        username: updatedUsername,
        email: updatedEmail,
      });
      setAdmins(admins.map(admin => (admin._id === id ? response.data : admin)));
      toast.success('Admin updated successfully');
      exitEditMode(); // Exit edit mode after successful update
    } catch (error) {
      console.error('Error updating admin', error);
      toast.error('Error updating admin');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/superadmin/create-subadmin', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
      });
      setAdmins([...admins, response.data]);
      toast.success('Admin created successfully');
      closeCreateModal();
      fetchAdmins(); // Fetch updated list of admins after creating a new one
    } catch (error) {
      console.error('Error creating admin', error);
      toast.error('Error creating admin');
    }
  };

  const enterEditMode = (id, currentUsername, currentEmail) => {
    setEditModeAdminId(id);
    setUpdatedUsername(currentUsername);
    setUpdatedEmail(currentEmail);
  };

  const exitEditMode = () => {
    setEditModeAdminId(null);
    setUpdatedUsername('');
    setUpdatedEmail('');
  };

  const openCreateModal = () => {
    setIsCreating(true);
  };

  const closeCreateModal = () => {
    setIsCreating(false);
    setNewUsername('');
    setNewEmail('');
    setNewPassword('');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sub-Admin Control Panel</h1>

      {/* Create New Admin Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Subadmin</h2>
            <div className="mb-4">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Username"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Password"
              />
            </div>
            <div className="flex justify-end flex-wrap">
              <button
                onClick={handleCreate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                onClick={closeCreateModal}
                className="bg-gray-500 text-white px-4 py-2 rounded ml-2 hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex mb-4">
        <button
          onClick={openCreateModal}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
        >
          Create New Subadmin
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="text-left p-4">Username</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Profile Picture</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  {editModeAdminId === admin._id ? (
                    <input
                      type="text"
                      value={updatedUsername}
                      onChange={(e) => setUpdatedUsername(e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                      placeholder="New Username"
                    />
                  ) : (
                    admin.username
                  )}
                </td>
                <td className="p-4">
                  {editModeAdminId === admin._id ? (
                    <input
                      type="email"
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                      placeholder="New Email"
                    />
                  ) : (
                    admin.email
                  )}
                </td>
                <td className="p-4">
                  <img src={admin.profilePicture} alt={admin.username} className="w-12 h-12 rounded-full object-cover" />
                </td>
                <td className="p-4 flex flex-wrap gap-5">
                  {editModeAdminId === admin._id ? (
                    <div className="flex items-center space-x-2 ">
                      <button
                        onClick={() => handleUpdate(admin._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={exitEditMode}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => enterEditMode(admin._id, admin.username, admin.email)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
const SuperAdminSellerPanel = () => {
  const [sellers, setSellers] = useState([]);
  const [editModeSellerId, setEditModeSellerId] = useState(null); // Track seller id in edit mode
  const [updatedUsername, setUpdatedUsername] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/get-sellers');
      setSellers(response.data);
    } catch (error) {
      console.error('Error fetching sellers', error);
      toast.error('Error fetching sellers');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/seller/delete/${id}`);
      setSellers(sellers.filter(seller => seller._id !== id));
      toast.success('Seller deleted successfully');
    } catch (error) {
      console.error('Error deleting seller', error);
      toast.error('Error deleting seller');
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/user/seller/update/${id}`, {
        username: updatedUsername,
        email: updatedEmail,
      });
      setSellers(sellers.map(seller => (seller._id === id ? response.data : seller)));
      toast.success('Seller updated successfully');
      exitEditMode(); // Exit edit mode after successful update
    } catch (error) {
      console.error('Error updating seller', error);
      toast.error('Error updating seller');
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/superadmin/create-seller', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
      });
      setSellers([...sellers, response.data]);
      toast.success('Seller created successfully');
      closeCreateModal();
      fetchSellers(); // Fetch updated list of sellers after creating a new one
    } catch (error) {
      console.error('Error creating seller', error);
      toast.error('Error creating seller');
    }
  };

  const enterEditMode = (id, currentUsername, currentEmail) => {
    setEditModeSellerId(id);
    setUpdatedUsername(currentUsername);
    setUpdatedEmail(currentEmail);
  };

  const exitEditMode = () => {
    setEditModeSellerId(null);
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
      <h1 className="text-2xl font-bold mb-4">Seller Control Panel</h1>

      {/* Create New Seller Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white w-full max-w-md p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Create New Seller</h2>
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
          Create New Seller
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
            {sellers.map(seller => (
              <tr key={seller._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4">
                  {editModeSellerId === seller._id ? (
                    <input
                      type="text"
                      value={updatedUsername}
                      onChange={(e) => setUpdatedUsername(e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                      placeholder="New Username"
                    />
                  ) : (
                    seller.username
                  )}
                </td>
                <td className="p-4">
                  {editModeSellerId === seller._id ? (
                    <input
                      type="email"
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="border border-gray-300 p-1 rounded"
                      placeholder="New Email"
                    />
                  ) : (
                    seller.email
                  )}
                </td>
                <td className="p-4">
                  <img src={seller.profilePicture} alt={seller.username} className="w-12 h-12 rounded-full object-cover" />
                </td>
                <td className="p-4 flex flex-wrap gap-5">
                  {editModeSellerId === seller._id ? (
                    <div className="flex items-center space-x-2 ">
                      <button
                        onClick={() => handleUpdate(seller._id)}
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
                      onClick={() => enterEditMode(seller._id, seller.username, seller.email)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(seller._id)}
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
}

export default SuperAdminSellerPanel
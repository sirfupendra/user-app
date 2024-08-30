import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState('');

  // Fetch users from the backend
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('jwt_token'); // Retrieve token
      const response = await axios.get('http://localhost:5000/users', {
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in headers
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      alert('Failed to fetch users. Please check your token or authentication.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle editing a user
  const handleEdit = (user) => {
    if (user && user.id) {
      setSelectedUser(user);
      setEditName(user.name);
    } else {
      console.error('User object is invalid or missing id:', user);
      alert('User object is invalid or missing ID.');
    }
  };

  // Handle saving the edited user
  const handleSave = async () => {
    if (!selectedUser || !selectedUser.id) {
      console.error('No user selected for editing.');
      alert('No user selected for editing.');
      return;
    }

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.put(`http://localhost:5000/users/${selectedUser.id}`, 
        { name: editName },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      fetchUsers(); // Refresh user list after successful save
      setSelectedUser(null);
      setEditName('');
    } catch (error) {
      console.error('Error updating user:', error.response?.data || error.message);
      alert('Failed to update user.');
    }
  };

  // Handle deleting a user
  const handleDelete = async (userId) => {
    if (!userId) {
      console.error('No user ID provided for deletion.');
      alert('No user selected for deletion.');
      return;
    }

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.delete(`http://localhost:5000/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchUsers(); // Refresh user list after deletion
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      alert('Failed to delete user.');
    }
  };

  // Handle blocking a user
  const handleBlock = async (userId) => {
    if (!userId) {
      console.error('No user ID provided for blocking.');
      alert('No user selected for blocking.');
      return;
    }

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.post(`http://localhost:5000/users/${userId}/block`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchUsers(); // Refresh user list after blocking
    } catch (error) {
      console.error('Error blocking user:', error.response?.data || error.message);
      alert('Failed to block user.');
    }
  };

  // Handle unblocking a user
  const handleUnblock = async (userId) => {
    if (!userId) {
      console.error('No user ID provided for unblocking.');
      alert('No user selected for unblocking.');
      return;
    }

    const token = localStorage.getItem('jwt_token');
    try {
      await axios.post(`http://localhost:5000/users/${userId}/unblock`, null, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      fetchUsers(); // Refresh user list after unblocking
    } catch (error) {
      console.error('Error unblocking user:', error.response?.data || error.message);
      alert('Failed to unblock user.');
    }
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.is_blocked ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
                {user.is_blocked ? (
                  <button onClick={() => handleUnblock(user.id)}>Unblock</button>
                ) : (
                  <button onClick={() => handleBlock(user.id)}>Block</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div>
          <h2>Edit User</h2>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setSelectedUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Admin;

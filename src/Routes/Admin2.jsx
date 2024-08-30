import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Admin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get('http://localhost:5000/users') // Your endpoint to fetch users
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
  };

  const handleSave = () => {
    axios.put(`http://localhost:5000/users/${selectedUser._id}`, { name: editName }) // Your endpoint to update user
      .then((response) => {
        fetchUsers(); // Refresh user list
        setSelectedUser(null);
        setEditName('');
      })
      .catch((error) => {
        console.error('Error updating user:', error);
      });
  };

  const handleDelete = (userId) => {
    axios.delete(`http://localhost:5000/users/${userId}`) // Your endpoint to delete user
      .then((response) => {
        fetchUsers(); // Refresh user list
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
      });
  };

  const handleBlock = (userId) => {
    axios.post(`http://localhost:5000/users/${userId}/block`) // Your endpoint to block user
      .then((response) => {
        fetchUsers(); // Refresh user list
      })
      .catch((error) => {
        console.error('Error blocking user:', error);
      });
  };

  const handleUnblock = (userId) => {
    axios.post(`http://localhost:5000/users/${userId}/unblock`) // Your endpoint to unblock user
      .then((response) => {
        fetchUsers(); // Refresh user list
      })
      .catch((error) => {
        console.error('Error unblocking user:', error);
      });
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
                {user.isBlocked ? (
                  <button onClick={() => handleUnblock(user._id)}>Unblock</button>
                ) : (
                  <button onClick={() => handleBlock(user._id)}>Block</button>
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

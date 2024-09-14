import React from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import LOGOUT_USER from '../mutations/LogoutMutation';

const Logout = () => {
  const navigate = useNavigate();
  const [logoutUser] = useMutation(LOGOUT_USER);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.data.logoutUser.success) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        console.error('Logout failed:', response.data.logoutUser.message);
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <button onClick={handleLogout}>Log out
  </button>
  );
};

export default Logout;

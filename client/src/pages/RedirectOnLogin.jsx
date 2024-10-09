import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Assuming you're using Redux for state management

const RedirectOnLogin = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user); // Adjust based on your Redux state structure

  useEffect(() => {
    if (user?.role === 'superadmin') {
      navigate('/superadmin');
    }
  }, [user, navigate]);

  return <>{children}</>;
};

export default RedirectOnLogin;

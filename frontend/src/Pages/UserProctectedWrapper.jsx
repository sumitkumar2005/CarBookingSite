import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom'; // Ensure Navigate is imported
import { UserDataContext } from '../Context/UserContext';

function UserProtectedWrapper({ children }) {
  const { userData } = useContext(UserDataContext);

  // // If the user is not logged in, redirect to the login page
  // if (!userData?.email) {
  //   return <Navigate to="/login" />;
  // }

  // If the user is logged in, render the children components
  return <>{children}</>;
}

export default UserProtectedWrapper;

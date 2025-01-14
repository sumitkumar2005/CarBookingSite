import React, { createContext, useState } from "react";

// Create a context
export const UserDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState({
    email: '',
    fullname: {
      firstname: '',
      lastname: ''
    }
  });

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}

export default UserContext;

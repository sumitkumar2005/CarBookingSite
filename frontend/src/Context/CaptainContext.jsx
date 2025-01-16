import React, { createContext, useState } from "react";

// Create a context for Captain
export const CaptainDataContext = createContext();

function CaptainContext({ children }) {
  const [captainData, setCaptainData] = useState({
    email: '',
    fullname: {
      firstname: '',
      lastname: ''
    },
    password: '',
    vehicle: {
      color: '',
      plate: '',
      capacity: 0,
      vehicleType: ''
    }
  });

  return (
    <CaptainDataContext.Provider value={{ captainData, setCaptainData }}>
      {children}
    </CaptainDataContext.Provider>
  );
}

export default CaptainContext;

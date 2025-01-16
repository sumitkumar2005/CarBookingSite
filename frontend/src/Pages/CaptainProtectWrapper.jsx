import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../Context/CaptainContext';

function CaptainProtectWrapper({ children }) {
  const { captainData } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if captain is logged in
    if (!captainData) {
      navigate('/CaptainLogin'); // Redirect to login if not authenticated
    }
  }, [captainData, navigate]);

  return <>{children}</>;
}

export default CaptainProtectWrapper;

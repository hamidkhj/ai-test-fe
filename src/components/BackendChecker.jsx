import React, { useState, useEffect } from 'react';
import axios from '../Axios/axios.js'; 

const BackendChecker = ({ children }) => {
  const [backendUp, setBackendUp] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Warming up the server... Please wait.");

  useEffect(() => {
    let intervalId;

    const checkBackendStatus = async () => {
      try {

        const response = await axios.get('/healthcheck');
        if (response.status === 200) {
          console.log("Backend is up!");
          setBackendUp(true);
          clearInterval(intervalId); 
        } else {
          console.log("Backend not yet up. Status:", response.status);
          setLoadingMessage("Server waking up... Still checking.");
        }
      } catch (error) {
        console.error("Error checking backend status:", error.message);
        setLoadingMessage("Server might be sleeping... Retrying.");
      }
    };


    checkBackendStatus();


    intervalId = setInterval(checkBackendStatus, 15000);


    return () => clearInterval(intervalId);
  }, []); 

  if (!backendUp) {
    return (
      <div className="flex items-center justify-center min-h-screen text-2xl text-gray-700 text-center p-4">
        {loadingMessage}
      </div>
    );
  }

  return <>{children}</>;
};

export default BackendChecker;
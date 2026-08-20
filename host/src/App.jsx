import React, { Suspense, useEffect, useState } from 'react';
import './App.css';

const RemoteButton = React.lazy(() => {
  console.log('Attempting to load remote button...');
  return import('remote').catch(error => {
    console.error('Failed to load remote button:', error);
    throw error;
  });
});

function App() {
  const [remoteError, setRemoteError] = useState(null);

  useEffect(() => {
    // Check if remote is available
    const checkRemote = async () => {
      try {
        // Try to access the remote entry
        const remoteEntry = await import('remote');
        console.log('Remote entry loaded successfully:', remoteEntry);
      } catch (error) {
        console.error('Remote entry check failed:', error);
        setRemoteError(error.message);
      }
    };

    checkRemote();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Host Application 🌐</h1>
        <p>This application is consuming a component from the remote microfrontend.</p>
        <hr style={{ width: '50%' }} />

        {remoteError ? (
          <div style={{ color: 'red', padding: '20px' }}>
            <h3>Remote Loading Error:</h3>
            <p>{remoteError}</p>
            <p>Make sure the remote application is running on port 5001</p>
          </div>
        ) : (
          <Suspense fallback={<div>Loading button...</div>}>
            <RemoteButton />
          </Suspense>
        )}
      </header>
    </div>
  );
}

export default App;
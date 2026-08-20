import React, { Suspense, useEffect, useState } from 'react';
import './App.css';

const RemoteHeader = React.lazy(() => {
  console.log('Attempting to load remote header...');
  return import('mfe1/Header').catch(error => {
    console.error('Failed to load remote header:', error);
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
        const remoteEntry = await import('mfe1/Header');
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
            <p>Make sure the remote application is running on port 5174</p>
          </div>
        ) : (
          <Suspense fallback={<div>Loading header…</div>}>
            <RemoteHeader />
          </Suspense>
        )}
      </header>
    </div>
  );
}

export default App;
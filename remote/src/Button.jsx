import React from 'react';

const Button = () => (
  <button
    style={{
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    }}
    onClick={() => alert('Button clicked in remote app!')}
  >
    Click me (from Remote)
  </button>
);

export default Button;
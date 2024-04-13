import React from 'react';

const SignInButton = ({ onSignIn }) => {
  const handleSignIn = () => {
    // Call the onSignIn function passed from the parent component
    if (typeof onSignIn === 'function') {
      onSignIn();
    }
  };

  return (
    <button onClick={handleSignIn}>
      Sign In with MetaMask
    </button>
  );
};

export default SignInButton;

import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in

  const login = (userCredentials) => {
    // Placeholder for login logic
    // On successful login, set the user state
    if (userCredentials.role == 'admin'){
        setUser({ ...userCredentials, role: 'admin' }); // Example user role set after login
    }
    else{
        setUser({ ...userCredentials, role: 'user' }); // Example user role set after login
    }

  };

  const logout = () => {
    setUser(null); // Clear user state on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider

export const useAuth = () => useContext(AuthContext);
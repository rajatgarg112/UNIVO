import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'uv_auth';

const DEMO_USERS = {
  student: {
    id: 'STU001',
    name: 'Aryan Sharma',
    email: 'aryan@universityverse.edu',
    role: 'student',
    avatar: '',
    department: 'Computer Science',
    semester: '6th',
    rollNo: 'CS2021001',
    isLoggedIn: true,
  },
  faculty: {
    id: 'FAC001',
    name: 'Dr. Priya Nair',
    email: 'priya@universityverse.edu',
    role: 'faculty',
    avatar: '',
    department: 'Computer Science',
    isLoggedIn: true,
  },
  parent: {
    id: 'PAR001',
    name: 'Mr. Ramesh Sharma',
    email: 'ramesh@gmail.com',
    role: 'parent',
    avatar: '',
    isLoggedIn: true,
  },
  admin: {
    id: 'ADM001',
    name: 'Admin User',
    email: 'admin@universityverse.edu',
    role: 'admin',
    avatar: '',
    isLoggedIn: true,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (userData) => {
    const newUser = { ...userData, isLoggedIn: true };
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const demoLogin = (role) => {
    const demoUser = DEMO_USERS[role];
    if (!demoUser) {
      console.warn(`No demo user for role: ${role}`);
      return;
    }
    setUser(demoUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoUser));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    demoLogin,
    isLoggedIn: !!(user && user.isLoggedIn),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

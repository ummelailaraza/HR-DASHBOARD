'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR Director' | 'Employee' | 'Financial Controller';
  department: string;
  employeeCode: string;
  avatar: string;
  gender?: 'female' | 'male';
  city: string;
}

export const DEMO_USERS: AuthUser[] = [
  {
    id: 'emp-1',
    name: 'Ummelaila Raza',
    email: 'ummelaila.raza@corporate.pk',
    role: 'Admin',
    department: 'Software Engineering',
    employeeCode: 'PK-HRM-101',
    avatar: '',
    gender: 'female',
    city: 'Karachi',
  },
  {
    id: 'emp-2',
    name: 'Fatima Zahra',
    email: 'fatima.zahra@corporate.pk',
    role: 'HR Director',
    department: 'Human Resources',
    employeeCode: 'PK-HRM-102',
    avatar: '',
    gender: 'female',
    city: 'Karachi',
  },
  {
    id: 'emp-3',
    name: 'Usman Tariq',
    email: 'usman.tariq@corporate.pk',
    role: 'Employee',
    department: 'Software Engineering',
    employeeCode: 'PK-HRM-103',
    avatar: '',
    gender: 'male',
    city: 'Islamabad',
  },
  {
    id: 'emp-4',
    name: 'Ayesha Siddiqui',
    email: 'ayesha.siddiqui@corporate.pk',
    role: 'Financial Controller',
    department: 'Finance & Accounts',
    employeeCode: 'PK-HRM-104',
    avatar: '',
    gender: 'female',
    city: 'Karachi',
  },
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (userData: Partial<AuthUser> & { password?: string }) => Promise<boolean>;
  logout: () => void;
  switchUser: (targetUser: AuthUser) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS[0],
  isAuthenticated: true,
  login: async () => true,
  signup: async () => true,
  logout: () => {},
  switchUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(DEMO_USERS[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hrm_auth_user');
      if (saved) {
        const parsed: AuthUser = JSON.parse(saved);
        // Synchronize with updated DEMO_USERS profile pic removal and gender assignment
        const matchingDemo = DEMO_USERS.find(
          (u) => u.id === parsed.id || u.email?.toLowerCase() === parsed.email?.toLowerCase()
        );
        if (matchingDemo) {
          const synchronized: AuthUser = {
            ...parsed,
            avatar: matchingDemo.avatar,
            gender: matchingDemo.gender,
          };
          setUser(synchronized);
          localStorage.setItem('hrm_auth_user', JSON.stringify(synchronized));
        } else {
          setUser(parsed);
        }
        setIsAuthenticated(true);
      } else {
        // default to first demo user
        setUser(DEMO_USERS[0]);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.warn('Auth localstorage read failed', e);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Check if matching demo user or allow standard corporate login
    const found = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const loggedUser: AuthUser = found || {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email: email,
      role: 'Admin',
      department: 'Executive Operations',
      employeeCode: `PK-HRM-${Math.floor(100 + Math.random() * 900)}`,
      avatar: '',
      gender: 'female',
      city: 'Islamabad',
    };

    setUser(loggedUser);
    setIsAuthenticated(true);
    localStorage.setItem('hrm_auth_user', JSON.stringify(loggedUser));
    return true;
  };

  const signup = async (userData: Partial<AuthUser> & { password?: string }): Promise<boolean> => {
    const newUser: AuthUser = {
      id: `emp-${Date.now()}`,
      name: userData.name || 'New Colleague',
      email: userData.email || `employee.${Date.now()}@corporate.pk`,
      role: userData.role || 'Employee',
      department: userData.department || 'Software Engineering',
      employeeCode: `PK-HRM-${Math.floor(100 + Math.random() * 900)}`,
      avatar: userData.avatar || '',
      gender: userData.gender || 'female',
      city: userData.city || 'Lahore',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('hrm_auth_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hrm_auth_user');
    router.push('/login');
  };

  const switchUser = (targetUser: AuthUser) => {
    setUser(targetUser);
    setIsAuthenticated(true);
    localStorage.setItem('hrm_auth_user', JSON.stringify(targetUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

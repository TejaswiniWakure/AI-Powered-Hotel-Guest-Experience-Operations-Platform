import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { subscribeToHotel } from '../services/socket';

const AuthContext = createContext(null);

const DEMO_CREDENTIALS = {
  admin: { email: 'admin@stayflow.demo', password: 'StayFlow@2026', role: 'admin' },
  manager: { email: 'manager@stayflow.demo', password: 'StayFlow@2026', role: 'manager' },
  staff: { email: 'staff@stayflow.demo', password: 'StayFlow@2026', role: 'staff' }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const uId = localStorage.getItem('stayflow_userId');
    const gName = localStorage.getItem('stayflow_guestName');
    const rRole = localStorage.getItem('stayflow_role');
    const rNum = localStorage.getItem('stayflow_roomNumber');
    const hId = localStorage.getItem('stayflow_hotelId');
    if (uId && gName) {
      return { _id: uId, name: gName, role: rRole, roomNumber: rNum, hotelId: hId };
    }
    return null;
  });
  const [role, setRole] = useState(localStorage.getItem('stayflow_role') || null);
  const [hotelId, setHotelId] = useState(localStorage.getItem('stayflow_hotelId') || null);
  const [hotelName, setHotelName] = useState(localStorage.getItem('stayflow_hotelName') || 'StayFlow Grand Pune');
  const [hotelCode, setHotelCode] = useState(localStorage.getItem('stayflow_hotelCode') || 'SFGP');
  const [roomNumber, setRoomNumber] = useState(localStorage.getItem('stayflow_roomNumber') || '312');
  const [loading, setLoading] = useState(true);

  // Initialize session
  useEffect(() => {
    const token = localStorage.getItem('stayflow_token');
    if (token) {
      api.get('/auth/me')
        .then((data) => {
          if (data && data.user) {
            setUser(data.user);
            setRole(data.role || data.user.role);
            setHotelId(data.hotelId || data.user.hotelId?._id);
            if (data.hotel) {
              setHotelName(data.hotel.name);
              setHotelCode(data.hotel.hotelCode);
            }
            if (data.user.roomNumber) {
              setRoomNumber(data.user.roomNumber);
              localStorage.setItem('stayflow_roomNumber', data.user.roomNumber);
            }
            if (data.user.name) {
              localStorage.setItem('stayflow_guestName', data.user.name);
            }
            if (data.hotelId) {
              subscribeToHotel(data.hotelId);
            }
          }
        })
        .catch(() => {
          // Token expired or invalid
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, hotelCodeInput) => {
    const res = await api.post('/auth/login', {
      email,
      password,
      hotelCode: hotelCodeInput
    });

    const { token, user: userData, role: userRole, hotelId: hId, hotelName: hName, hotelCode: hCode } = res;

    localStorage.setItem('stayflow_token', token);
    localStorage.setItem('stayflow_role', userRole);
    localStorage.setItem('stayflow_hotelId', hId);
    localStorage.setItem('stayflow_hotelName', hName);
    localStorage.setItem('stayflow_hotelCode', hCode);
    localStorage.setItem('stayflow_userId', userData._id);
    if (userData.roomNumber) {
      localStorage.setItem('stayflow_roomNumber', userData.roomNumber);
      setRoomNumber(userData.roomNumber);
    }

    setUser(userData);
    setRole(userRole);
    setHotelId(hId);
    setHotelName(hName);
    setHotelCode(hCode);
    subscribeToHotel(hId);

    return { userRole, userData };
  };

  const demoLogin = async (targetRole) => {
    const creds = DEMO_CREDENTIALS[targetRole];
    if (!creds) throw new Error(`Unknown demo role: ${targetRole}`);
    return await login(creds.email, creds.password, 'SFGP');
  };

  const signup = async (signupData) => {
    const res = await api.post('/auth/signup', signupData);
    const { token, user: userData, role: userRole, hotelId: hId, hotelName: hName, hotelCode: hCode } = res;

    localStorage.setItem('stayflow_token', token);
    localStorage.setItem('stayflow_role', userRole);
    localStorage.setItem('stayflow_hotelId', hId);
    localStorage.setItem('stayflow_hotelName', hName);
    localStorage.setItem('stayflow_hotelCode', hCode);

    setUser(userData);
    setRole(userRole);
    setHotelId(hId);
    setHotelName(hName);
    setHotelCode(hCode);
    subscribeToHotel(hId);

    return { userRole, userData };
  };

  const setGuestSession = (token, userRole, hId, hName, hCode, uId, roomNum, gName) => {
    localStorage.setItem('stayflow_token', token);
    localStorage.setItem('stayflow_role', userRole);
    localStorage.setItem('stayflow_hotelId', hId);
    localStorage.setItem('stayflow_hotelName', hName);
    localStorage.setItem('stayflow_hotelCode', hCode);
    localStorage.setItem('stayflow_userId', uId);
    localStorage.setItem('stayflow_roomNumber', roomNum);
    localStorage.setItem('stayflow_guestName', gName);

    setRole(userRole);
    setHotelId(hId);
    setHotelName(hName);
    setHotelCode(hCode);
    setRoomNumber(roomNum);
    setUser({ _id: uId, name: gName, role: userRole, roomNumber: roomNum, hotelId: hId });
    subscribeToHotel(hId);
  };

  const logout = () => {
    localStorage.removeItem('stayflow_token');
    localStorage.removeItem('stayflow_role');
    localStorage.removeItem('stayflow_hotelId');
    localStorage.removeItem('stayflow_hotelName');
    localStorage.removeItem('stayflow_hotelCode');
    localStorage.removeItem('stayflow_userId');
    setUser(null);
    setRole(null);
    setHotelId(null);
  };

  const setGuestRoom = (room) => {
    if (room) {
      setRoomNumber(room);
      localStorage.setItem('stayflow_roomNumber', room);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        hotelId,
        hotelName,
        hotelCode,
        roomNumber,
        loading,
        isAuthenticated: !!user || !!localStorage.getItem('stayflow_token'),
        login,
        demoLogin,
        signup,
        logout,
        setGuestRoom,
        setGuestSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем сохраненную сессию при загрузке
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Имитация аутентификации
      // В реальном приложении здесь будет API запрос
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        age: Math.floor(Math.random() * 30) + 20,
        bio: 'Люблю путешествия и новые знакомства',
        interests: ['Путешествия', 'Музыка', 'Спорт'],
        location: 'Москва',
        photos: [
          `https://i.pravatar.cc/300?u=${email}&img=1`,
          `https://i.pravatar.cc/300?u=${email}&img=2`,
          `https://i.pravatar.cc/300?u=${email}&img=3`,
        ],
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ошибка входа' };
    }
  };

  const register = async (email, password, name, age, bio) => {
    try {
      // Имитация регистрации
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        age: parseInt(age),
        bio,
        interests: [],
        location: 'Москва',
        photos: [`https://i.pravatar.cc/300?u=${email}&img=1`],
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Ошибка регистрации' };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, error: 'Ошибка обновления профиля' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import databaseService from '../services/DatabaseService.js';

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
  const [isConnected, setIsConnected] = useState(false);

  // Проверка подключения к базе данных при загрузке
  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        await databaseService.connect();
        setIsConnected(true);
        console.log('✅ База данных подключена');
      } catch (error) {
        console.error('❌ Ошибка подключения к базе данных:', error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkDatabaseConnection();
  }, []);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      if (!isConnected) return;

      const savedUserId = localStorage.getItem('userId');
      if (savedUserId) {
        try {
          const userData = await databaseService.getUserById(parseInt(savedUserId));
          if (userData) {
            setUser(userData);
            // Обновляем статус онлайн
            await databaseService.updateOnlineStatus(parseInt(savedUserId), true);
          } else {
            localStorage.removeItem('userId');
          }
        } catch (error) {
          console.error('Ошибка получения данных пользователя:', error);
          localStorage.removeItem('userId');
        }
      }
    };

    checkAuth();
  }, [isConnected]);

  // Регистрация пользователя
  const register = async (userData) => {
    if (!isConnected) {
      throw new Error('База данных не подключена');
    }

    try {
      // Здесь должна быть логика создания пользователя в базе данных
      // Пока используем мок-данные
      const newUser = {
        userId: Date.now(),
        username: userData.username,
        email: userData.email,
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        bio: userData.bio || '',
        location: userData.location || '',
        avatar: userData.avatar || 'https://i.pravatar.cc/150?img=1',
        interests: userData.interests || [],
        photos: userData.photos || [],
        isOnline: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setUser(newUser);
      localStorage.setItem('userId', newUser.userId.toString());
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      return { success: false, error: error.message };
    }
  };

  // Вход пользователя
  const login = async (email, password) => {
    if (!isConnected) {
      throw new Error('База данных не подключена');
    }

    try {
      // Здесь должна быть логика проверки пользователя в базе данных
      // Пока используем мок-данные
      const mockUser = {
        userId: 1,
        username: 'demo_user',
        email: email,
        name: 'Демо Пользователь',
        age: 25,
        gender: 'Женский',
        bio: 'Демо-пользователь для тестирования',
        location: 'Москва',
        avatar: 'https://i.pravatar.cc/150?img=1',
        interests: ['Путешествия', 'Фотография', 'Музыка'],
        photos: [
          'https://i.pravatar.cc/300?img=1',
          'https://i.pravatar.cc/300?img=2',
          'https://i.pravatar.cc/300?img=3'
        ],
        isOnline: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setUser(mockUser);
      localStorage.setItem('userId', mockUser.userId.toString());
      
      // Обновляем статус онлайн
      await databaseService.updateOnlineStatus(mockUser.userId, true);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Ошибка входа:', error);
      return { success: false, error: error.message };
    }
  };

  // Выход пользователя
  const logout = async () => {
    if (user && isConnected) {
      try {
        // Обновляем статус оффлайн
        await databaseService.updateOnlineStatus(user.userId, false);
      } catch (error) {
        console.error('Ошибка обновления статуса:', error);
      }
    }

    setUser(null);
    localStorage.removeItem('userId');
  };

  // Обновление профиля
  const updateProfile = async (profileData) => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      // Обновляем в базе данных
      await databaseService.updateUserProfile(user.userId, profileData);
      
      // Обновляем локальное состояние
      const updatedUser = { ...user, ...profileData, updatedAt: new Date() };
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      return { success: false, error: error.message };
    }
  };

  // Обновление настроек
  const updateSettings = async (settings) => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      // Обновляем в базе данных
      await databaseService.updateUserSettings(user.userId, settings);
      
      return { success: true };
    } catch (error) {
      console.error('Ошибка обновления настроек:', error);
      return { success: false, error: error.message };
    }
  };

  // Получение профилей для просмотра
  const getProfilesForViewing = async (limit = 10) => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.getProfilesForUser(user.userId, limit);
    } catch (error) {
      console.error('Ошибка получения профилей:', error);
      throw error;
    }
  };

  // Создание лайка
  const createLike = async (toUserId, likeType = 'like') => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.createLike(user.userId, toUserId, likeType);
    } catch (error) {
      console.error('Ошибка создания лайка:', error);
      throw error;
    }
  };

  // Получение матчей пользователя
  const getUserMatches = async () => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.getUserMatches(user.userId);
    } catch (error) {
      console.error('Ошибка получения матчей:', error);
      throw error;
    }
  };

  // Получение чатов пользователя
  const getUserChats = async () => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.getUserChats(user.userId);
    } catch (error) {
      console.error('Ошибка получения чатов:', error);
      throw error;
    }
  };

  // Получение сообщений чата
  const getChatMessages = async (chatId, limit = 50) => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.getChatMessages(chatId, limit);
    } catch (error) {
      console.error('Ошибка получения сообщений:', error);
      throw error;
    }
  };

  // Отправка сообщения
  const sendMessage = async (chatId, messageText, messageType = 'text', photoUrl = null) => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.sendMessage(chatId, user.userId, messageText, messageType, photoUrl);
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
      throw error;
    }
  };

  // Отметка сообщений как прочитанные
  const markMessagesAsRead = async (chatId) => {
    if (!user || !isConnected) {
      throw new Error('Пользователь не аутентифицирован или база данных не подключена');
    }

    try {
      return await databaseService.markMessagesAsRead(chatId, user.userId);
    } catch (error) {
      console.error('Ошибка отметки сообщений:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isConnected,
    register,
    login,
    logout,
    updateProfile,
    updateSettings,
    getProfilesForViewing,
    createLike,
    getUserMatches,
    getUserChats,
    getChatMessages,
    sendMessage,
    markMessagesAsRead
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


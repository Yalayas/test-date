import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { View, Text, StyleSheet } from 'react-native';

// Импорт экранов
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import MatchesScreen from './screens/MatchesScreen';
import SettingsScreen from './screens/SettingsScreen';

// Импорт контекста аутентификации
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Компонент для иконок вкладок
const TabIcon = ({ name, isActive, onClick, tooltip }) => (
  <View style={styles.tabIconContainer}>
    <View 
      style={[styles.tabIcon, isActive && styles.tabIconActive]} 
      onClick={onClick}
      title={tooltip}
    >
      <Text style={[styles.tabIconText, isActive && styles.tabIconTextActive]}>
        {name}
      </Text>
    </View>
    <Text style={styles.tooltip}>{tooltip}</Text>
  </View>
);

// Основная навигация с вкладками
function MainTabs() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'matches':
        return <MatchesScreen />;
      case 'chat':
        return <ChatScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      <View style={styles.tabBar}>
        <TabIcon 
          name="🏠" 
          isActive={activeTab === 'home'} 
          onClick={() => setActiveTab('home')}
          tooltip="Главная"
        />
        <TabIcon 
          name="💕" 
          isActive={activeTab === 'matches'} 
          onClick={() => setActiveTab('matches')}
          tooltip="Материалы"
        />
        <TabIcon 
          name="💬" 
          isActive={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')}
          tooltip="Чаты"
        />
        <TabIcon 
          name="👤" 
          isActive={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
          tooltip="Профиль"
        />
      </View>
    </View>
  );
}

// Главный компонент навигации
function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка...</Text>
      </View>
    );
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <Route path="/*" element={<MainTabs />} />
        ) : (
          <>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

// Главный компонент приложения
function App() {
  return (
    <View style={styles.appContainer}>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    height: '100vh',
    backgroundColor: '#667eea',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 5,
    paddingTop: 5,
    height: 60,
  },
  tabIcon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    paddingVertical: 10,
  },
  tabIconActive: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
  },
  tabIconText: {
    fontSize: 20,
    color: '#8E8E93',
  },
  tabIconTextActive: {
    color: '#FF6B9D',
  },
  tabIconContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: -25,
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    opacity: 0.8,
  },
});

export default App;

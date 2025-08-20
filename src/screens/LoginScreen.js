import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Ошибка входа', result.error);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const goToRegister = () => {
    window.location.href = '/register';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Логотип */}
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💕</Text>
          <Text style={styles.appName}>Dating App</Text>
          <Text style={styles.tagline}>Найди свою любовь</Text>
        </View>

        {/* Форма входа */}
        <View style={styles.formContainer}>
          <Text style={styles.title}>Войти в аккаунт</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Пароль"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Вход...' : 'Войти'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => Alert.alert('Информация', 'Функция восстановления пароля будет доступна позже')}
          >
            <Text style={styles.forgotPasswordText}>Забыли пароль?</Text>
          </TouchableOpacity>
        </View>

        {/* Ссылка на регистрацию */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Нет аккаунта? </Text>
          <TouchableOpacity onPress={goToRegister}>
            <Text style={styles.registerLink}>Зарегистрироваться</Text>
          </TouchableOpacity>
        </View>

        {/* Демо-данные */}
        <View style={styles.demoContainer}>
          <Text style={styles.demoText}>Демо-режим:</Text>
          <Text style={styles.demoText}>Email: demo@example.com</Text>
          <Text style={styles.demoText}>Пароль: любой</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  loginButton: {
    backgroundColor: '#FF6B9D',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#CCC',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#FF6B9D',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  registerLink: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
    cursor: 'pointer',
  },
  demoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  demoText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 5,
  },
});

export default LoginScreen;

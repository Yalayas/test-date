import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const SettingsScreen = () => {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    privacyMode: false,
    showOnlineStatus: true,
    showLastSeen: true,
    showDistance: true,
    showAge: true,
    autoPlayVideos: false,
    dataSaver: false,
  });

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    Alert.alert(
      'Аккаунт удален',
      'Ваш аккаунт был успешно удален. Спасибо за использование нашего приложения!',
      [
        {
          text: 'OK',
          onPress: () => logout(),
        },
      ]
    );
  };

  const SettingItem = ({ title, subtitle, value, onToggle, type = 'switch' }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      
      {type === 'switch' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E5EA', true: '#FF6B9D' }}
          thumbColor={value ? 'white' : '#8E8E93'}
        />
      ) : (
        <TouchableOpacity style={styles.settingButton}>
          <Text style={styles.settingButtonText}>{value}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Настройки</Text>
        <Text style={styles.headerSubtitle}>Настройте приложение под себя</Text>
      </View>

      {/* Уведомления */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Уведомления</Text>
        
        <SettingItem
          title="Уведомления"
          subtitle="Включить все уведомления"
          value={settings.notifications}
          onToggle={() => toggleSetting('notifications')}
        />
        
        <SettingItem
          title="Email уведомления"
          subtitle="Получать уведомления на email"
          value={settings.emailNotifications}
          onToggle={() => toggleSetting('emailNotifications')}
        />
        
        <SettingItem
          title="Push уведомления"
          subtitle="Получать push уведомления"
          value={settings.pushNotifications}
          onToggle={() => toggleSetting('pushNotifications')}
        />
        
        <SettingItem
          title="Звук"
          subtitle="Включить звук уведомлений"
          value={settings.soundEnabled}
          onToggle={() => toggleSetting('soundEnabled')}
        />
        
        <SettingItem
          title="Вибрация"
          subtitle="Включить вибрацию"
          value={settings.vibrationEnabled}
          onToggle={() => toggleSetting('vibrationEnabled')}
        />
      </View>

      {/* Приватность */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔒 Приватность</Text>
        
        <SettingItem
          title="Режим приватности"
          subtitle="Скрыть профиль от других пользователей"
          value={settings.privacyMode}
          onToggle={() => toggleSetting('privacyMode')}
        />
        
        <SettingItem
          title="Показывать онлайн статус"
          subtitle="Другие видят, когда вы онлайн"
          value={settings.showOnlineStatus}
          onToggle={() => toggleSetting('showOnlineStatus')}
        />
        
        <SettingItem
          title="Показывать последний раз"
          subtitle="Другие видят, когда вы были в сети"
          value={settings.showLastSeen}
          onToggle={() => toggleSetting('showLastSeen')}
        />
        
        <SettingItem
          title="Показывать расстояние"
          subtitle="Другие видят расстояние до вас"
          value={settings.showDistance}
          onToggle={() => toggleSetting('showDistance')}
        />
        
        <SettingItem
          title="Показывать возраст"
          subtitle="Другие видят ваш возраст"
          value={settings.showAge}
          onToggle={() => toggleSetting('showAge')}
        />
      </View>

      {/* Приложение */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Приложение</Text>
        
        <SettingItem
          title="Автовоспроизведение видео"
          subtitle="Автоматически воспроизводить видео"
          value={settings.autoPlayVideos}
          onToggle={() => toggleSetting('autoPlayVideos')}
        />
        
        <SettingItem
          title="Экономия данных"
          subtitle="Снизить качество изображений для экономии трафика"
          value={settings.dataSaver}
          onToggle={() => toggleSetting('dataSaver')}
        />
      </View>

      {/* Фильтры */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 Фильтры поиска</Text>
        
        <TouchableOpacity style={styles.filterItem}>
          <Text style={styles.filterTitle}>Возраст</Text>
          <Text style={styles.filterValue}>18-35 лет</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterItem}>
          <Text style={styles.filterTitle}>Расстояние</Text>
          <Text style={styles.filterValue}>50 км</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterItem}>
          <Text style={styles.filterTitle}>Интересы</Text>
          <Text style={styles.filterValue}>Все</Text>
        </TouchableOpacity>
      </View>

      {/* Аккаунт */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Аккаунт</Text>
        
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountTitle}>Изменить пароль</Text>
          <Text style={styles.accountSubtitle}>Обновить пароль для безопасности</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountTitle}>Двухфакторная аутентификация</Text>
          <Text style={styles.accountSubtitle}>Дополнительная защита аккаунта</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.accountItem}>
          <Text style={styles.accountTitle}>Экспорт данных</Text>
          <Text style={styles.accountSubtitle}>Скачать ваши данные</Text>
        </TouchableOpacity>
      </View>

      {/* Поддержка */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💬 Поддержка</Text>
        
        <TouchableOpacity style={styles.supportItem}>
          <Text style={styles.supportTitle}>Помощь</Text>
          <Text style={styles.supportSubtitle}>FAQ и инструкции</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <Text style={styles.supportTitle}>Связаться с поддержкой</Text>
          <Text style={styles.supportSubtitle}>Написать в службу поддержки</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.supportItem}>
          <Text style={styles.supportTitle}>О приложении</Text>
          <Text style={styles.supportSubtitle}>Версия 1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* Опасная зона */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ Опасная зона</Text>
        
        <View style={styles.dangerButtonContainer}>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={() => setShowLogoutModal(true)}
          >
            <Text style={styles.dangerButtonText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
          <Text style={styles.dangerButtonTooltip}>Завершить текущую сессию</Text>
        </View>
        
        <View style={styles.dangerButtonContainer}>
          <TouchableOpacity
            style={[styles.dangerButton, styles.deleteButton]}
            onPress={() => setShowDeleteModal(true)}
          >
            <Text style={styles.deleteButtonText}>Удалить аккаунт</Text>
          </TouchableOpacity>
          <Text style={styles.dangerButtonTooltip}>Безвозвратно удалить все данные</Text>
        </View>
      </View>

      {/* Модальное окно выхода */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Выйти из аккаунта?</Text>
            <Text style={styles.modalText}>
              Вы уверены, что хотите выйти? Все несохраненные изменения будут потеряны.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalLogoutButton}
                onPress={handleLogout}
              >
                <Text style={styles.modalLogoutButtonText}>Выйти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно удаления */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Удалить аккаунт?</Text>
            <Text style={styles.modalText}>
              Это действие нельзя отменить. Все ваши данные, матчи и сообщения будут безвозвратно удалены.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.modalDeleteButtonText}>Удалить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  settingButton: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  settingButtonText: {
    fontSize: 14,
    color: '#333',
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterTitle: {
    fontSize: 16,
    color: '#333',
  },
  filterValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  accountItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  accountTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  accountSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  supportItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  supportTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  supportSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButtonContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  dangerButtonTooltip: {
    marginTop: 8,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    opacity: 0.8,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalLogoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalLogoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalDeleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 20,
    marginLeft: 10,
    flex: 1,
    alignItems: 'center',
  },
  modalDeleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;


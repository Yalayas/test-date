import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  const handleSave = async () => {
    if (!editData.name || !editData.age || !editData.bio) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (parseInt(editData.age) < 18 || parseInt(editData.age) > 100) {
      Alert.alert('Ошибка', 'Возраст должен быть от 18 до 100 лет');
      return;
    }

    try {
      const result = await updateProfile({
        name: editData.name,
        age: parseInt(editData.age),
        bio: editData.bio,
        location: editData.location,
      });

      if (result.success) {
        setIsEditing(false);
        Alert.alert('Успех', 'Профиль обновлен');
      } else {
        Alert.alert('Ошибка', result.error);
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось обновить профиль');
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user?.name || '',
      age: user?.age?.toString() || '',
      bio: user?.bio || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  const openImageModal = (imageUri, imageName) => {
    setSelectedImage({ uri: imageUri, name: imageName });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Пользователь не найден</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мой профиль</Text>
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Отмена' : 'Редактировать'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.editButtonTooltip}>
            {isEditing ? 'Отменить редактирование' : 'Редактировать профиль'}
          </Text>
        </View>
      </View>

      {/* Основная информация */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => openImageModal(user.avatar, 'Главное фото')}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarBadgeText}>👑</Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editForm}>
            <TextInput
              style={styles.editInput}
              placeholder="Имя"
              value={editData.name}
              onChangeText={(text) => setEditData({ ...editData, name: text })}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Возраст"
              value={editData.age}
              onChangeText={(text) => setEditData({ ...editData, age: text })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.editInput}
              placeholder="О себе"
              value={editData.bio}
              onChangeText={(text) => setEditData({ ...editData, bio: text })}
              multiline
              numberOfLines={3}
            />
            <TextInput
              style={styles.editInput}
              placeholder="Город"
              value={editData.location}
              onChangeText={(text) => setEditData({ ...editData, location: text })}
            />
            
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Сохранить</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Отмена</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileAge}>{user.age} лет</Text>
            <Text style={styles.profileLocation}>📍 {user.location}</Text>
            <Text style={styles.profileBio}>{user.bio}</Text>
          </View>
        )}
      </View>

      {/* Фотографии */}
      <View style={styles.photosSection}>
        <Text style={styles.sectionTitle}>Мои фотографии</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {user.photos.map((photo, index) => (
            <View key={index} style={styles.photoContainer}>
              <TouchableOpacity onPress={() => openImageModal(photo, `Фото ${index + 1}`)}>
                <Image source={{ uri: photo }} style={styles.photo} />
              </TouchableOpacity>
              {index === 0 && (
                <View style={styles.mainPhotoBadge}>
                  <Text style={styles.mainPhotoBadgeText}>Главная</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Интересы */}
      <View style={styles.interestsSection}>
        <Text style={styles.sectionTitle}>Мои интересы</Text>
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Статистика */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Статистика</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Просмотры</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Лайки</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Матчи</Text>
          </View>
        </View>
      </View>

      {/* Настройки */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Настройки</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Уведомления</Text>
          <Text style={styles.settingValue}>Включены</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Приватность</Text>
          <Text style={styles.settingValue}>Публичный</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Расстояние</Text>
          <Text style={styles.settingValue}>50 км</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Возраст</Text>
          <Text style={styles.settingValue}>18-35</Text>
        </TouchableOpacity>
      </View>

      {/* Кнопка выхода */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setShowLogoutModal(true)}
      >
        <Text style={styles.logoutButtonText}>Выйти из аккаунта</Text>
      </TouchableOpacity>

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

      {/* Модальное окно для большого изображения */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={styles.imageModalOverlay}>
          <View style={styles.imageModalContent}>
            <View style={styles.imageModalHeader}>
              <Text style={styles.imageModalTitle}>
                {selectedImage?.name}
              </Text>
              <TouchableOpacity
                style={styles.imageModalCloseButton}
                onPress={closeImageModal}
              >
                <Text style={styles.imageModalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {selectedImage && (
              <Image 
                source={{ uri: selectedImage.uri }} 
                style={styles.largeImage}
                resizeMode="contain"
              />
            )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  editButtonContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  editButtonTooltip: {
    marginTop: 5,
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
    opacity: 0.8,
    whiteSpace: 'nowrap',
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    cursor: 'pointer',
  },
  avatarBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFD700',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBadgeText: {
    fontSize: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  profileAge: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 10,
  },
  profileLocation: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 15,
  },
  profileBio: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
  },
  editForm: {
    width: '100%',
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  photosSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  photoContainer: {
    marginRight: 15,
    position: 'relative',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 12,
    cursor: 'pointer',
  },
  mainPhotoBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  mainPhotoBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  interestsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  interestText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B9D',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  settingsSection: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#8E8E93',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    marginHorizontal: 20,
    marginBottom: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  errorText: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 100,
  },
  // Стили для модального окна изображения
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'transparent',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    marginBottom: 20,
  },
  imageModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  imageModalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalCloseText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  largeImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
});

export default ProfileScreen;


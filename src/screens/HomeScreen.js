import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;

const HomeScreen = () => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [position] = useState(new Animated.ValueXY());
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Генерация демо-профилей
  useEffect(() => {
    const demoProfiles = [
      {
        id: '1',
        name: 'Анна',
        age: 25,
        bio: 'Люблю путешествия, фотографию и хорошую музыку. Ищу интересного собеседника для долгих прогулок по городу.',
        avatar: 'https://i.pravatar.cc/300?img=1',
        photos: [
          'https://i.pravatar.cc/300?img=1',
          'https://i.pravatar.cc/300?img=2',
          'https://i.pravatar.cc/300?img=3',
        ],
        interests: ['Путешествия', 'Фотография', 'Музыка', 'Искусство'],
        location: 'Москва',
      },
      {
        id: '2',
        name: 'Мария',
        age: 28,
        bio: 'Спортсменка, люблю активный образ жизни. Ищу единомышленника для совместных тренировок и приключений.',
        avatar: 'https://i.pravatar.cc/300?img=4',
        photos: [
          'https://i.pravatar.cc/300?img=4',
          'https://i.pravatar.cc/300?img=5',
          'https://i.pravatar.cc/300?img=6',
        ],
        interests: ['Спорт', 'Фитнес', 'Природа', 'Путешествия'],
        location: 'Санкт-Петербург',
      },
      {
        id: '3',
        name: 'Елена',
        age: 23,
        bio: 'Студентка, учусь на дизайнера. Обожаю творчество, кофе и долгие разговоры о жизни.',
        avatar: 'https://i.pravatar.cc/300?img=7',
        photos: [
          'https://i.pravatar.cc/300?img=7',
          'https://i.pravatar.cc/300?img=8',
          'https://i.pravatar.cc/300?img=9',
        ],
        interests: ['Дизайн', 'Искусство', 'Кофе', 'Книги'],
        location: 'Казань',
      },
      {
        id: '4',
        name: 'Ольга',
        age: 26,
        bio: 'Маркетолог по профессии, блогер по призванию. Люблю делиться опытом и находить новые знакомства.',
        avatar: 'https://i.pravatar.cc/300?img=10',
        photos: [
          'https://i.pravatar.cc/300?img=10',
          'https://i.pravatar.cc/300?img=11',
          'https://i.pravatar.cc/300?img=12',
        ],
        interests: ['Маркетинг', 'Блоггинг', 'Социальные сети', 'Творчество'],
        location: 'Новосибирск',
      },
    ];
    setProfiles(demoProfiles);
  }, []);

  const handleLike = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    } else {
      Alert.alert('Поздравляем!', 'Вы просмотрели всех доступных пользователей!');
    }
  };

  const handleDislike = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      position.setValue({ x: 0, y: 0 });
    } else {
      Alert.alert('Поздравляем!', 'Вы просмотрели всех доступных пользователей!');
    }
  };

  const handleSuperLike = () => {
    Alert.alert('Супер лайк!', `Вы отправили супер лайк ${profiles[currentIndex]?.name}!`);
    handleLike();
  };

  const openImageModal = (imageUri, imageName) => {
    setSelectedImage({ uri: imageUri, name: imageName });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // Веб-совместимые обработчики свайпов
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    position.setOffset({
      x: position.x._value,
      y: position.y._value,
    });
    position.setValue({ x: 0, y: 0 });
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const newX = touch.clientX - e.target.getBoundingClientRect().left - width / 2;
    const newY = touch.clientY - e.target.getBoundingClientRect().top - height / 2;
    
    position.setValue({ x: newX, y: newY });
  };

  const handleTouchEnd = (e) => {
    const currentX = position.x._value;
    
    if (Math.abs(currentX) > SWIPE_THRESHOLD) {
      if (currentX > 0) {
        // Свайп вправо - лайк
        Animated.timing(position, {
          toValue: { x: width * 2, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => handleLike());
      } else {
        // Свайп влево - дизлайк
        Animated.timing(position, {
          toValue: { x: -width * 2, y: 0 },
          duration: 300,
          useNativeDriver: false,
        }).start(() => handleDislike());
      }
    } else {
      // Возврат в исходное положение
      Animated.spring(position, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    }
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-width * 2, 0, width * 2],
      outputRange: ['-120deg', '0deg', '120deg'],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Нет доступных профилей</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => setCurrentIndex(0)}>
          <Text style={styles.refreshButtonText}>Обновить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentProfile = profiles[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Найди свою любовь</Text>
        <Text style={styles.headerSubtitle}>
          {currentIndex + 1} из {profiles.length}
        </Text>
      </View>

      <View style={styles.cardContainer}>
        <Animated.View 
          style={[styles.card, getCardStyle()]}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <TouchableOpacity onPress={() => openImageModal(currentProfile.avatar, `${currentProfile.name}, ${currentProfile.age}`)}>
            <Image source={{ uri: currentProfile.avatar }} style={styles.cardImage} />
          </TouchableOpacity>
          <View style={styles.cardOverlay}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>
                {currentProfile.name}, {currentProfile.age}
              </Text>
              <Text style={styles.cardLocation}>📍 {currentProfile.location}</Text>
              <Text style={styles.cardBio}>{currentProfile.bio}</Text>
              
              <View style={styles.interestsContainer}>
                {currentProfile.interests.map((interest, index) => (
                  <View key={index} style={styles.interestTag}>
                    <Text style={styles.interestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.actionsContainer}>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={handleDislike}>
            <Text style={styles.actionButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.actionButtonTooltip}>Пропустить</Text>
        </View>
        
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.superLikeButton]} onPress={handleSuperLike}>
            <Text style={styles.actionButtonText}>⭐</Text>
          </TouchableOpacity>
          <Text style={styles.actionButtonTooltip}>Супер лайк</Text>
        </View>
        
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={handleLike}>
            <Text style={styles.actionButtonText}>♥</Text>
          </TouchableOpacity>
          <Text style={styles.actionButtonTooltip}>Лайк</Text>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Свайп влево для пропуска, вправо для лайка
        </Text>
      </View>

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
    </View>
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
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: height * 0.6,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    cursor: 'grab',
    userSelect: 'none',
    touchAction: 'none',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    cursor: 'pointer',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  cardInfo: {
    color: 'white',
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 16,
    marginBottom: 10,
    opacity: 0.9,
  },
  cardBio: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 15,
    opacity: 0.9,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: 'white',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: 'white',
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  dislikeButton: {
    backgroundColor: '#FF3B30',
  },
  superLikeButton: {
    backgroundColor: '#007AFF',
  },
  likeButton: {
    backgroundColor: '#FF6B9D',
  },
  actionButtonText: {
    fontSize: 24,
    color: 'white',
  },
  actionButtonContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  actionButtonTooltip: {
    marginTop: 8,
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    opacity: 0.8,
  },
  instructions: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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

export default HomeScreen;


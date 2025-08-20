import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const MatchesScreen = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Генерация демо-матчей
  useEffect(() => {
    const demoMatches = [
      {
        id: '1',
        name: 'Анна',
        age: 25,
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Привет! Как дела?',
        lastMessageTime: '2 мин назад',
        unreadCount: 2,
        isOnline: true,
        photos: [
          'https://i.pravatar.cc/300?img=1',
          'https://i.pravatar.cc/300?img=2',
        ],
        bio: 'Люблю путешествия и фотографию',
        interests: ['Путешествия', 'Фотография', 'Музыка'],
        location: 'Москва',
      },
      {
        id: '2',
        name: 'Мария',
        age: 28,
        avatar: 'https://i.pravatar.cc/150?img=4',
        lastMessage: 'Отличная идея! Давайте встретимся',
        lastMessageTime: '1 час назад',
        unreadCount: 0,
        isOnline: false,
        photos: [
          'https://i.pravatar.cc/300?img=4',
          'https://i.pravatar.cc/300?img=5',
        ],
        bio: 'Спортсменка, люблю активный образ жизни',
        interests: ['Спорт', 'Фитнес', 'Природа'],
        location: 'Санкт-Петербург',
      },
      {
        id: '3',
        name: 'Елена',
        age: 23,
        avatar: 'https://i.pravatar.cc/150?img=7',
        lastMessage: 'Спасибо за лайк! 😊',
        lastMessageTime: '3 часа назад',
        unreadCount: 1,
        isOnline: true,
        photos: [
          'https://i.pravatar.cc/300?img=7',
          'https://i.pravatar.cc/300?img=8',
        ],
        bio: 'Студентка, учусь на дизайнера',
        interests: ['Дизайн', 'Искусство', 'Кофе'],
        location: 'Казань',
      },
      {
        id: '4',
        name: 'Ольга',
        age: 26,
        avatar: 'https://i.pravatar.cc/150?img=10',
        lastMessage: 'Ты мне очень понравился!',
        lastMessageTime: 'Вчера',
        unreadCount: 0,
        isOnline: false,
        photos: [
          'https://i.pravatar.cc/300?img=10',
          'https://i.pravatar.cc/300?img=11',
        ],
        bio: 'Маркетолог по профессии, блогер по призванию',
        interests: ['Маркетинг', 'Блоггинг', 'Творчество'],
        location: 'Новосибирск',
      },
    ];
    
    // Имитация загрузки
    setTimeout(() => {
      setMatches(demoMatches);
      setLoading(false);
    }, 1000);
  }, []);

  const handleMatchPress = (match) => {
    // Здесь можно перейти к чату или детальному просмотру профиля
    Alert.alert(
      'Матч!',
      `Вы понравились друг другу с ${match.name}!`,
      [
        {
          text: 'Написать сообщение',
          onPress: () => {
            Alert.alert(
              `Чат с ${match.name}`,
              `Открыть чат с ${match.name}?\n\nВ полной версии приложения здесь будет переход к экрану чата.`
            );
          },
        },
        {
          text: 'Посмотреть профиль',
          onPress: () => showProfileModal(match),
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  const showProfileModal = (match) => {
    Alert.alert(
      `${match.name}, ${match.age}`,
      `${match.bio}\n\nИнтересы: ${match.interests.join(', ')}\n📍 ${match.location}`,
      [
        {
          text: 'Написать',
          onPress: () => {
            Alert.alert(
              `Чат с ${match.name}`,
              `Открыть чат с ${match.name}?\n\nВ полной версии приложения здесь будет переход к экрану чата.`
            );
          },
        },
        {
          text: 'Закрыть',
          style: 'cancel',
        },
      ]
    );
  };

  const openImageModal = (imageUri, userName) => {
    setSelectedImage({ uri: imageUri, name: userName });
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  const renderMatchItem = ({ item }) => (
    <TouchableOpacity
      style={styles.matchItem}
      onPress={() => handleMatchPress(item)}
    >
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => openImageModal(item.avatar, item.name)}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </TouchableOpacity>
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.matchInfo}>
        <View style={styles.matchHeader}>
          <Text style={styles.matchName}>{item.name}, {item.age}</Text>
          <Text style={styles.matchTime}>{item.lastMessageTime}</Text>
        </View>
        
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        
        <View style={styles.interestsContainer}>
          {item.interests.slice(0, 2).map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.messageButton}
        onPress={() => {
          Alert.alert(
            `Чат с ${item.name}`,
            `Открыть чат с ${item.name}?\n\nВ полной версии приложения здесь будет переход к экрану чата.`
          );
        }}
      >
        <Text style={styles.messageButtonText}>💬</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка матчей...</Text>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💕</Text>
        <Text style={styles.emptyTitle}>Пока нет матчей</Text>
        <Text style={styles.emptyText}>
          Продолжайте лайкать профили, и вы обязательно найдете взаимность!
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => {
            Alert.alert(
              'Переход к главной',
              'В полной версии приложения здесь будет переход к главному экрану для просмотра профилей.'
            );
          }}
        >
          <Text style={styles.browseButtonText}>Просматривать профили</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Мои матчи</Text>
        <Text style={styles.headerSubtitle}>
          {matches.length} взаимных лайков
        </Text>
      </View>

      <FlatList
        data={matches}
        renderItem={renderMatchItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.matchesList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
                 <Text style={styles.footerText}>
           💡 Совет: Напишите первое сообщение, чтобы начать общение!
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
  matchesList: {
    padding: 20,
  },
  matchItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    cursor: 'pointer',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CD964',
    borderWidth: 2,
    borderColor: 'white',
  },
  unreadBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  matchName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  matchTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
  },
  interestTag: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
  },
  interestText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#FF6B9D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  messageButtonText: {
    fontSize: 18,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FF6B9D',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
     browseButtonText: {
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

export default MatchesScreen;


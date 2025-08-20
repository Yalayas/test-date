import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ChatScreen = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Генерация демо-чатов
  useEffect(() => {
    const demoChats = [
      {
        id: '1',
        matchId: '1',
        name: 'Анна',
        age: 25,
        avatar: 'https://i.pravatar.cc/150?img=1',
        lastMessage: 'Привет! Как дела?',
        lastMessageTime: '2 мин назад',
        unreadCount: 2,
        isOnline: true,
        lastMessageType: 'text',
        matchDate: '2024-01-15',
      },
      {
        id: '2',
        matchId: '2',
        name: 'Мария',
        age: 28,
        avatar: 'https://i.pravatar.cc/150?img=4',
        lastMessage: 'Отличная идея! Давайте встретимся',
        lastMessageTime: '1 час назад',
        unreadCount: 0,
        isOnline: false,
        lastMessageType: 'text',
        matchDate: '2024-01-14',
      },
      {
        id: '3',
        matchId: '3',
        name: 'Елена',
        age: 23,
        avatar: 'https://i.pravatar.cc/150?img=7',
        lastMessage: 'Спасибо за лайк! 😊',
        lastMessageTime: '3 часа назад',
        unreadCount: 1,
        isOnline: true,
        lastMessageType: 'text',
        matchDate: '2024-01-13',
      },
      {
        id: '4',
        matchId: '4',
        name: 'Ольга',
        age: 26,
        avatar: 'https://i.pravatar.cc/150?img=10',
        lastMessage: 'Ты мне очень понравился!',
        lastMessageTime: 'Вчера',
        unreadCount: 0,
        isOnline: false,
        lastMessageType: 'text',
        matchDate: '2024-01-12',
      },
      {
        id: '5',
        matchId: '5',
        name: 'Ирина',
        age: 24,
        avatar: 'https://i.pravatar.cc/150?img=13',
        lastMessage: 'Фото 📸',
        lastMessageTime: '2 дня назад',
        unreadCount: 0,
        isOnline: false,
        lastMessageType: 'photo',
        matchDate: '2024-01-10',
      },
    ];
    
    // Имитация загрузки
    setTimeout(() => {
      setChats(demoChats);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (chat) => {
    // Показываем информацию о чате (в веб-версии)
    Alert.alert(
      `Чат с ${chat.name}`,
      `ID чата: ${chat.id}\nID матча: ${chat.matchId}\nПоследнее сообщение: ${chat.lastMessage}`,
      [
        {
          text: 'Написать сообщение',
          onPress: () => {
            Alert.alert('Сообщение', 'Функция отправки сообщений будет доступна в полной версии приложения');
          },
        },
        {
          text: 'Посмотреть профиль',
          onPress: () => {
            Alert.alert(
              `${chat.name}, ${chat.age}`,
              'Информация о профиле будет доступна здесь'
            );
          },
        },
        {
          text: 'Отмена',
          style: 'cancel',
        },
      ]
    );
  };

  const handleNewChat = () => {
    setShowNewChatModal(true);
  };

  const startNewChat = (matchId) => {
    setShowNewChatModal(false);
    // Показываем информацию о создании чата
    Alert.alert(
      'Новый чат', 
      `Чат с матчем ID: ${matchId} будет создан автоматически при первом сообщении.\n\nВ полной версии приложения здесь будет переход к экрану чата.`
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

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
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
      
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}, {item.age}</Text>
          <Text style={styles.chatTime}>{item.lastMessageTime}</Text>
        </View>
        
        <View style={styles.lastMessageContainer}>
          {item.lastMessageType === 'photo' && (
            <Text style={styles.messageTypeIcon}>📸</Text>
          )}
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
        
        <Text style={styles.matchDate}>Матч: {new Date(item.matchDate).toLocaleDateString('ru-RU')}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => {
          Alert.alert(
            item.name,
            'Выберите действие',
            [
              {
                text: 'Написать',
                onPress: () => handleChatPress(item),
              },
              {
                text: 'Посмотреть профиль',
                onPress: () => {
                  Alert.alert(
                    `${item.name}, ${item.age}`,
                    'Информация о профиле будет доступна здесь'
                  );
                },
              },
              {
                text: 'Отмена',
                style: 'cancel',
              },
            ]
          );
        }}
      >
        <Text style={styles.moreButtonText}>⋯</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Загрузка чатов...</Text>
      </View>
    );
  }

  if (chats.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💬</Text>
        <Text style={styles.emptyTitle}>Пока нет чатов</Text>
        <Text style={styles.emptyText}>
          Начните общение с вашими матчами, чтобы появились чаты!
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => {
          Alert.alert(
            'Переход к матчам',
            'В полной версии приложения здесь будет переход к экрану матчей.'
          );
        }}
        >
          <Text style={styles.browseButtonText}>Посмотреть матчи</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Чаты</Text>
        <TouchableOpacity
          style={styles.newChatButton}
          onPress={handleNewChat}
        >
          <Text style={styles.newChatButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по имени..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Модальное окно нового чата */}
      <Modal
        visible={showNewChatModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNewChatModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Новый чат</Text>
            <Text style={styles.modalText}>
              Выберите пользователя для начала нового чата
            </Text>
            
            <View style={styles.demoMatches}>
              <TouchableOpacity
                style={styles.demoMatchItem}
                onPress={() => startNewChat('demo1')}
              >
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=20' }} style={styles.demoMatchAvatar} />
                <Text style={styles.demoMatchName}>Алиса, 22</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.demoMatchItem}
                onPress={() => startNewChat('demo2')}
              >
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=21' }} style={styles.demoMatchAvatar} />
                <Text style={styles.demoMatchName}>Виктория, 27</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowNewChatModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Закрыть</Text>
            </TouchableOpacity>
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
     </View>
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
  newChatButton: {
    backgroundColor: '#FF6B9D',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newChatButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  chatsList: {
    padding: 20,
  },
  chatItem: {
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
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  chatTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  messageTypeIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  matchDate: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  moreButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  moreButtonText: {
    fontSize: 20,
    color: '#8E8E93',
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
  demoMatches: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  demoMatchItem: {
    alignItems: 'center',
    padding: 15,
  },
  demoMatchAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  demoMatchName: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  modalCloseButton: {
    backgroundColor: '#8E8E93',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
  },
     modalCloseButtonText: {
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

export default ChatScreen;


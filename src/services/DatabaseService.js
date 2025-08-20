import sql from 'mssql';
import { dbConfig } from '../../database/db_config.js';

class DatabaseService {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }

  // Подключение к базе данных
  async connect() {
    try {
      if (!this.pool) {
        this.pool = await sql.connect(dbConfig);
        this.isConnected = true;
        console.log('✅ Подключение к базе данных установлено');
      }
      return this.pool;
    } catch (error) {
      console.error('❌ Ошибка подключения к базе данных:', error);
      throw error;
    }
  }

  // Отключение от базы данных
  async disconnect() {
    try {
      if (this.pool) {
        await this.pool.close();
        this.pool = null;
        this.isConnected = false;
        console.log('🔌 Отключение от базы данных выполнено');
      }
    } catch (error) {
      console.error('❌ Ошибка отключения от базы данных:', error);
    }
  }

  // Выполнение запроса
  async query(queryString, params = []) {
    try {
      const pool = await this.connect();
      const request = pool.request();
      
      // Добавление параметров
      params.forEach((param, index) => {
        request.input(`param${index}`, param.type, param.value);
      });
      
      const result = await request.query(queryString);
      return result.recordset;
    } catch (error) {
      console.error('❌ Ошибка выполнения запроса:', error);
      throw error;
    }
  }

  // Выполнение хранимой процедуры
  async executeStoredProcedure(procedureName, params = []) {
    try {
      const pool = await this.connect();
      const request = pool.request();
      
      // Добавление параметров
      params.forEach((param, index) => {
        request.input(`param${index}`, param.type, param.value);
      });
      
      const result = await request.execute(procedureName);
      return result.recordset;
    } catch (error) {
      console.error('❌ Ошибка выполнения хранимой процедуры:', error);
      throw error;
    }
  }

  // Получение пользователя по ID
  async getUserById(userId) {
    const query = `
      SELECT 
        u.UserId, u.Username, u.Email, u.Name, u.Age, u.Gender, 
        u.Bio, u.Location, u.Avatar, u.IsOnline, u.LastSeen,
        u.CreatedAt, u.UpdatedAt
      FROM Users u
      WHERE u.UserId = @param0 AND u.IsActive = 1
    `;
    
    const result = await this.query(query, [
      { type: sql.Int, value: userId }
    ]);
    
    if (result.length > 0) {
      const user = result[0];
      // Получение фотографий пользователя
      user.photos = await this.getUserPhotos(userId);
      // Получение интересов пользователя
      user.interests = await this.getUserInterests(userId);
      // Получение настроек пользователя
      user.settings = await this.getUserSettings(userId);
      
      return user;
    }
    
    return null;
  }

  // Получение пользователя по email
  async getUserByEmail(email) {
    const query = `
      SELECT UserId, Username, Email, PasswordHash, Name, Age, Gender, 
             Bio, Location, Avatar, IsOnline, LastSeen, CreatedAt, UpdatedAt
      FROM Users
      WHERE Email = @param0 AND IsActive = 1
    `;
    
    const result = await this.query(query, [
      { type: sql.NVarChar, value: email }
    ]);
    
    return result.length > 0 ? result[0] : null;
  }

  // Получение фотографий пользователя
  async getUserPhotos(userId) {
    const query = `
      SELECT PhotoId, PhotoUrl, IsMain, OrderIndex
      FROM UserPhotos
      WHERE UserId = @param0
      ORDER BY OrderIndex
    `;
    
    return await this.query(query, [
      { type: sql.Int, value: userId }
    ]);
  }

  // Получение интересов пользователя
  async getUserInterests(userId) {
    const query = `
      SELECT i.InterestId, i.Name, i.Category
      FROM UserInterests ui
      INNER JOIN Interests i ON ui.InterestId = i.InterestId
      WHERE ui.UserId = @param0
      ORDER BY i.Name
    `;
    
    return await this.query(query, [
      { type: sql.Int, value: userId }
    ]);
  }

  // Получение настроек пользователя
  async getUserSettings(userId) {
    const query = `
      SELECT MaxDistance, MinAge, MaxAge, ShowMen, ShowWomen, 
             Notifications, Privacy, UpdatedAt
      FROM UserSettings
      WHERE UserId = @param0
    `;
    
    const result = await this.query(query, [
      { type: sql.Int, value: userId }
    ]);
    
    return result.length > 0 ? result[0] : null;
  }

  // Получение профилей для просмотра
  async getProfilesForUser(userId, limit = 10) {
    const query = `
      SELECT 
        u.UserId, u.Name, u.Age, u.Gender, u.Bio, u.Location, 
        u.Avatar, u.IsOnline, u.LastSeen
      FROM Users u
      INNER JOIN UserSettings us ON u.UserId = us.UserId
      WHERE u.UserId != @param0 
        AND u.IsActive = 1
        AND u.Age BETWEEN 
          (SELECT MinAge FROM UserSettings WHERE UserId = @param0) 
          AND 
          (SELECT MaxAge FROM UserSettings WHERE UserId = @param0)
        AND u.Gender = CASE 
          WHEN (SELECT ShowMen FROM UserSettings WHERE UserId = @param0) = 1 
            AND (SELECT ShowWomen FROM UserSettings WHERE UserId = @param0) = 1 
          THEN u.Gender
          WHEN (SELECT ShowMen FROM UserSettings WHERE UserId = @param0) = 1 
          THEN 'Мужской'
          WHEN (SELECT ShowWomen FROM UserSettings WHERE UserId = @param0) = 1 
          THEN 'Женский'
          ELSE NULL
        END
        AND u.UserId NOT IN (
          SELECT ToUserId FROM Likes WHERE FromUserId = @param0
        )
      ORDER BY NEWID()
      OFFSET 0 ROWS FETCH NEXT @param1 ROWS ONLY
    `;
    
    const profiles = await this.query(query, [
      { type: sql.Int, value: userId },
      { type: sql.Int, value: limit }
    ]);
    
    // Добавление фотографий и интересов для каждого профиля
    for (let profile of profiles) {
      profile.photos = await this.getUserPhotos(profile.UserId);
      profile.interests = await this.getUserInterests(profile.UserId);
    }
    
    return profiles;
  }

  // Создание лайка
  async createLike(fromUserId, toUserId, likeType = 'like') {
    const query = `
      INSERT INTO Likes (FromUserId, ToUserId, LikeType, CreatedAt)
      VALUES (@param0, @param1, @param2, GETDATE())
    `;
    
    await this.query(query, [
      { type: sql.Int, value: fromUserId },
      { type: sql.Int, value: toUserId },
      { type: sql.NVarChar, value: likeType }
    ]);
    
    // Проверка на взаимный лайк (матч)
    const isMatch = await this.checkForMatch(fromUserId, toUserId);
    
    if (isMatch) {
      await this.createMatch(fromUserId, toUserId);
    }
    
    return { success: true, isMatch };
  }

  // Проверка на матч
  async checkForMatch(user1Id, user2Id) {
    const query = `
      SELECT COUNT(*) as count
      FROM Likes
      WHERE (FromUserId = @param0 AND ToUserId = @param1)
         OR (FromUserId = @param1 AND ToUserId = @param0)
    `;
    
    const result = await this.query(query, [
      { type: sql.Int, value: user1Id },
      { type: sql.Int, value: user2Id }
    ]);
    
    return result[0].count >= 2;
  }

  // Создание матча
  async createMatch(user1Id, user2Id) {
    const query = `
      INSERT INTO Matches (User1Id, User2Id, MatchedAt, IsActive)
      VALUES (@param0, @param1, GETDATE(), 1)
    `;
    
    await this.query(query, [
      { type: sql.Int, value: user1Id },
      { type: sql.Int, value: user2Id }
    ]);
    
    // Создание чата для матча
    const matchId = await this.getLastInsertedId('Matches', 'MatchId');
    await this.createChat(matchId);
  }

  // Создание чата
  async createChat(matchId) {
    const query = `
      INSERT INTO Chats (MatchId, CreatedAt, IsActive)
      VALUES (@param0, GETDATE(), 1)
    `;
    
    await this.query(query, [
      { type: sql.Int, value: matchId }
    ]);
  }

  // Получение матчей пользователя
  async getUserMatches(userId) {
    const query = `
      SELECT 
        m.MatchId, m.MatchedAt,
        u.UserId, u.Name, u.Age, u.Gender, u.Bio, u.Location, 
        u.Avatar, u.IsOnline, u.LastSeen
      FROM Matches m
      INNER JOIN Users u ON (
        CASE 
          WHEN m.User1Id = @param0 THEN m.User2Id
          ELSE m.User1Id
        END = u.UserId
      )
      WHERE (m.User1Id = @param0 OR m.User2Id = @param0)
        AND m.IsActive = 1
        AND u.IsActive = 1
      ORDER BY m.MatchedAt DESC
    `;
    
    const matches = await this.query(query, [
      { type: sql.Int, value: userId }
    ]);
    
    // Добавление фотографий и интересов для каждого матча
    for (let match of matches) {
      match.photos = await this.getUserPhotos(match.UserId);
      match.interests = await this.getUserInterests(match.UserId);
    }
    
    return matches;
  }

  // Получение чатов пользователя
  async getUserChats(userId) {
    const query = `
      SELECT 
        c.ChatId, c.CreatedAt,
        m.MatchId, m.MatchedAt,
        u.UserId, u.Name, u.Age, u.Gender, u.Bio, u.Location, 
        u.Avatar, u.IsOnline, u.LastSeen,
        (SELECT COUNT(*) FROM Messages WHERE ChatId = c.ChatId AND FromUserId != @param0 AND IsRead = 0) as UnreadCount,
        (SELECT TOP 1 MessageText FROM Messages WHERE ChatId = c.ChatId ORDER BY CreatedAt DESC) as LastMessage,
        (SELECT TOP 1 CreatedAt FROM Messages WHERE ChatId = c.ChatId ORDER BY CreatedAt DESC) as LastMessageTime
      FROM Chats c
      INNER JOIN Matches m ON c.MatchId = m.MatchId
      INNER JOIN Users u ON (
        CASE 
          WHEN m.User1Id = @param0 THEN m.User2Id
          ELSE m.User1Id
        END = u.UserId
      )
      WHERE (m.User1Id = @param0 OR m.User2Id = @param0)
        AND c.IsActive = 1
        AND m.IsActive = 1
        AND u.IsActive = 1
      ORDER BY c.CreatedAt DESC
    `;
    
    return await this.query(query, [
      { type: sql.Int, value: userId }
    ]);
  }

  // Получение сообщений чата
  async getChatMessages(chatId, limit = 50) {
    const query = `
      SELECT 
        m.MessageId, m.MessageText, m.MessageType, m.PhotoUrl, 
        m.IsRead, m.CreatedAt,
        u.UserId, u.Name, u.Avatar
      FROM Messages m
      INNER JOIN Users u ON m.FromUserId = u.UserId
      WHERE m.ChatId = @param0
      ORDER BY m.CreatedAt DESC
      OFFSET 0 ROWS FETCH NEXT @param1 ROWS ONLY
    `;
    
    const messages = await this.query(query, [
      { type: sql.Int, value: chatId },
      { type: sql.Int, value: limit }
    ]);
    
    return messages.reverse(); // Возвращаем в хронологическом порядке
  }

  // Отправка сообщения
  async sendMessage(chatId, fromUserId, messageText, messageType = 'text', photoUrl = null) {
    const query = `
      INSERT INTO Messages (ChatId, FromUserId, MessageText, MessageType, PhotoUrl, IsRead, CreatedAt)
      VALUES (@param0, @param1, @param2, @param3, @param4, 0, GETDATE())
    `;
    
    await this.query(query, [
      { type: sql.Int, value: chatId },
      { type: sql.Int, value: fromUserId },
      { type: sql.NVarChar, value: messageText },
      { type: sql.NVarChar, value: messageType },
      { type: sql.NVarChar, value: photoUrl }
    ]);
    
    return { success: true };
  }

  // Отметка сообщений как прочитанные
  async markMessagesAsRead(chatId, userId) {
    const query = `
      UPDATE Messages 
      SET IsRead = 1
      WHERE ChatId = @param0 AND FromUserId != @param1
    `;
    
    await this.query(query, [
      { type: sql.Int, value: chatId },
      { type: sql.Int, value: userId }
    ]);
    
    return { success: true };
  }

  // Получение ID последней вставленной записи
  async getLastInsertedId(tableName, idColumnName) {
    const query = `
      SELECT IDENT_CURRENT('${tableName}') as LastId
    `;
    
    const result = await this.query(query);
    return result[0].LastId;
  }

  // Обновление профиля пользователя
  async updateUserProfile(userId, profileData) {
    const query = `
      UPDATE Users 
      SET Name = @param0, Age = @param1, Bio = @param2, 
          Location = @param3, Avatar = @param4, UpdatedAt = GETDATE()
      WHERE UserId = @param5
    `;
    
    await this.query(query, [
      { type: sql.NVarChar, value: profileData.name },
      { type: sql.Int, value: profileData.age },
      { type: sql.NVarChar, value: profileData.bio },
      { type: sql.NVarChar, value: profileData.location },
      { type: sql.NVarChar, value: profileData.avatar },
      { type: sql.Int, value: userId }
    ]);
    
    return { success: true };
  }

  // Обновление настроек пользователя
  async updateUserSettings(userId, settings) {
    const query = `
      UPDATE UserSettings 
      SET MaxDistance = @param0, MinAge = @param1, MaxAge = @param2,
          ShowMen = @param3, ShowWomen = @param4, Notifications = @param5,
          Privacy = @param6, UpdatedAt = GETDATE()
      WHERE UserId = @param7
    `;
    
    await this.query(query, [
      { type: sql.Int, value: settings.maxDistance },
      { type: sql.Int, value: settings.minAge },
      { type: sql.Int, value: settings.maxAge },
      { type: sql.Bit, value: settings.showMen },
      { type: sql.Bit, value: settings.showWomen },
      { type: sql.Bit, value: settings.notifications },
      { type: sql.NVarChar, value: settings.privacy },
      { type: sql.Int, value: userId }
    ]);
    
    return { success: true };
  }

  // Обновление статуса онлайн
  async updateOnlineStatus(userId, isOnline) {
    const query = `
      UPDATE Users 
      SET IsOnline = @param0, LastSeen = GETDATE()
      WHERE UserId = @param1
    `;
    
    await this.query(query, [
      { type: sql.Bit, value: isOnline },
      { type: sql.Int, value: userId }
    ]);
    
    return { success: true };
  }
}

// Создание единственного экземпляра сервиса
const databaseService = new DatabaseService();

export default databaseService;


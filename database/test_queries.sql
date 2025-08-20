-- Тестовые SQL запросы для проверки работы базы данных
-- SQL Server 2008 R2

USE DatingApp;
GO

-- 1. Проверка количества записей в каждой таблице
PRINT '=== ПРОВЕРКА КОЛИЧЕСТВА ЗАПИСЕЙ ===';
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM Users
UNION ALL
SELECT 'UserPhotos', COUNT(*) FROM UserPhotos
UNION ALL
SELECT 'Interests', COUNT(*) FROM Interests
UNION ALL
SELECT 'UserInterests', COUNT(*) FROM UserInterests
UNION ALL
SELECT 'Likes', COUNT(*) FROM Likes
UNION ALL
SELECT 'Matches', COUNT(*) FROM Matches
UNION ALL
SELECT 'Chats', COUNT(*) FROM Chats
UNION ALL
SELECT 'Messages', COUNT(*) FROM Messages
UNION ALL
SELECT 'UserSettings', COUNT(*) FROM UserSettings;
GO

-- 2. Просмотр всех пользователей с их интересами
PRINT '=== ПОЛЬЗОВАТЕЛИ И ИХ ИНТЕРЕСЫ ===';
SELECT 
    u.UserId,
    u.Name,
    u.Age,
    u.Gender,
    u.Location,
    STRING_AGG(i.Name, ', ') as Interests
FROM Users u
LEFT JOIN UserInterests ui ON u.UserId = ui.UserId
LEFT JOIN Interests i ON ui.InterestId = i.InterestId
GROUP BY u.UserId, u.Name, u.Age, u.Gender, u.Location
ORDER BY u.Name;
GO

-- 3. Просмотр всех пользователей с их фотографиями
PRINT '=== ПОЛЬЗОВАТЕЛИ И ИХ ФОТОГРАФИИ ===';
SELECT 
    u.UserId,
    u.Name,
    u.Avatar,
    STRING_AGG(up.PhotoUrl, ' | ') as Photos
FROM Users u
LEFT JOIN UserPhotos up ON u.UserId = up.UserId
GROUP BY u.UserId, u.Name, u.Avatar
ORDER BY u.Name;
GO

-- 4. Просмотр всех лайков
PRINT '=== ВСЕ ЛАЙКИ ===';
SELECT 
    l.LikeId,
    u1.Name as FromUser,
    u2.Name as ToUser,
    l.LikeType,
    l.CreatedAt
FROM Likes l
INNER JOIN Users u1 ON l.FromUserId = u1.UserId
INNER JOIN Users u2 ON l.ToUserId = u2.UserId
ORDER BY l.CreatedAt DESC;
GO

-- 5. Просмотр всех матчей
PRINT '=== ВСЕ МАТЧИ ===';
SELECT 
    m.MatchId,
    u1.Name as User1,
    u2.Name as User2,
    m.MatchedAt
FROM Matches m
INNER JOIN Users u1 ON m.User1Id = u1.UserId
INNER JOIN Users u2 ON m.User2Id = u2.UserId
ORDER BY m.MatchedAt DESC;
GO

-- 6. Просмотр всех чатов с последними сообщениями
PRINT '=== ЧАТЫ С ПОСЛЕДНИМИ СООБЩЕНИЯМИ ===';
SELECT 
    c.ChatId,
    u1.Name as User1,
    u2.Name as User2,
    c.CreatedAt as ChatCreated,
    (SELECT TOP 1 MessageText FROM Messages WHERE ChatId = c.ChatId ORDER BY CreatedAt DESC) as LastMessage,
    (SELECT TOP 1 CreatedAt FROM Messages WHERE ChatId = c.ChatId ORDER BY CreatedAt DESC) as LastMessageTime
FROM Chats c
INNER JOIN Matches m ON c.MatchId = m.MatchId
INNER JOIN Users u1 ON m.User1Id = u1.UserId
INNER JOIN Users u2 ON m.User2Id = u2.UserId
ORDER BY c.CreatedAt DESC;
GO

-- 7. Просмотр всех сообщений в чате
PRINT '=== СООБЩЕНИЯ В ЧАТЕ ===';
SELECT 
    m.MessageId,
    u.Name as FromUser,
    m.MessageText,
    m.MessageType,
    m.IsRead,
    m.CreatedAt
FROM Messages m
INNER JOIN Users u ON m.FromUserId = u.UserId
WHERE m.ChatId = 1  -- Измените ID чата для просмотра других чатов
ORDER BY m.CreatedAt;
GO

-- 8. Поиск пользователей по интересам
PRINT '=== ПОИСК ПОЛЬЗОВАТЕЛЕЙ ПО ИНТЕРЕСАМ ===';
SELECT 
    u.Name,
    u.Age,
    u.Location,
    STRING_AGG(i.Name, ', ') as Interests
FROM Users u
INNER JOIN UserInterests ui ON u.UserId = ui.UserId
INNER JOIN Interests i ON ui.InterestId = i.InterestId
WHERE i.Name IN ('Путешествия', 'Спорт')  -- Измените интересы для поиска
GROUP BY u.Name, u.Age, u.Location
ORDER BY u.Name;
GO

-- 9. Статистика по лайкам
PRINT '=== СТАТИСТИКА ПО ЛАЙКАМ ===';
SELECT 
    u.Name,
    COUNT(l.LikeId) as LikesReceived,
    COUNT(CASE WHEN l.LikeType = 'superlike' THEN 1 END) as SuperLikesReceived
FROM Users u
LEFT JOIN Likes l ON u.UserId = l.ToUserId
GROUP BY u.Name
ORDER BY LikesReceived DESC;
GO

-- 10. Пользователи онлайн
PRINT '=== ПОЛЬЗОВАТЕЛИ ОНЛАЙН ===';
SELECT 
    Name,
    Age,
    Gender,
    Location,
    LastSeen
FROM Users
WHERE IsOnline = 1
ORDER BY LastSeen DESC;
GO

-- 11. Настройки пользователей
PRINT '=== НАСТРОЙКИ ПОЛЬЗОВАТЕЛЕЙ ===';
SELECT 
    u.Name,
    us.MaxDistance,
    us.MinAge,
    us.MaxAge,
    us.ShowMen,
    us.ShowWomen,
    us.Notifications,
    us.Privacy
FROM Users u
INNER JOIN UserSettings us ON u.UserId = us.UserId
ORDER BY u.Name;
GO

-- 12. Проверка взаимных лайков (потенциальные матчи)
PRINT '=== ПОТЕНЦИАЛЬНЫЕ МАТЧИ ===';
SELECT 
    u1.Name as User1,
    u2.Name as User2,
    l1.CreatedAt as Like1Time,
    l2.CreatedAt as Like2Time
FROM Likes l1
INNER JOIN Likes l2 ON l1.FromUserId = l2.ToUserId AND l1.ToUserId = l2.FromUserId
INNER JOIN Users u1 ON l1.FromUserId = u1.UserId
INNER JOIN Users u2 ON l1.ToUserId = u2.UserId
WHERE l1.FromUserId < l2.FromUserId  -- Избегаем дублирования
ORDER BY l1.CreatedAt DESC;
GO

-- 13. Количество непрочитанных сообщений для каждого пользователя
PRINT '=== НЕПРОЧИТАННЫЕ СООБЩЕНИЯ ===';
SELECT 
    u.Name,
    COUNT(m.MessageId) as UnreadMessages
FROM Users u
INNER JOIN Messages m ON u.UserId = m.FromUserId
WHERE m.IsRead = 0
GROUP BY u.Name
ORDER BY UnreadMessages DESC;
GO

-- 14. Топ интересов по популярности
PRINT '=== ТОП ИНТЕРЕСОВ ===';
SELECT 
    i.Name,
    i.Category,
    COUNT(ui.UserId) as UserCount
FROM Interests i
INNER JOIN UserInterests ui ON i.InterestId = ui.InterestId
GROUP BY i.Name, i.Category
ORDER BY UserCount DESC;
GO

-- 15. Активность пользователей по времени
PRINT '=== АКТИВНОСТЬ ПОЛЬЗОВАТЕЛЕЙ ===';
SELECT 
    u.Name,
    u.LastSeen,
    DATEDIFF(minute, u.LastSeen, GETDATE()) as MinutesAgo,
    CASE 
        WHEN DATEDIFF(minute, u.LastSeen, GETDATE()) < 5 THEN 'Сейчас онлайн'
        WHEN DATEDIFF(minute, u.LastSeen, GETDATE()) < 60 THEN 'Недавно'
        WHEN DATEDIFF(hour, u.LastSeen, GETDATE()) < 24 THEN 'Сегодня'
        ELSE 'Давно'
    END as ActivityStatus
FROM Users u
ORDER BY u.LastSeen DESC;
GO

PRINT '=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===';
GO


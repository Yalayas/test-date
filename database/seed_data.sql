-- Скрипт заполнения базы данных тестовыми данными
-- SQL Server 2008 R2

USE DatingApp;
GO

-- Очистка существующих данных
DELETE FROM [dbo].[Messages];
DELETE FROM [dbo].[Chats];
DELETE FROM [dbo].[Matches];
DELETE FROM [dbo].[Likes];
DELETE FROM [dbo].[UserInterests];
DELETE FROM [dbo].[UserPhotos];
DELETE FROM [dbo].[UserSettings];
DELETE FROM [dbo].[Users];
DELETE FROM [dbo].[Interests];

-- Сброс автоинкремента
DBCC CHECKIDENT ('Users', RESEED, 0);
DBCC CHECKIDENT ('Interests', RESEED, 0);
DBCC CHECKIDENT ('UserPhotos', RESEED, 0);
DBCC CHECKIDENT ('Likes', RESEED, 0);
DBCC CHECKIDENT ('Matches', RESEED, 0);
DBCC CHECKIDENT ('Chats', RESEED, 0);
DBCC CHECKIDENT ('Messages', RESEED, 0);

GO

-- Вставка интересов
INSERT INTO [dbo].[Interests] ([Name], [Category]) VALUES
('Путешествия', 'Активность'),
('Фотография', 'Творчество'),
('Музыка', 'Искусство'),
('Спорт', 'Активность'),
('Фитнес', 'Активность'),
('Природа', 'Активность'),
('Дизайн', 'Творчество'),
('Искусство', 'Творчество'),
('Кофе', 'Образ жизни'),
('Книги', 'Образ жизни'),
('Маркетинг', 'Профессия'),
('Блоггинг', 'Профессия'),
('Социальные сети', 'Технологии'),
('Творчество', 'Творчество'),
('Кулинария', 'Образ жизни'),
('Йога', 'Активность'),
('Танцы', 'Активность'),
('Кино', 'Развлечения'),
('Театр', 'Развлечения'),
('Волонтерство', 'Социальное');

GO

-- Вставка пользователей
INSERT INTO [dbo].[Users] ([Username], [Email], [PasswordHash], [Name], [Age], [Gender], [Bio], [Location], [Avatar], [IsOnline], [LastSeen]) VALUES
('anna25', 'anna@example.com', 'hashed_password_1', 'Анна', 25, 'Женский', 'Люблю путешествия, фотографию и хорошую музыку. Ищу интересного собеседника для долгих прогулок по городу.', 'Москва', 'https://i.pravatar.cc/150?img=1', 1, GETDATE()),
('maria28', 'maria@example.com', 'hashed_password_2', 'Мария', 28, 'Женский', 'Спортсменка, люблю активный образ жизни. Ищу единомышленника для совместных тренировок и приключений.', 'Санкт-Петербург', 'https://i.pravatar.cc/150?img=4', 0, DATEADD(hour, -2, GETDATE())),
('elena23', 'elena@example.com', 'hashed_password_3', 'Елена', 23, 'Женский', 'Студентка, учусь на дизайнера. Обожаю творчество, кофе и долгие разговоры о жизни.', 'Казань', 'https://i.pravatar.cc/150?img=7', 1, GETDATE()),
('olga26', 'olga@example.com', 'hashed_password_4', 'Ольга', 26, 'Женский', 'Маркетолог по профессии, блогер по призванию. Люблю делиться опытом и находить новые знакомства.', 'Новосибирск', 'https://i.pravatar.cc/150?img=10', 0, DATEADD(hour, -1, GETDATE())),
('alex27', 'alex@example.com', 'hashed_password_5', 'Алексей', 27, 'Мужской', 'Программист, увлекаюсь технологиями и путешествиями. Ищу девушку для серьезных отношений.', 'Москва', 'https://i.pravatar.cc/150?img=15', 1, GETDATE()),
('dmitry30', 'dmitry@example.com', 'hashed_password_6', 'Дмитрий', 30, 'Мужской', 'Предприниматель, люблю спорт и активный образ жизни. Ищу умную и красивую девушку.', 'Санкт-Петербург', 'https://i.pravatar.cc/150?img=18', 0, DATEADD(hour, -3, GETDATE())),
('sergey25', 'sergey@example.com', 'hashed_password_7', 'Сергей', 25, 'Мужской', 'Дизайнер, творческая личность. Обожаю искусство, музыку и хорошую компанию.', 'Казань', 'https://i.pravatar.cc/150?img=20', 1, GETDATE()),
('vladimir29', 'vladimir@example.com', 'hashed_password_8', 'Владимир', 29, 'Мужской', 'Врач, заботливый и ответственный. Ищу девушку для создания семьи.', 'Новосибирск', 'https://i.pravatar.cc/150?img=22', 0, DATEADD(hour, -4, GETDATE()));

GO

-- Вставка фотографий пользователей
INSERT INTO [dbo].[UserPhotos] ([UserId], [PhotoUrl], [IsMain], [OrderIndex]) VALUES
(1, 'https://i.pravatar.cc/300?img=1', 1, 1),
(1, 'https://i.pravatar.cc/300?img=2', 0, 2),
(1, 'https://i.pravatar.cc/300?img=3', 0, 3),
(2, 'https://i.pravatar.cc/300?img=4', 1, 1),
(2, 'https://i.pravatar.cc/300?img=5', 0, 2),
(3, 'https://i.pravatar.cc/300?img=7', 1, 1),
(3, 'https://i.pravatar.cc/300?img=8', 0, 2),
(3, 'https://i.pravatar.cc/300?img=9', 0, 3),
(4, 'https://i.pravatar.cc/300?img=10', 1, 1),
(4, 'https://i.pravatar.cc/300?img=11', 0, 2),
(4, 'https://i.pravatar.cc/300?img=12', 0, 3),
(5, 'https://i.pravatar.cc/300?img=15', 1, 1),
(5, 'https://i.pravatar.cc/300?img=16', 0, 2),
(6, 'https://i.pravatar.cc/300?img=18', 1, 1),
(6, 'https://i.pravatar.cc/300?img=19', 0, 2),
(7, 'https://i.pravatar.cc/300?img=20', 1, 1),
(7, 'https://i.pravatar.cc/300?img=21', 0, 2),
(8, 'https://i.pravatar.cc/300?img=22', 1, 1),
(8, 'https://i.pravatar.cc/300?img=23', 0, 2);

GO

-- Вставка интересов пользователей
INSERT INTO [dbo].[UserInterests] ([UserId], [InterestId]) VALUES
(1, 1), (1, 2), (1, 3), (1, 14), -- Анна: Путешествия, Фотография, Музыка, Искусство
(2, 4), (2, 5), (2, 6), (2, 1), -- Мария: Спорт, Фитнес, Природа, Путешествия
(3, 7), (3, 8), (3, 9), (3, 10), -- Елена: Дизайн, Искусство, Кофе, Книги
(4, 11), (4, 12), (4, 13), (4, 14), -- Ольга: Маркетинг, Блоггинг, Социальные сети, Творчество
(5, 1), (5, 13), (5, 15), (5, 16), -- Алексей: Путешествия, Социальные сети, Кулинария, Йога
(6, 4), (6, 5), (6, 17), (6, 18), -- Дмитрий: Спорт, Фитнес, Танцы, Кино
(7, 7), (7, 8), (7, 3), (7, 19), -- Сергей: Дизайн, Искусство, Музыка, Театр
(8, 20), (8, 9), (8, 10), (8, 15); -- Владимир: Волонтерство, Кофе, Книги, Кулинария

GO

-- Вставка настроек пользователей
INSERT INTO [dbo].[UserSettings] ([UserId], [MaxDistance], [MinAge], [MaxAge], [ShowMen], [ShowWomen], [Notifications], [Privacy]) VALUES
(1, 50, 23, 35, 1, 0, 1, 'public'),
(2, 30, 25, 35, 1, 0, 1, 'public'),
(3, 40, 20, 30, 1, 0, 1, 'public'),
(4, 60, 22, 32, 1, 0, 1, 'public'),
(5, 50, 20, 30, 0, 1, 1, 'public'),
(6, 40, 22, 35, 0, 1, 1, 'public'),
(7, 35, 20, 28, 0, 1, 1, 'public'),
(8, 45, 23, 32, 0, 1, 1, 'public');

GO

-- Вставка лайков
INSERT INTO [dbo].[Likes] ([FromUserId], [ToUserId], [LikeType]) VALUES
(1, 5, 'like'),
(5, 1, 'like'),
(2, 6, 'superlike'),
(6, 2, 'like'),
(3, 7, 'like'),
(7, 3, 'like'),
(4, 8, 'like'),
(8, 4, 'superlike'),
(1, 6, 'like'),
(2, 5, 'like'),
(3, 8, 'like'),
(4, 7, 'like');

GO

-- Вставка матчей
INSERT INTO [dbo].[Matches] ([User1Id], [User2Id], [MatchedAt]) VALUES
(1, 5, DATEADD(day, -2, GETDATE())),
(2, 6, DATEADD(day, -1, GETDATE())),
(3, 7, DATEADD(day, -3, GETDATE())),
(4, 8, DATEADD(day, -1, GETDATE()));

GO

-- Вставка чатов
INSERT INTO [dbo].[Chats] ([MatchId], [CreatedAt]) VALUES
(1, DATEADD(day, -2, GETDATE())),
(2, DATEADD(day, -1, GETDATE())),
(3, DATEADD(day, -3, GETDATE())),
(4, DATEADD(day, -1, GETDATE()));

GO

-- Вставка сообщений
INSERT INTO [dbo].[Messages] ([ChatId], [FromUserId], [MessageText], [MessageType], [IsRead], [CreatedAt]) VALUES
(1, 1, 'Привет! Как дела?', 'text', 1, DATEADD(minute, -120, GETDATE())),
(1, 5, 'Привет! Все хорошо, спасибо! А у тебя как?', 'text', 1, DATEADD(minute, -115, GETDATE())),
(1, 1, 'Отлично! Ты мне очень понравился 😊', 'text', 1, DATEADD(minute, -110, GETDATE())),
(1, 5, 'Спасибо! Ты тоже очень симпатичная!', 'text', 1, DATEADD(minute, -105, GETDATE())),
(2, 2, 'Привет! Спасибо за супер лайк! ⭐', 'text', 1, DATEADD(minute, -60, GETDATE())),
(2, 6, 'Привет! Рад, что понравился!', 'text', 1, DATEADD(minute, -55, GETDATE())),
(2, 2, 'Отличная идея! Давайте встретимся', 'text', 0, DATEADD(minute, -50, GETDATE())),
(3, 3, 'Спасибо за лайк! 😊', 'text', 1, DATEADD(minute, -180, GETDATE())),
(3, 7, 'Пожалуйста! Ты очень красивая!', 'text', 1, DATEADD(minute, -175, GETDATE())),
(4, 4, 'Ты мне очень понравился!', 'text', 1, DATEADD(minute, -90, GETDATE())),
(4, 8, 'Спасибо! Ты тоже очень привлекательная!', 'text', 1, DATEADD(minute, -85, GETDATE())),
(4, 4, 'Фото 📸', 'photo', 0, DATEADD(minute, -80, GETDATE()));

GO

PRINT 'База данных успешно заполнена тестовыми данными!';
GO

-- Проверка данных
SELECT 'Users' as TableName, COUNT(*) as RecordCount FROM [dbo].[Users]
UNION ALL
SELECT 'UserPhotos', COUNT(*) FROM [dbo].[UserPhotos]
UNION ALL
SELECT 'Interests', COUNT(*) FROM [dbo].[Interests]
UNION ALL
SELECT 'UserInterests', COUNT(*) FROM [dbo].[UserInterests]
UNION ALL
SELECT 'Likes', COUNT(*) FROM [dbo].[Likes]
UNION ALL
SELECT 'Matches', COUNT(*) FROM [dbo].[Matches]
UNION ALL
SELECT 'Chats', COUNT(*) FROM [dbo].[Chats]
UNION ALL
SELECT 'Messages', COUNT(*) FROM [dbo].[Messages]
UNION ALL
SELECT 'UserSettings', COUNT(*) FROM [dbo].[UserSettings];

GO


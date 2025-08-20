-- Скрипт создания базы данных для приложения знакомств
-- SQL Server 2008 R2
-- Сервер: DESKTOP-0S7BADL\SQLEXPRESS
-- Логин: sa
-- Пароль: 123

USE master;
GO

-- Создание базы данных
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'DatingApp')
BEGIN
    CREATE DATABASE DatingApp
    ON PRIMARY (
        NAME = 'DatingApp_Data',
        FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\DATA\DatingApp_Data.mdf',
        SIZE = 10MB,
        MAXSIZE = UNLIMITED,
        FILEGROWTH = 10%
    )
    LOG ON (
        NAME = 'DatingApp_Log',
        FILENAME = 'C:\Program Files\Microsoft SQL Server\MSSQL10.SQLEXPRESS\MSSQL\DATA\DatingApp_Log.ldf',
        SIZE = 5MB,
        MAXSIZE = UNLIMITED,
        FILEGROWTH = 10%
    );
END
GO

USE DatingApp;
GO

-- Создание таблицы пользователей
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users](
        [UserId] [int] IDENTITY(1,1) NOT NULL,
        [Username] [nvarchar](50) NOT NULL,
        [Email] [nvarchar](100) NOT NULL,
        [PasswordHash] [nvarchar](255) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [Age] [int] NOT NULL,
        [Gender] [nvarchar](10) NOT NULL,
        [Bio] [nvarchar](500) NULL,
        [Location] [nvarchar](100) NULL,
        [Avatar] [nvarchar](500) NULL,
        [IsOnline] [bit] NOT NULL DEFAULT 0,
        [LastSeen] [datetime] NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [IsActive] [bit] NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC)
    );
END
GO

-- Создание таблицы фотографий пользователей
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserPhotos]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserPhotos](
        [PhotoId] [int] IDENTITY(1,1) NOT NULL,
        [UserId] [int] NOT NULL,
        [PhotoUrl] [nvarchar](500) NOT NULL,
        [IsMain] [bit] NOT NULL DEFAULT 0,
        [OrderIndex] [int] NOT NULL DEFAULT 0,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_UserPhotos] PRIMARY KEY CLUSTERED ([PhotoId] ASC),
        CONSTRAINT [FK_UserPhotos_Users] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Создание таблицы интересов
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Interests]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Interests](
        [InterestId] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [Category] [nvarchar](50) NULL,
        CONSTRAINT [PK_Interests] PRIMARY KEY CLUSTERED ([InterestId] ASC)
    );
END
GO

-- Создание таблицы связи пользователей и интересов
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserInterests]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserInterests](
        [UserId] [int] NOT NULL,
        [InterestId] [int] NOT NULL,
        CONSTRAINT [PK_UserInterests] PRIMARY KEY CLUSTERED ([UserId] ASC, [InterestId] ASC),
        CONSTRAINT [FK_UserInterests_Users] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([UserId]),
        CONSTRAINT [FK_UserInterests_Interests] FOREIGN KEY([InterestId]) REFERENCES [dbo].[Interests] ([InterestId])
    );
END
GO

-- Создание таблицы лайков
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Likes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Likes](
        [LikeId] [int] IDENTITY(1,1) NOT NULL,
        [FromUserId] [int] NOT NULL,
        [ToUserId] [int] NOT NULL,
        [LikeType] [nvarchar](20) NOT NULL DEFAULT 'like', -- like, superlike
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Likes] PRIMARY KEY CLUSTERED ([LikeId] ASC),
        CONSTRAINT [FK_Likes_FromUsers] FOREIGN KEY([FromUserId]) REFERENCES [dbo].[Users] ([UserId]),
        CONSTRAINT [FK_Likes_ToUsers] FOREIGN KEY([ToUserId]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Создание таблицы матчей
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Matches]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Matches](
        [MatchId] [int] IDENTITY(1,1) NOT NULL,
        [User1Id] [int] NOT NULL,
        [User2Id] [int] NOT NULL,
        [MatchedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [IsActive] [bit] NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Matches] PRIMARY KEY CLUSTERED ([MatchId] ASC),
        CONSTRAINT [FK_Matches_User1] FOREIGN KEY([User1Id]) REFERENCES [dbo].[Users] ([UserId]),
        CONSTRAINT [FK_Matches_User2] FOREIGN KEY([User2Id]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Создание таблицы чатов
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Chats]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Chats](
        [ChatId] [int] IDENTITY(1,1) NOT NULL,
        [MatchId] [int] NOT NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [IsActive] [bit] NOT NULL DEFAULT 1,
        CONSTRAINT [PK_Chats] PRIMARY KEY CLUSTERED ([ChatId] ASC),
        CONSTRAINT [FK_Chats_Matches] FOREIGN KEY([MatchId]) REFERENCES [dbo].[Matches] ([MatchId])
    );
END
GO

-- Создание таблицы сообщений
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Messages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Messages](
        [MessageId] [int] IDENTITY(1,1) NOT NULL,
        [ChatId] [int] NOT NULL,
        [FromUserId] [int] NOT NULL,
        [MessageText] [nvarchar](1000) NULL,
        [MessageType] [nvarchar](20) NOT NULL DEFAULT 'text', -- text, photo, emoji
        [PhotoUrl] [nvarchar](500) NULL,
        [IsRead] [bit] NOT NULL DEFAULT 0,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED ([MessageId] ASC),
        CONSTRAINT [FK_Messages_Chats] FOREIGN KEY([ChatId]) REFERENCES [dbo].[Chats] ([ChatId]),
        CONSTRAINT [FK_Messages_Users] FOREIGN KEY([FromUserId]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Создание таблицы настроек пользователей
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UserSettings]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[UserSettings](
        [UserId] [int] NOT NULL,
        [MaxDistance] [int] NOT NULL DEFAULT 50,
        [MinAge] [int] NOT NULL DEFAULT 18,
        [MaxAge] [int] NOT NULL DEFAULT 100,
        [ShowMen] [bit] NOT NULL DEFAULT 1,
        [ShowWomen] [bit] NOT NULL DEFAULT 1,
        [Notifications] [bit] NOT NULL DEFAULT 1,
        [Privacy] [nvarchar](20) NOT NULL DEFAULT 'public',
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_UserSettings] PRIMARY KEY CLUSTERED ([UserId] ASC),
        CONSTRAINT [FK_UserSettings_Users] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Создание индексов для улучшения производительности
CREATE NONCLUSTERED INDEX [IX_Users_Email] ON [dbo].[Users] ([Email]);
CREATE NONCLUSTERED INDEX [IX_Users_Username] ON [dbo].[Users] ([Username]);
CREATE NONCLUSTERED INDEX [IX_Likes_FromUserId] ON [dbo].[Likes] ([FromUserId]);
CREATE NONCLUSTERED INDEX [IX_Likes_ToUserId] ON [dbo].[Likes] ([ToUserId]);
CREATE NONCLUSTERED INDEX [IX_Matches_User1Id] ON [dbo].[Matches] ([User1Id]);
CREATE NONCLUSTERED INDEX [IX_Matches_User2Id] ON [dbo].[Matches] ([User2Id]);
CREATE NONCLUSTERED INDEX [IX_Messages_ChatId] ON [dbo].[Messages] ([ChatId]);
CREATE NONCLUSTERED INDEX [IX_Messages_CreatedAt] ON [dbo].[Messages] ([CreatedAt]);

GO

PRINT 'База данных DatingApp успешно создана!';
GO


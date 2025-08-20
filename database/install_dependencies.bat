@echo off
echo Установка зависимостей для работы с базой данных...
echo.

echo Устанавливаем mssql пакет...
npm install mssql

echo.
echo Устанавливаем bcrypt для хеширования паролей...
npm install bcrypt

echo.
echo Устанавливаем dotenv для переменных окружения...
npm install dotenv

echo.
echo Зависимости установлены!
echo.
echo Теперь вы можете:
echo 1. Создать базу данных, выполнив create_database.sql
echo 2. Заполнить тестовыми данными, выполнив seed_data.sql
echo 3. Использовать DatabaseService в вашем приложении
echo.
pause


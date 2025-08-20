Write-Host "Установка зависимостей для работы с базой данных..." -ForegroundColor Green
Write-Host ""

Write-Host "Устанавливаем mssql пакет..." -ForegroundColor Yellow
npm install mssql

Write-Host ""
Write-Host "Устанавливаем bcrypt для хеширования паролей..." -ForegroundColor Yellow
npm install bcrypt

Write-Host ""
Write-Host "Устанавливаем dotenv для переменных окружения..." -ForegroundColor Yellow
npm install dotenv

Write-Host ""
Write-Host "Зависимости установлены!" -ForegroundColor Green
Write-Host ""
Write-Host "Теперь вы можете:" -ForegroundColor Cyan
Write-Host "1. Создать базу данных, выполнив create_database.sql" -ForegroundColor White
Write-Host "2. Заполнить тестовыми данными, выполнив seed_data.sql" -ForegroundColor White
Write-Host "3. Использовать DatabaseService в вашем приложении" -ForegroundColor White
Write-Host ""
Write-Host "Нажмите любую клавишу для продолжения..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


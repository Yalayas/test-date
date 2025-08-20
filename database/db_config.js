// Конфигурация подключения к базе данных SQL Server 2008 R2
const dbConfig = {
  server: 'DESKTOP-0S7BADL\\SQLEXPRESS',
  database: 'DatingApp',
  user: 'sa',
  password: '123',
  options: {
    encrypt: false, // Для SQL Server 2008 R2 отключаем шифрование
    trustServerCertificate: true,
    enableArithAbort: true,
    instanceName: 'SQLEXPRESS',
    port: 1433, // Стандартный порт SQL Server
    connectionTimeout: 30000,
    requestTimeout: 30000,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  }
};

// Строка подключения для различных библиотек
const connectionStrings = {
  // Для mssql (Node.js)
  mssql: `Server=${dbConfig.server};Database=${dbConfig.database};User Id=${dbConfig.user};Password=${dbConfig.password};TrustServerCertificate=true;Encrypt=false;`,
  
  // Для ADO.NET
  adoNet: `Server=${dbConfig.server};Database=${dbConfig.database};User Id=${dbConfig.user};Password=${dbConfig.password};TrustServerCertificate=true;Encrypt=false;`,
  
  // Для Entity Framework
  entityFramework: `Data Source=${dbConfig.server};Initial Catalog=${dbConfig.database};User ID=${dbConfig.user};Password=${dbConfig.password};TrustServerCertificate=true;Encrypt=false;`,
  
  // Для ODBC
  odbc: `Driver={SQL Server};Server=${dbConfig.server};Database=${dbConfig.database};UID=${dbConfig.user};PWD=${dbConfig.password};TrustServerCertificate=true;Encrypt=false;`
};

module.exports = {
  dbConfig,
  connectionStrings
};


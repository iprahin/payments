"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
exports.testConnection = testConnection;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const logFilePath = path_1.default.join(__dirname, '..', '../logs', 'sequelize-sql.log');
// Функция логирования в файл
function logToFile(msg) {
    fs_1.default.appendFile(logFilePath, `${new Date().toISOString()} - ${msg}\n`, (err) => {
        if (err)
            console.error('Ошибка записи в лог файл:', err);
    });
}
exports.sequelize = new sequelize_1.Sequelize({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    //logging: false, // Отключаем логи SQL в консоль
    logging: logToFile,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
async function testConnection() {
    try {
        await exports.sequelize.authenticate();
        console.log('✅ Database connection established');
    }
    catch (error) {
        console.error('❌ Unable to connect to database:', error);
        process.exit(1);
    }
}

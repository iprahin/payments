import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const d = new Date();
const _date = `${d.getFullYear()}_${d.getMonth()}_${d.getDay()}`;

const logFilePath = path.join(__dirname, '..', '../logs', `sequelize-sql-${_date}.log`);

function logToFile(msg: string) {
  fs.appendFile(logFilePath, `${new Date().toISOString()} - ${msg}\n`, (err) => {
    if (err) console.error('Ошибка записи в лог файл:', err);
  });
}


export const sequelize = new Sequelize({
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


export async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Unable to connect to database:', error);
    process.exit(1);
  }
}

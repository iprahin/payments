import express from 'express';
import dotenv from 'dotenv';
import app from './app';
import { sequelize, testConnection } from './config/database';
//import { User, Order, LedgerEntry } from './models';
//import { OrderController } from './controllers/OrderController';
//import { UserController } from './controllers/UserController';


import { UserStatus } from './models/User';

dotenv.config();

//const app = express();
const PORT = process.env.PORT || 3000;

//app.use(express.json());

//const orderController = new OrderController();
//const userController = new UserController();
/*
app.post('/orders', orderController.createOrder);
app.get('/orders/:userId', orderController.fetchOrders);


app.all('/fetch_users_list', userController.fetchUsersList);
app.get('/user/:userId', userController.fetchUserById)

app.post('/user_add_money', userController.addMoneyToUserBalance);
*/


async function startServer() {
    try {
        await testConnection();

        await sequelize.sync({ alter: true });


        // Синхронизация моделей с БД (создание таблиц)
        /*
        await sequelize.sync({ alter: true }); // alter: true обновит структуру
        console.log('✅ Database synchronized');

        // Создание тестового пользователя (если не существует)
        const [testUser] = await User.findOrCreate({
                                where: { email: 'test1@example.com', status: UserStatus.ACTIVE },
                                defaults: { balance: 2000, email: 'test1@example.com', status: UserStatus.ACTIVE }
                                });

        console.log(`✅ Test user: ${testUser.email}, balance: ${testUser.balance}`);
        */

        const _server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });

        _server.on('error', (error: NodeJS.ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Порт ${PORT} уже занят!`);
            } else {
                console.error(`❌ Ошибка при запуске сервера:`, error);
            }
            process.exit(1);
        });


    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();


process.on('uncaughtException', function (err) {
  console.error('❌ Uncaught Exception:', err);
});

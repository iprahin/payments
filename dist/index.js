"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const OrderController_1 = require("./controllers/OrderController");
const UserController_1 = require("./controllers/UserController");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const orderController = new OrderController_1.OrderController();
const userController = new UserController_1.UserController();
app.post('/orders', orderController.createOrder);
app.get('/orders/:userId', orderController.fetchOrders);
app.all('/fetch_users_list', userController.fetchUsersList);
app.get('/user/:userId', userController.fetchUserById);
app.post('/user_add_money', userController.addMoneyToUserBalance);
app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});
async function startServer() {
    try {
        await (0, database_1.testConnection)();
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
        _server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Порт ${PORT} уже занят!`);
            }
            else {
                console.error(`❌ Ошибка при запуске сервера:`, error);
            }
            process.exit(1);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
process.on('uncaughtException', function (err) {
    console.error('❌ Uncaught Exception:', err);
});

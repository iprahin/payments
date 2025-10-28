import express from 'express';
import { OrderController } from './controllers/OrderController';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/auth/AuthController';

const app = express();

app.use(express.json());

const orderController = new OrderController();
const userController = new UserController();
const authController = new AuthController();

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


//auth
app.post('/register', authController.register);
app.post('/login', authController.login);



app.post('/orders', orderController.createOrder);
app.get('/orders/:userId', orderController.fetchOrders);


app.all('/fetch_users_list', userController.fetchUsersList);
app.get('/user/:userId', userController.fetchUserById)

app.post('/user_add_money', userController.addMoneyToUserBalance);







export default app;

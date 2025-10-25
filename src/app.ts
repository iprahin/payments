import express from 'express';
import { OrderController } from './controllers/OrderController';
import { UserController } from './controllers/UserController';


const app = express();

app.use(express.json());

const orderController = new OrderController();
const userController = new UserController();


app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/orders', orderController.createOrder);
app.get('/orders/:userId', orderController.fetchOrders);


app.all('/fetch_users_list', userController.fetchUsersList);
app.get('/user/:userId', userController.fetchUserById)

app.post('/user_add_money', userController.addMoneyToUserBalance);







export default app;

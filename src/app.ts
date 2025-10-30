import express from 'express';
import { OrderController } from './controllers/OrderController';
import { UserController } from './controllers/UserController';
import { AuthController } from './controllers/auth/AuthController';
import { authenticateToken, requireOwnership, requireRole } from './middleware/auth.middleware';

import cookieParser from 'cookie-parser';
import { UserRolesTypes } from './models/UserRoles';

const app = express();

app.use(express.json());
app.use(cookieParser());


const orderController = new OrderController();
const userController = new UserController();
const authController = new AuthController();

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});


//auth
app.post('/register', authController.register);
app.post('/login', authController.login);

app.all('/logout', authController.logout);
app.post('/refresh', authController.refreshToken);


app.post('/orders', authenticateToken, orderController.createOrder);
app.get('/orders/:userId', authenticateToken, 
                          requireOwnership, 
                          
                          orderController.fetchOrders);


app.all('/fetch_users_list', authenticateToken, 
                            requireRole(UserRolesTypes.ADMIN),
  
                            userController.fetchUsersList);

app.get('/user/:userId', authenticateToken, userController.fetchUserById)

app.post('/user_add_money', authenticateToken, 
                          requireRole(UserRolesTypes.ADMIN,
                                    UserRolesTypes.MANAGER),
  
                          userController.addMoneyToUserBalance);







export default app;

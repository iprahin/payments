"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const OrderService_1 = require("../services/OrderService");
const ErrorService_1 = require("../services/ErrorService");
class OrderController {
    orderService;
    constructor() {
        this.orderService = new OrderService_1.OrderService();
    }
    createOrder = async (req, res) => {
        try {
            const { userId, amount, idempotencyKey } = req.body;
            if (!userId || !amount || !idempotencyKey) {
                res.status(400).json({
                    error: 'Отсутствуют обязательные поля: userId, amount, idempotencyKey'
                });
                return;
            }
            if (amount <= 0) {
                res.status(400).json({
                    error: 'Сумма должна быть больше 0'
                });
                return;
            }
            const result = await this.orderService.createOrderWithPayment({
                userId: Number(userId),
                amount: Number(amount),
                idempotencyKey: String(idempotencyKey)
            });
            res.status(201).json({
                success: true,
                data: result
            });
        }
        catch (error) {
            if (error instanceof ErrorService_1.InsufficientBalanceError) {
                res.status(400).json({
                    error: error.message
                });
                return;
            }
            if (error instanceof ErrorService_1.UserNotFoundError) {
                res.status(404).json({
                    error: error.message
                });
                return;
            }
            if (error instanceof ErrorService_1.DuplicateKeyError) {
                res.status(409).json({
                    error: error.message
                });
                return;
            }
            console.error('Ошибка при создании заказа:', error);
            res.status(500).json({
                error: 'Внутренняя ошибка сервера'
            });
        }
    };
    fetchOrders = async (req, res) => {
        try {
            const { userId } = req.params;
            const orders = await this.orderService.fetchOrdersByUserId(Number(userId));
            res.status(200).json({
                success: true,
                data: orders
            });
        }
        catch (error) {
            console.error('Ошибка при получении заказов!', error);
            res.status(500).json({
                error: 'Internal error'
            });
        }
    };
}
exports.OrderController = OrderController;

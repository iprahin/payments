"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const models_1 = require("../models");
const Order_1 = require("../models/Order");
const LedgerEntry_1 = require("../models/LedgerEntry");
const ErrorService_1 = require("./ErrorService");
class OrderService {
    async createOrderWithPayment(input) {
        const { userId, amount, idempotencyKey } = input;
        const existingOrder = await models_1.Order.findOne({
            where: { idempotencyKey }
        });
        if (existingOrder) {
            const _user = await models_1.User.findByPk(userId);
            if (!_user)
                throw new ErrorService_1.UserNotFoundError(userId);
            return {
                orderId: existingOrder.id,
                status: existingOrder.status,
                newBalance: Number(_user.balance)
            };
        }
        return await database_1.sequelize.transaction({
            isolationLevel: sequelize_1.Transaction.ISOLATION_LEVELS.READ_COMMITTED
        }, async (t) => {
            const _user = await models_1.User.findByPk(userId, {
                lock: sequelize_1.Transaction.LOCK.UPDATE,
                transaction: t
            });
            if (!_user)
                throw new ErrorService_1.UserNotFoundError(userId);
            const currentBalance = Number(_user.balance);
            if (currentBalance < amount)
                throw new ErrorService_1.InsufficientBalanceError(amount, currentBalance);
            const _order = await models_1.Order.create({
                userId: userId,
                amount: amount,
                status: Order_1.OrderStatus.PENDING,
                idempotencyKey
            }, { transaction: t });
            const newBalance = currentBalance - amount;
            await _user.update({
                balance: newBalance
            }, { transaction: t });
            await models_1.LedgerEntry.create({
                orderId: _order.id,
                userId: userId,
                amount: -amount,
                type: LedgerEntry_1.LedgerEntryType.DEBIT,
                description: `Оплата заказа #${_order.id}`
            }, { transaction: t });
            //получение оплаты от клиента. Переделать!
            await models_1.LedgerEntry.create({
                orderId: _order.id,
                userId: 0,
                amount: amount,
                type: LedgerEntry_1.LedgerEntryType.CREDIT,
                description: `Получение оплаты за заказ #${_order.id}`
            }, { transaction: t });
            await _order.update({
                status: Order_1.OrderStatus.COMPLETED
            }, { transaction: t });
            return {
                orderId: _order.id,
                status: Order_1.OrderStatus.COMPLETED,
                newBalance
            };
        });
    }
    async fetchOrdersByUserId(userId) {
        return await models_1.Order.findAll({
            where: { userId },
            include: [
                {
                    model: models_1.LedgerEntry,
                    as: 'ledgerEntries'
                }
            ],
            order: [['createdAt', 'DESC']]
        });
    }
    async fetchOrderById(orderId) {
        return await models_1.Order.findByPk(orderId);
    }
}
exports.OrderService = OrderService;

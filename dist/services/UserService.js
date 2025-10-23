"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
const models_1 = require("../models");
const User_1 = require("../models/User");
const ErrorService_1 = require("./ErrorService");
class UserService {
    async addMoneyToUserBalance(input) {
        const { userId, amount } = input;
        if (amount <= 0)
            throw new ErrorService_1.ZeroEmptyAmount(amount);
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
            const newBalance = currentBalance + amount;
            await _user.update({ balance: newBalance }, { transaction: t });
            return {
                userId,
                newBalance
            };
        });
    }
    /*

import { fn, col } from 'sequelize';

async function getTotalDebitAmountForUser(userId: number) {
  const result = await LedgerEntry.findOne({
    where: {
      userId,
      type: LedgerEntryType.DEBIT
    },
    attributes: [
      [fn('SUM', col('amount')), 'totalDebitAmount']
    ],
    raw: true
  });

  return Number(result?.totalDebitAmount) || 0;
}


mport { Order, User } from '../models';

async function getUserOrdersWithEmail(userId: number) {
  const orders = await Order.findAll({
    where: { userId },
    include: [
      {
        model: User,          // Связанный моделью User
        as: 'user',           // alias из определения связи (Order.belongsTo(User, { as: 'user' }))
        attributes: ['email'] // Выбираем только email для вложенного объекта
      }
    ],
    attributes: ['id', 'amount', 'status', 'createdAt'], // Заказы с нужными полями
    order: [['createdAt', 'DESC']]
  });

  return orders.map(order => ({
    id: order.id,
    amount: order.amount,
    status: order.status,
    createdAt: order.createdAt,
    userEmail: order.user?.email
  }));
}



    */
    //fetch users list
    async fetchUsersList() {
        return await models_1.User.findAll({
            where: { status: User_1.UserStatus.ACTIVE },
            limit: 10,
            order: [['createdAt', 'DESC']]
        });
    }
    //fetch user by id
    async fetchUserById(userId) {
        return await models_1.User.findByPk(userId);
    }
}
exports.UserService = UserService;

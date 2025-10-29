import { Transaction } from "sequelize";
import { sequelize } from "../config/database";
import { User, Order, LedgerEntry } from '../models';
import { UserStatus } from "../models/User";
import { UserNotFoundError, ZeroEmptyAmount } from "./ErrorService";

interface AddMoneyInput {
    userId: number;
    amount: number;
}

interface AddMoneyOutput {
    userId: number;
    newBalance: number;
}

export interface UserPayload {
  id: number; 
  email: string;
  roles?: number[]
}

export interface UserTokens {
  accessToken: string;
  refreshToken: string;
}



export class UserService {

    async addMoneyToUserBalance(input: AddMoneyInput): Promise<AddMoneyOutput> {
        const { userId, amount } = input;

        if(amount <= 0)
            throw new ZeroEmptyAmount(amount);

        return await sequelize.transaction(
            {
                isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
            },
            async (t: Transaction) => {
                const _user = await User.findByPk(userId, {
                    lock: Transaction.LOCK.UPDATE,
                    transaction: t
                });

                if(!_user)
                    throw new UserNotFoundError(userId);

                const currentBalance = Number(_user.balance);
                const newBalance = currentBalance + amount;

                await _user.update(
                    {balance: newBalance},
                    {transaction: t}
                )

                return {
                    userId,
                    newBalance
                };
            }
        )
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
    async fetchUsersList(): Promise<User[]> {
        return await User.findAll(
                        {
                            where: {status: UserStatus.ACTIVE},

                            limit: 10,
                            
                            order: [['createdAt', 'DESC']]
                        })
    }


    //fetch user by id
    async fetchUserById(userId: number): Promise<User | null> {
        return await User.findByPk(userId);
    }




}
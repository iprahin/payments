import { Transaction } from "sequelize";
import { sequelize } from "../config/database";
import { User, Order, LedgerEntry } from '../models';
import { OrderStatus } from "../models/Order";
import { LedgerEntryType } from "../models/LedgerEntry";
import { InsufficientBalanceError, UserNotFoundError } from "./ErrorService";

interface CreateOrderInput {
    userId: number;
    amount: number;
    idempotencyKey: string;
}

interface CreateOrderOutput {
    orderId: number;
    status: OrderStatus;
    newBalance: number;
}


export class OrderService {

    async createOrderWithPayment(input: CreateOrderInput): Promise<CreateOrderOutput> {
        const { userId, amount, idempotencyKey } = input;

        const existingOrder = await Order.findOne({
                                                    where: {idempotencyKey}
                                                });

        if(existingOrder) {
            const _user = await User.findByPk(userId);
            if(!_user)
                throw new UserNotFoundError(userId);

            return {
                orderId: existingOrder.id,
                status: existingOrder.status,
                newBalance: Number(_user.balance)
            }
        }

        return await sequelize.transaction({
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
                if(currentBalance < amount)
                    throw new InsufficientBalanceError(amount, currentBalance);

                const _order = await Order.create(
                    {
                        userId: userId,
                        amount: amount,
                        status: OrderStatus.PENDING,
                        idempotencyKey
                    },
                    {transaction: t}
                )


                const newBalance = currentBalance - amount;
                await _user.update(
                    {
                        balance: newBalance
                    },
                    {transaction: t}
                )


                await LedgerEntry.create(
                    {
                        orderId: _order.id,
                        userId: userId,
                        amount: -amount,
                        type: LedgerEntryType.DEBIT,
                        description: `Оплата заказа #${_order.id}`
                    },
                    {transaction: t}
                )

                

                //получение оплаты от клиента. Переделать!
                await LedgerEntry.create(
                    {
                        orderId: _order.id,
                        userId: 0,
                        amount: amount,
                        type: LedgerEntryType.CREDIT,
                        description: `Получение оплаты за заказ #${_order.id}`
                    },
                    { transaction: t }
                );




                await _order.update(
                    {
                        status: OrderStatus.COMPLETED
                    },
                    {transaction: t}
                );

                return {
                        orderId: _order.id,
                        status: OrderStatus.COMPLETED,
                        newBalance
                        };
            }
        )
    }


    async fetchOrdersByUserId(userId: number): Promise<Order[]> {
        return await Order.findAll({
                                    where: { userId }
                                    ,
                                    include: [
                                        {
                                            model: LedgerEntry,
                                            as: 'ledgerEntries'
                                        }
                                    ],

                                    order: [['createdAt', 'DESC']]
                            })



    }


    async fetchOrderById(orderId: number): Promise<Order | null> {
        return await Order.findByPk(orderId);
    }






}



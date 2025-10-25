import { LedgerEntry, User, Order } from "../../src/models";
import { LedgerEntryType } from "../../src/models/LedgerEntry";
import { sequelize } from "../../src/config/database";
import { fn, col, literal } from 'sequelize';
import { OrderStatus } from "../../src/models/Order";
import { UserStatus } from "../../src/models/User";

describe('LedgerEntry Balance Tests', () => { 
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
 await User.create({
      email: 'testuser@gmail.com',
      balance: 1000,
      status: UserStatus.ACTIVE
    });

    await Order.create({
      userId: 1,
      amount: 100,
      status: OrderStatus.COMPLETED,
      idempotencyKey: 'test-order-1'
    });

    await LedgerEntry.bulkCreate([
      { userId: 1, orderId: 1, type: LedgerEntryType.DEBIT, amount: 100, description: "Order #1" },
      { userId: 1, orderId: 1, type: LedgerEntryType.CREDIT, amount: 100, description: "Order #1" }
    ]);



    });



  test('Дебит равен кредиту для транзакции (orderId) 1', async () => {
    const debitSum = await LedgerEntry.sum('amount', {
      where: { orderId: 1, type: LedgerEntryType.DEBIT }
    });

    const creditSum = await LedgerEntry.sum('amount', {
      where: { orderId: 1, type: LedgerEntryType.CREDIT }
    });

    expect(debitSum).toBe(creditSum);
    expect(debitSum).toBe(100);
  });



})
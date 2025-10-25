import { LedgerEntry } from "../../src/models";
import { LedgerEntryType } from "../../src/models/LedgerEntry";
import { sequelize } from "../../src/config/database";
import { fn, col, literal } from 'sequelize';

describe('LedgerEntry Balance Tests', () => { 
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        
        // Создаём тестовые записи для транзакции 1
        await LedgerEntry.bulkCreate([
        { userId: 1, orderId: 1, type: LedgerEntryType.DEBIT, amount: 100, description: "Order #1" },
        { userId: 1, orderId: 1, type: LedgerEntryType.CREDIT, amount: 100, description: "Order #1"  }
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
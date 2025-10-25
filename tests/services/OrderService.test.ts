import { OrderService } from '../../src/services/OrderService';
import { UserNotFoundError, InsufficientBalanceError } from '../../src/services/ErrorService';
import { sequelize } from '../../src/config/database';
import { User } from '../../src/models/User';
import { UserStatus } from '../../src/models/User';



describe('OrderService Unit Tests', () => {
  let service: OrderService;

  beforeAll(async () => {
    // Синхронизируем БД перед тестами
    await sequelize.sync({ force: true });
    
    // Создаем тестового пользователя
    await User.create({
      email: 'test@example.com',
      balance: 1000,
      status: UserStatus.ACTIVE
    });
  });

  beforeEach(() => {
    service = new OrderService();
  });

  test('Должен успешно создать заказ с достаточным балансом', async () => {
    const result = await service.createOrderWithPayment({
      userId: 1,
      amount: 100,
      idempotencyKey: 'test-key-001'
    });

    expect(result.status).toBe('COMPLETED');
    expect(result.newBalance).toBe(900);
    expect(result.orderId).toBeDefined();
  });

  test('Должен вернуть существующий заказ при повторном вызове с тем же idempotencyKey', async () => {
    const firstResult = await service.createOrderWithPayment({
      userId: 1,
      amount: 50,
      idempotencyKey: 'test-key-002'
    });

    const secondResult = await service.createOrderWithPayment({
      userId: 1,
      amount: 50,
      idempotencyKey: 'test-key-002'
    });

    expect(firstResult.orderId).toBe(secondResult.orderId);
  });


test('Нельзя создать два заказа с одинаковым idempotencyKey', async () => {
  const orderData = {
    userId: 1,
    amount: 50,
    idempotencyKey: 'unique-test-key'
  };

  const firstOrder = await service.createOrderWithPayment(orderData);
  const secondOrder = await service.createOrderWithPayment(orderData);

  // Должны вернуть один и тот же заказ
  expect(firstOrder.orderId).toBe(secondOrder.orderId);
});





  test('Должен выбросить ошибку при недостаточном балансе', async () => {
    await expect(
      service.createOrderWithPayment({
        userId: 1,
        amount: 10000,
        idempotencyKey: 'test-key-003'
      })
    ).rejects.toThrow(InsufficientBalanceError);
  });

  test('Должен выбросить ошибку при несуществующем пользователе', async () => {
    await expect(
      service.createOrderWithPayment({
        userId: 999,
        amount: 100,
        idempotencyKey: 'test-key-004'
      })
    ).rejects.toThrow(UserNotFoundError);
  });

  afterAll(async () => {
    await sequelize.close();
  });


});
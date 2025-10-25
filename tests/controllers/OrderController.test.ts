import request from 'supertest';
import app from '../../src/app'
import { OrderStatus } from '../../src/models/Order';
import { User } from '../../src/models';
import { UserStatus } from '../../src/models/User';

describe('OrderController Integration Tests', () => {

	beforeAll(async () => {

		await User.create({
			email: 'tes111t@example.com',
			balance: 1000,
			status: UserStatus.ACTIVE
			});

	});

  test('POST /orders - должен создать заказ', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        userId: 1,
        amount: 100,
        idempotencyKey: 'integration-test-key-001',
		status: OrderStatus.COMPLETED
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });


  test('GET /orders/:userId - получаем список заказов пользователя', async () => {
    const resp = await request(app).get('/orders/1');

    expect(resp.status).toBe(200);
    expect(resp.body.success).toBe(true);
  })


  	test('GET /user/:userId - fetch user by ID', async () => {

	//await user!.reload();

	const resp = await request(app).get('/user/1');

    expect(resp.status).toBe(200);
    expect(resp.body.success).toBe(true);
	})



  test('GET /health - должен вернуть OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});
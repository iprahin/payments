import request from 'supertest';
import app from '../../src/app'

describe('OrderController Integration Tests', () => {
  test('POST /orders - должен создать заказ', async () => {
    const response = await request(app)
      .post('/orders')
      .send({
        userId: 1,
        amount: 100,
        idempotencyKey: 'integration-test-key-001'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('GET /health - должен вернуть OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});
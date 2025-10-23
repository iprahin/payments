import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";
import { InsufficientBalanceError, UserNotFoundError, DuplicateKeyError } from "../services/ErrorService";


export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService()
    }


    createOrder = async(req: Request, res: Response): Promise<void> => {
        try {

            const { userId, amount, idempotencyKey } = req.body;

            if(!userId || !amount || !idempotencyKey) {
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

        } catch (error) {
            if(error instanceof InsufficientBalanceError) {
                res.status(400).json({
                    error: error.message
                })

                return;
            }


            if(error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: error.message
                });
                    
                return;
            }


            if(error instanceof DuplicateKeyError) {
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

    }


    fetchOrders = async(req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const orders = await this.orderService.fetchOrdersByUserId(Number(userId));

            res.status(200).json({
                success: true,
                data: orders 
            });

        } catch(error) {
            console.error('Ошибка при получении заказов!', error);
            res.status(500).json({
                error: 'Internal error'
            })

        }
    }



}
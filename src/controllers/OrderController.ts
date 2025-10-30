import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";
import { InsufficientBalanceError, UserNotFoundError, DuplicateKeyError } from "../services/ErrorService";
import { createOrderSchema } from "../schemas/orderSchemas";
import pinoLogger from "../logger";


export class OrderController {
    private orderService: OrderService;

    constructor() {
        this.orderService = new OrderService()
    }

    private handleError(res: Response, error: Error) {
        switch (error.constructor) {
            case UserNotFoundError:
                return res.status(404).json({ error: error.message });
            case InsufficientBalanceError:
                return res.status(400).json({ error: error.message });
            case DuplicateKeyError:
                return res.status(409).json({ error: error.message });
            default:
                console.error("Unexpected error:", error);
                return res.status(500).json({ error: "Internal Server Error" });
        }
    }


    createOrder = async(req: Request, res: Response): Promise<void> => {
        pinoLogger.info(`createOrder called`);
        
        try {

            const validateRequest = createOrderSchema.safeParse(req.body);
            
            if (!validateRequest.success) {
                res.status(400).json({ error: validateRequest.error });
                return;
            }

            const { userId, amount, idempotencyKey } = validateRequest.data;

            //req.userRoles
            //req.userId


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
            this.handleError(res, error as Error);
        }

    }


    fetchOrders = async(req: Request, res: Response): Promise<void> => {
        pinoLogger.info(`fetchOrders called`);

        try {
            const { userId } = req.params;

            const orders = await this.orderService.fetchOrdersByUserId(Number(userId));

            res.status(200).json({
                success: true,
                data: orders 
            });

        } catch(error) {
            this.handleError(res, error as Error);
        }
    }



}
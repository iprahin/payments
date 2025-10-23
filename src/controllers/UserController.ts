import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { UserNotFoundError, ZeroEmptyAmount } from "../services/ErrorService";


export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }


    fetchUserById = async(req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.params;

            const _user = await this.userService.fetchUserById(Number(userId));

            if(_user) {
                res.status(200).json({
                    success: true,
                    data: _user 
                });
            } else {
                res.status(404).json({
                    error: new UserNotFoundError(Number(userId))
                });
                    
                return;
            }


        } catch(error) {
            if(error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: error.message
                });
                    
                return;
            }
                
            console.error('Server Error', error);
            res.status(500).json({
                error: 'Internal error'
            });

        }
    }


    fetchUsersList = async(req: Request, res: Response): Promise<void> => {
        try {
            const usersList = await this.userService.fetchUsersList();

            res.status(200).json({
                success: true,
                data: usersList
            });

        } catch(error) {
            if(error instanceof UserNotFoundError) {
                res.status(404).json({
                    error: error.message
                });
                    
                return;
            }


            console.error('Server Error', error);
            res.status(500).json({
                error: 'Internal error'
            })
        }
    }



    addMoneyToUserBalance = async(req: Request, res:Response): Promise<void> => {
        try {
            const { userId, amount } = req.body;

            if(!userId || !amount) {
                res.status(400).json({
                    error: 'Отсутствуют обязательные поля: userId, amount'
                });
            
                return;
            }

            if (amount <= 0) {
                res.status(400).json({
                    error: 'Сумма должна быть больше 0'
                });
    
                return;
            }

            const _user = await this.userService.addMoneyToUserBalance({
                userId: Number(userId),
                amount: Number(amount)
            });

            res.status(201).json({
                success: true,
                data: _user
            });

        } catch(error) {
            if(error instanceof ZeroEmptyAmount) {
                res.status(400).json({
                    error: error.message
                })

                return;
            }

            console.error('Server Error', error);
            res.status(500).json({
                error: 'Internal error'
            })
        }
    }












}
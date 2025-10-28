import { Request, Response } from "express";
import { AuthService } from "../../services/auth/AuthService";
import { authSchema } from "../../schemas/authSchemas";

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    register = async(req: Request, res: Response): Promise<void> => {
        try {
            const validateRequest = authSchema.safeParse(req.body);
            
            if(!validateRequest.success) {
                res.status(400).json({ error: validateRequest.error });
                
                return;
            }

            const { email, password } = validateRequest.data;

            const _newUser = await this.authService.register({ email, password });

            if(_newUser.success === true) {
                res.status(200).json({
                    success: true,
                    data: _newUser 
                });
            } else {
                res.status(404).json({
                                    error: _newUser.data
                                });
                                    
                return;
            }

        } catch (error) {
            console.error('Server Error', error);
            res.status(500).json({
                error: 'Internal error'
            });
        }
    }



    login = async(req: Request, res: Response): Promise<void> => {
        try {

            const validateRequest = authSchema.safeParse(req.body);
            
            if(!validateRequest.success) {
                res.status(400).json({ error: validateRequest.error });
                
                return;
            }

            const { email, password } = validateRequest.data;

            const token = await this.authService.login({email, password})

            if(token.success === true) {
                res.status(200).json({  success: true,
                                        data: token.data
                                    });
            } else {
                res.status(404).json({
                                    error: token.data
                                });
                                    
                return;
            }


        } catch (error) {
            console.error('Server Error', error);
            res.status(500).json({
                error: 'Internal error'
            });

        }


    }



}
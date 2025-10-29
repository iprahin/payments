import { Request, Response } from "express";
import { AuthService } from "../../services/auth/AuthService";
import { authSchema } from "../../schemas/authSchemas";
import { TokenService } from "../../services/auth/TokenService";
import { UserTokens } from "../../services/UserService";

export class AuthController {
    private authService: AuthService;
    private tokenService: TokenService;

    constructor() {
        this.authService = new AuthService();
        this.tokenService = new TokenService();
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

            const token = await this.authService.login({email, password});

            if(token.success === true) {
                res.cookie('refreshToken', token.tokens?.refreshToken, {
                    httpOnly: true
                });

                await this.tokenService.saveToken(Number(token.data), token.tokens?.refreshToken);

                res.status(200).json({
                                        success: true,
                                        data: token.tokens?.refreshToken
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


    logout = async(req: Request, res: Response): Promise<void> => {

        const { refreshToken } = req.cookies

        await this.authService.logout()

        res.clearCookie('refreshToken');

    }


    refresh = async(req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.cookies

            const tokens = await this.tokenService.refresh(refreshToken);

            if(tokens) {
                res.cookie('refreshToken', tokens.refreshToken, {
                            httpOnly: true
                        })

                res.status(200).json({
                                    success: true,
                                    data: tokens
                                    });
            }

        } catch (error) {
            console.error('Server Error', error);
            res.status(500).json({
                error: 'Internal error'
            });
        }


    }





}
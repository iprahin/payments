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
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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
        try { 
            const { refreshToken } = req.cookies;

            if(!refreshToken) {
                res.status(401).json({ error: 'No refresh token provided' });
                return;
            }

            const userData = await this.tokenService.validateRefreshToken(refreshToken);
            
            const result = await this.authService.logout(userData.id);

            res.clearCookie('refreshToken');

            if(result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(400).json({
                    error: result.data
                });
            }

        } catch (error) {
            console.error('Logout Error', error);
            res.clearCookie('refreshToken');
            res.status(500).json({
                error: 'Internal error'
            });
        }
    }


    refreshToken = async(req: Request, res: Response): Promise<void> => {
        try {
            const { refreshToken } = req.cookies

            const tokens = await this.tokenService.refreshToken(refreshToken);

            if(tokens) {
                res.cookie('refreshToken', tokens.refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'strict',
                            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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
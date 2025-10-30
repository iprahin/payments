
import { User, UserStatus } from "../../models/User";
import { UserRoles, UserRolesTypes } from "../../models/UserRoles";
import { TokenService } from "./TokenService";


interface UserRegister {
    email: string;
    password: string;
}


interface UserRegisterResult {
    success: boolean;
    data: string;
}

interface UserLoginResult extends UserRegisterResult {
    tokens?: {
        accessToken: string;
        refreshToken: string;
    }
}
interface UserLoginDetails extends UserRegister {}
interface UserLogoutResult extends UserRegisterResult {}

export class AuthService {
    private tokenService: TokenService;

    constructor() {
        this.tokenService = new TokenService();
    }


    async register(input: UserRegister, userRole: UserRolesTypes = UserRolesTypes.CUSTOMER): Promise<UserRegisterResult> {
        
        const { email, password } = input;
        
        const _existingUser = await User.findOne({where: { email }});

        if(_existingUser !== null) {
            return {
                success: false,
                data: 'User Exists'
            }
        }

        const _newUser = await User.create({ email, 
                                            password, 
                                            status: UserStatus.ACTIVE, 
                                            balance: 0 });

        if(_newUser.id) {
            await UserRoles.create({
                                    roleId: userRole, 
                                    userId: _newUser.id,
                                    })

            return {
                success: true,
                data: 'Successfull Registration'
            }

        } else {
            return {
                success: false,
                data: 'User Creation Error'
            }
        }
    }


    async login(input: UserLoginDetails): Promise<UserLoginResult> {
        try {
            const { email, password } = input;

            const existingUser = await User.findOne({where: {email }, include: ['user_roles']});

            if(!existingUser) {
                return {
                    success: false,
                    data: 'Invalid credentials'
                }
            }

            const isValidPassword = await existingUser.checkPassword(password);

            if(!isValidPassword) {
                return {
                    success: false,
                    data: 'Invalid credentials'
                }
            }

            const userRoles = existingUser.user_roles?.map(role => {
                                    return role.roleId;
                                    });

            const tokens = await this.tokenService.generateTokens({ 
                                                id: existingUser.id, 
                                                email: existingUser.email,
                                                roles: userRoles || []
                                            });

            return {
                    success: true,
                    data: (existingUser.id).toString(),
                    tokens
                }

        } catch (error) {
            return {
                success: false,
                data: 'Login Error'
            }
        }
    }



    async logout(userId: number): Promise<UserLogoutResult> {
        try {
            const removed = await this.tokenService.removeToken(userId);
            if(removed) {
                return {
                    success: true,
                    data: 'Logged out successfully'
                }
            } else {
                return {
                    success: false,
                    data: 'Logout error'
                }
            }

        } catch (error) {
            return {
                success: false,
                data: 'Logout Error'
            }
        }
    }





}
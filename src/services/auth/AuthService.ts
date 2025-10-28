
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

import { User, UserStatus } from "../../models/User";
import { UserRoles, UserRolesTypes } from "../../models/UserRoles";

const JWT_SECRET: string = process.env.JWT_SECRET || 'asdk*1h.<M>m175$^@%#&*-LLsh22';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || 24 * 60 * 60;



interface UserRegister {
    email: string;
    password: string;
}


interface UserRegisterResult {
    success: boolean;
    data: string;
}

interface UserLoginResult extends UserRegisterResult {}
interface UserLoginDetails extends UserRegister {}


export class AuthService {

    async register(input: UserRegister, userRole: UserRolesTypes = UserRolesTypes.CUSTOMER): Promise<UserRegisterResult> {
        
        const { email, password } = input;
        
        const _existingUser = await User.findOne({where: {email}});

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
            await UserRoles.create({roleId: userRole, 
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

            const options: SignOptions = { expiresIn: 24 * 60 * 60 };
            const token = jwt.sign(
                            { 
                                id: existingUser.id, 
                                email: existingUser.email,
                                roles: userRoles
                            },
                            JWT_SECRET as string,
                            options
                        );

            return {
                    success: true,
                    data: token
                }

        } catch (error) {
            return {
                success: false,
                data: 'Login Error'
            }



        }
    }





}
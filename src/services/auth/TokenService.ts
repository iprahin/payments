import jwt, { JwtPayload } from "jsonwebtoken";
import { UserPayload, UserTokens } from "../UserService";
import { User, Token } from "../../models";
import  ms  from 'ms';

export class TokenService {
    private expiresAccessTokenIn = process.env.JWT_ACCESS_EXPIRES_IN as ms.StringValue;
    private expiresRefreshTokenIn = process.env.JWT_REFRESH_EXPIRES_IN as ms.StringValue;

    private accessTokenSecret = process.env.JWT_SECRET as string;
    private refreshTokenSecret = process.env.JWT_REFRESH_SECRET as string;



    async generateTokens(payload: UserPayload): Promise<UserTokens> {

        const accessToken = jwt.sign(
                                payload,
                                process.env.JWT_SECRET as string,
                                { expiresIn: this.expiresAccessTokenIn }
                        );

        const refreshToken = jwt.sign(
                                    payload,
                                    process.env.JWT_REFRESH_SECRET as string,
                                    { expiresIn: this.expiresRefreshTokenIn }
                                );

        return {
            accessToken,
            refreshToken
        }
    }


    async saveToken(userId: number, refreshToken?: string): Promise<boolean> {
        if(!refreshToken)
            return false;

        const _user = await User.findByPk(userId);

        if(!_user) {
            return false;
        }
            
        const _token = await Token.findOne({
                                        where: {userId}
                                        })

        if(_token) {
            _token.refreshToken = refreshToken;
            _token.save();
        } else {
            await Token.create({userId, refreshToken});
        }

        return true;
    }


    async refresh(refreshToken: string):Promise<UserTokens | void> {
        if(!refreshToken) {
            throw new Error('Unauthorised!');
        }

        const _userPayload = await this.validateRefreshToken(refreshToken);

        if(_userPayload) {
            const _token = await Token.findOne({ where: {
                                            userId: _userPayload.id,
                                            refreshToken: refreshToken
                                        }});

            if(_token) {
                const _user = await User.findByPk(_userPayload.id);
                
                if(_user) {
                    const userRoles = _user.user_roles?.map(role => {
                                    return role.roleId;
                                    });

                    return this.generateTokens({
                                            id: _user.id,
                                            email: _user.email,
                                            roles: userRoles
                                        });

                }
            }
        }

        throw new Error('Error refresh token');
    }


    async validateAccessToken(accessToken: string): Promise<JwtPayload> {
        try {
            return jwt.verify(accessToken, this.accessTokenSecret) as JwtPayload;
        } catch (error) {
            console.log(error);
            throw new Error('validate Access Token error');
        } 
    }




    async validateRefreshToken(refreshToken: string): Promise<JwtPayload> {
        try {
            return jwt.verify(refreshToken, this.refreshTokenSecret) as JwtPayload;
        } catch (error) {
            console.log(error);
            throw new Error('validate Access Token error');
        } 
    }









}



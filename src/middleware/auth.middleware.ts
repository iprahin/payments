import { Request, Response, NextFunction } from "express";
import { TokenService } from "../services/auth/TokenService";

const tokenService = new TokenService();


export const authenticateToken = async(req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1]; //remove Bearer

        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const userInfo = await tokenService.validateAccessToken(token);

        req.userId = userInfo.id;
        req.userRoles = userInfo.roles || [];

        next();

    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
}


export const requireRole = (...allowedRoles: number[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if(!req.userRoles || req.userRoles.length == 0) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }

        const hasRole = req.userRoles.some(role => allowedRoles.includes(role));

        if(!hasRole) {
            res.status(403).json({ 
                            error: 'Insufficient permissions',
                            requiredRoles: allowedRoles,
                            yourRoles: req.userRoles
                            });
            return;
        }

        next();
    }
}


export const requireOwnership = (req: Request, res: Response, next: NextFunction): void => {
    const _userId = parseInt(req.params.userId);

    if(!req.userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    if(req.userId !== _userId) {
        res.status(403).json({ error: 'You can only access your own resources' });
        return;
    }
    
    next();
}
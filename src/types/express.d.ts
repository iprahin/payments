declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRoles?: number[];
    }
  }
}

export {};
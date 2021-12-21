import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


export class CustomMiddlewares {
    public static errorHandler(err: any, _req: Request, res: Response, next: NextFunction): void {
        if (!err.statusCode) err.statusCode = 500;

        res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }

    public static authHandler(req: Request, _res: Response, next: NextFunction): void {
        try {
            const { token = '' } = req.headers;

            if (token.toString().length > 0) {
                const decode = jwt.verify(token.toString(), 'tokens');

                if (!decode) {
                    throw new createError.Unauthorized();
                }

                next();
            } else {
                throw new createError.Unauthorized();
            }
        } catch (error) {
            next(error);
        }
    }
}
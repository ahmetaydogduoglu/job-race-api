import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import { Route } from '@core/decorators/route';
import { Get, Post } from '@core/decorators/methods';
import { ILoginUserBody, UserSchema, IUserRegisterBody } from '@db/schemas/user';
import { Validation } from '@utils/validation';
import Controller from '@core/registerProccess/controller';
import { UserRoles } from 'constant/userRoles';

@Route('/auth')
export class AuthController extends Controller {
    @Post('/login')
    public async login(req: Request<{}, {}, ILoginUserBody>, res: Response, next: any): Promise<void> {
        try {
            const { email, password } = req.body;
            const foundUser = await UserSchema.findOne({ email });

            if (!foundUser) {
                throw new createError.Forbidden('Username or password is not valid.');
            }

            const hashPassword = await bcrypt.compare(password, foundUser.password);

            if (!hashPassword) {
                throw new createError.Forbidden('Username or Password is not valid.');
            }

            const tokenContent = {
                username: foundUser.username,
                id: foundUser._id
            }

            const { password: userPassword, ...userData } = foundUser;

            const token = jwt.sign(tokenContent, 'tokens', { expiresIn: '1d' });
            const refreshToken = jwt.sign(tokenContent, 'refreshTokens', { expiresIn: '30d' });

            res.json({ success: true, data: { token, refreshToken, userData } });
        } catch (error) {
            next(error);
        }
    }

    @Post('/register')
    public async register(req: Request<{}, {}, IUserRegisterBody>, res: Response, next: any): Promise<void> {
        try {
            const { email, firstName, lastName, password, username } = req.body;
            if (!email || !firstName || !lastName || !password || !username) {
                throw new createError.BadRequest('You should full all inputs');
            }
            if (firstName?.trim().length === 0 && lastName?.trim().length === 0) {
                throw new createError.BadRequest('Firstname and lastname not be empty');
            }
            if (!Validation.emailValidate(email)) {
                throw new createError.BadRequest('E-mail Not Valid.')
            }
            if (!Validation.passwordValidate(password)) {
                throw new createError.BadRequest('Password should contain atleast one number and one special character')
            }
            if (!Validation.usernameValidate(username)) {
                throw new createError.BadRequest('Usernames can only have, lowercase letters (a-z), numbers (0-9), dots (.), underscores (_).')
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = new UserSchema({
                ...req.body,
                avatar: '',
                password: hashPassword,
                role: UserRoles.Employee
            });

            await newUser.save();

            res.json(req.body);
        } catch (error) {
            next(error);
        }
    }

    @Post('/validate')
    public validate(req: Request, res: Response, next: any): void {
        try {
            const { refreshtoken: refreshToken, token } = req.headers;

            if (token && refreshToken) {
                const isValid = jwt.verify(token.toString(), 'tokens');

                if (!isValid) {
                    const isValidRefrehToken = jwt.verify(refreshToken.toString(), 'refreshTokens');

                    if (isValidRefrehToken) {
                        const newToken = jwt.sign(isValidRefrehToken, 'tokens', { expiresIn: '1d' });
                        const newRefreshToken = jwt.sign(isValidRefrehToken, 'refreshTokens', { expiresIn: '30d' });

                        res.json({ success: true, data: { token: newToken, refreshToken: newRefreshToken } });
                    } else {
                        throw new createError.Unauthorized();
                    }
                }

                res.json({ success: true, data: { token, refreshToken } });
            }

            throw new createError.Unauthorized();
        } catch (error) {
            next(error);
        }
    }

    @Get('/forgot-password/static-page/:token')
    public async renderForgorPassowrdPage(req: Request, res: Response, next: any): Promise<void> {
        res.render('forgotPassword');
    }

    @Get('/user-content/:username')
    public async getUserContent(req: Request, res: Response, next: any): Promise<void> {
        const { username } = req.params;
        const foundUser = await UserSchema.findOne({ username });
        if (foundUser) {
            const { password: userPassword, ...userData } = foundUser;
            res.json({ succes: true, data: { userData } });
        }

        res.status(404).send();
    }
}

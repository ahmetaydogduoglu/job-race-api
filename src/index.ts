import express from 'express';
import path from 'path';

import Connection from '@db/connection';

import { AuthController } from '@controllers/auth';
import { PostController } from '@controllers/posts';

import { expressRegisterProccess } from '@core/registerProccess/app';

import { CustomMiddlewares } from '@utils/customMiddlewares';

expressRegisterProccess.app.set('view engine', 'ejs');
expressRegisterProccess.app.set('views', path.join(__dirname, '/static/pages'));

Connection().then(
    () => {
        expressRegisterProccess.startServer(
            {
                controllers: [
                    AuthController,
                    PostController
                ],
                initialMiddlewares: [
                    express.json()
                ],
                endOfMiddlewares: [
                    CustomMiddlewares.errorHandler
                ]
            }
        );
    }
).catch(err => {
    console.log(err);
});

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { Route } from '@core/decorators/route';
import { Delete, Get, Post, Put } from '@core/decorators/methods';
import { FeedSchema, IFeed } from '@db/schemas/feed';
import Controller from '@core/registerProccess/controller';
import { CustomMiddlewares } from '@utils/customMiddlewares';

@Route('/feeds')
export class PostController extends Controller {
    @Get('/get-feeds/:page/:limit', CustomMiddlewares.authHandler)
    public async getFeeds(req: Request<{ userId: string, page: string, limit: string }>, res: Response, next: any): Promise<void> {
        try {
            const { limit, page } = req.params;

            const posts = await FeedSchema.find()
                .limit(parseInt(limit))
                .skip(parseInt(limit) * (parseInt(page) - 1));
            res.json({ data: posts, success: true });
        } catch (error) {
            res.status(500);
        }
    }

    @Post('/', CustomMiddlewares.authHandler)
    public async newFeeds(req: Request<{}, {}, IFeed>, res: Response, next: any): Promise<void> {
        try {
            const newPost = new FeedSchema({ ...req.body, likeCount: 0 });

            await newPost.save();

            res.json(newPost.toJSON()).status(200);
        } catch (error) {
            res.status(500).send(error);
        }
    }

    @Delete('/:feedId', CustomMiddlewares.authHandler)
    public deleteFeed(req: Request, res: Response, next: any): void {
        console.log(req.params);
        res.send(req.params);
    }

    @Put('/:feedId', CustomMiddlewares.authHandler)
    public updateFeed(req: Request, res: Response, next: any): void {
        console.log(req.params);
        res.send(req.params);
    }

    @Get('/get-user-feedId/:userId', CustomMiddlewares.authHandler)
    public async getFeedDetail(req: Request<{ limit: string, page: string }>, res: Response, next: any): Promise<void> {
        try {
            const { token } = req.headers;

            if (token) {
                const user = jwt.decode(token.toString())
                if (typeof user === 'object' && user?.id) {
                    const { limit, page } = req.params;

                    const posts = await FeedSchema.find({ userId: user?.id })
                        .limit(parseInt(limit))
                        .skip(parseInt(limit) * (parseInt(page) - 1));

                    res.json({ data: posts, success: true });
                }
            }
        } catch (error) {
            res.status(500);
        }
    }
}
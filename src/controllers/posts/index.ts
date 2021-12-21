import { Request, Response } from 'express';

import { Route } from '@core/decorators/route';
import { Delete, Get, Post, Put } from '@core/decorators/methods';
import { FeedSchema, IFeed } from '@db/schemas/feed';
import Controller from '@core/registerProccess/controller';
import { CustomMiddlewares } from '@utils/customMiddlewares';
import Mongoose from 'mongoose';

@Route('/feeds')
export class PostController extends Controller {
    @Get('/get-feeds/:page/:limit', CustomMiddlewares.authHandler)
    public async getFeeds(req: Request<{ userId: string, page: string, limit: string }>, res: Response, next: any): Promise<void> {
        try {
            const posts = await FeedSchema.find();
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

    @Delete('/:feedId')
    public deleteFeed(req: Request, res: Response, next: any): void {
        console.log(req.params);
        res.send(req.params);
    }

    @Put('/:feedId')
    public updateFeed(req: Request, res: Response, next: any): void {
        console.log(req.params);
        res.send(req.params);
    }

    @Get('/get-user-feedId/:userId', CustomMiddlewares.authHandler)
    public async getFeedDetail(req: Request<{ userId: string, limit: string, page: string }>, res: Response, next: any): Promise<void> {
        try {
            const { userId, limit, page } = req.params;
            const posts = await FeedSchema.find({ userId: userId })
                .limit(parseInt(limit))
                .skip(parseInt(limit) * (parseInt(page) - 1));

            res.json({ data: posts, success: true });
        } catch (error) {
            res.status(500);
        }
    }
}
import Mongoose from 'mongoose';

export interface IComment {
    content: string;
    userId: number;
}

export interface IFeed {
    userId: string,
    content: string;
    resumeLink: string;
    likeCount: number;
    language: Array<string>;
}

const schema = new Mongoose.Schema<IFeed>({
    content: { type: String, required: true },
    likeCount: { type: Number },
    userId: { type: String, required: true }
});

export const FeedSchema = Mongoose.model('Feeds', schema);

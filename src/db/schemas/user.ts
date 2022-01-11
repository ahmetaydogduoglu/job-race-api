import Mongoose from 'mongoose';

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    avatar: string;
    role: string;
    location: string;
}

export interface ILoginUserBody {
    email: string;
    password: string;
}
export interface IUserRegisterBody {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    username: string;
}


const schema = new Mongoose.Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, required: true },
});

export const UserSchema = Mongoose.model('users', schema);

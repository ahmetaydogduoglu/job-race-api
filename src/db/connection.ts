import Mongoose from 'mongoose';

export default (): Promise<typeof Mongoose> => {
    return Mongoose.connect('mongodb://localhost:27017/talent-pool');
}
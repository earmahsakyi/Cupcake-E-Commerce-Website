import mongoose from "mongoose";

export const connectMongoDB = async (): Promise<void> => {

    try {
        const url = process.env.MONGO_URL;
        if(!url) {
            console.error('MongoDB URL not defined')
            process.exit(1)
        }
        await mongoose.connect(url);
        console.log('MongoDB connected successfully...')

    } catch (err) {
        console.error('Failed to connect to mongoDB',err);
        process.exit(1)

    }
}
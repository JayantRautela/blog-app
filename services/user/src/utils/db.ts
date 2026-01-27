import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to Database");
    } catch (error) {
        console.log("Error connecting to DB :- ", error);
        process.exit(1);
    }
}

export default connectDB;
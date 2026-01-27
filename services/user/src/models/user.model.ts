import mongoose, { Document, Schema, type IsUnknown} from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    x: string;
    linkedIn: string;
    bio: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    instagram: {
        type: String
    },
    facebook: {
        type: String
    },
    x: {
        type: String
    },
    linkedIn: {
        type: String
    },
    bio: {
        type: String
    },
}, { timestamps: true });

const User = mongoose.model<IUser>("User", userSchema);
export default User;
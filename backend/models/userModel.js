import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['user', 'sales', 'admin'], default: 'user' },
        cartData:{type:Object, default:{}},
        isAdmin:{type:Boolean, default:false}
    },
    { timestamps: true, minimize: false
    }
)

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
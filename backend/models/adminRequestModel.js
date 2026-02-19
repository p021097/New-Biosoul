import mongoose from "mongoose";

const adminRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // hashed password of request
  status:{type:String, enum:["pending", "approved", "rejected"],default:"pending"},
  reviewedBy:{type:mongoose.Schema.Types.ObjectId, ref:"Admin", default:null},
  reviewedAt:{type:Date, default:null}
},
{timestamps:true}
);

const adminRequestModel = mongoose.models.AdminRequest || mongoose.model("AdminRequest",adminRequestSchema);

export default adminRequestModel

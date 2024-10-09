import mongoose from 'mongoose';

const roleEnum = {
  Seller: 'seller',
  ADMIN: 'subadmin',
  SUPERADMIN: 'superadmin',
  BUYER: 'buyer', 
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg',
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.BUYER,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow other fields not defined in schema
  }
);

const User = mongoose.model('User', userSchema);

export default User;

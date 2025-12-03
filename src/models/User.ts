import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComplaint {
  issueTypes: string[];
  shopName: string;
  dateOfOccurrence: string;
  productName?: string;
  amountPaid?: string;
  advertisedPrice?: string;
  expectedPrice?: string;
  actualPrice?: string;
  billAmount?: string;
  serviceType?: string;
  warrantyPeriod?: string;
  purchaseDate?: string;
  refundAmount?: string;
  damageDescription?: string;
  delayDuration?: string;
  unauthorizedCharge?: string;
  details: string;
  draftText: string;
  images?: string[];
  submittedAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nidNo?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  presentAddress?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  permanentAddress?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
  profilePicture?: string;
  complaints?: IComplaint[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    nidNo: {
      type: String,
      trim: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    presentAddress: {
      street: String,
      city: String,
      district: String,
      postalCode: String,
    },
    permanentAddress: {
      street: String,
      city: String,
      district: String,
      postalCode: String,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    complaints: [
      {
        issueTypes: { type: [String], default: [] },
        shopName: { type: String, required: true },
        dateOfOccurrence: { type: String, required: true },
        productName: String,
        amountPaid: String,
        advertisedPrice: String,
        expectedPrice: String,
        actualPrice: String,
        billAmount: String,
        serviceType: String,
        warrantyPeriod: String,
        purchaseDate: String,
        refundAmount: String,
        damageDescription: String,
        delayDuration: String,
        unauthorizedCharge: String,
        details: { type: String, required: true },
        draftText: { type: String, required: true },
        images: { type: [String], default: [] },
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
    minimize: false,
  }
);

// Force recreate the model to ensure schema changes are applied
if (mongoose.models.User) {
  delete mongoose.models.User;
}

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

import mongoose, { Document, Schema, Model } from "mongoose";

export interface ILogDetailsObject {
  message: string;
  variable: string;
  value: number;
}

export interface ILog {
  AppName: string;
  LogId: number;
  UserId: number;
  Log: {
    Level: string;
    TimeStamp: Date;
    Details: ILogDetailsObject | string;
  };
}

export interface ILogDocument extends ILog, Document {}

const logSchema: Schema = new Schema(
  {
    AppName: {
      type: String,
      required: [true, "App name is required"],
      trim: true,
      minlength: [1, "App name cannot be empty"],
      maxlength: [100, "App name cannot exceed 100 characters"],
    },
    LogId: {
      type: Number,
      required: [true, "Log ID is required"],
      min: [1, "Log ID must be positive"],
    },
    UserId: {
      type: Number,
      required: [true, "User ID is required"],
      min: [1, "User ID must be positive"],
    },
    Log: {
      Level: {
        type: String,
        required: [true, "Log level is required"],
        enum: {
          values: ["debug", "info", "warn", "error"],
          message: "Level must be one of: debug, info, warn, error",
        },
      },
      TimeStamp: {
        type: Date,
        required: [true, "Timestamp is required"],
        validate: {
          validator: function (date: Date) {
            return date <= new Date();
          },
          message: "Timestamp cannot be in the future",
        },
      },
      Details: {
        type: Schema.Types.Mixed,
        required: [true, "Details are required"],
        validate: {
          validator: function (details: any) {
            return details !== null && details !== undefined;
          },
          message: "Details cannot be null or undefined",
        },
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const LogModel: Model<ILogDocument> = mongoose.model<ILogDocument>(
  "Log",
  logSchema
);

export default LogModel;

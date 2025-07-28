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

const logSchema: Schema = new Schema({
  AppName: { type: String, required: true },
  LogId: { type: Number, required: true },
  UserId: { type: Number, required: true },
  Log: {
    Level: { type: String, required: true },
    TimeStamp: { type: Date, required: true },
    Details: { type: Schema.Types.Mixed, required: true },
  },
});

const LogModel: Model<ILogDocument> = mongoose.model<ILogDocument>(
  "Log",
  logSchema
);

export default LogModel;

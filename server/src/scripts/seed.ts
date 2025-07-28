import mongoose from "mongoose";
import dotenv from "dotenv";
import LogModel, { ILog } from "../models/logs";

dotenv.config();

const generateRandomLog = (i: number): ILog => {
  const levels = ["debug", "info", "warn", "error"];
  const apps = [
    "AuthService",
    "QueueService",
    "BillingService",
    "PaymentService",
  ];

  const isObjectDetails = Math.random() < 0.5;

  return {
    AppName: apps[i % apps.length],
    LogId: i + 1,
    UserId: Math.floor(Math.random() * 10) + 1,
    Log: {
      Level: levels[Math.floor(Math.random() * levels.length)],
      TimeStamp: new Date(Date.now() - Math.random() * 1e9),
      Details: isObjectDetails
        ? {
            message: `Detail ${i}`,
            variable: `var${i % 3}`,
            value: Math.floor(Math.random() * 100),
          }
        : `Simple message #${i}`,
    },
  };
};

const seedLogs = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");

    await LogModel.deleteMany({});
    console.log("Old logs cleared");

    const logs: ILog[] = Array.from({ length: 500 }, (_, i) =>
      generateRandomLog(i)
    );
    await LogModel.insertMany(logs);

    console.log("500 logs inserted");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding logs:", error);
    process.exit(1);
  }
};

seedLogs();

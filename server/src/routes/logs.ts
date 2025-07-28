import { Router, Request, Response } from "express";
import LogModel from "../models/logs";

const router = Router();
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit as string) || 10)
    );
    const skip = (page - 1) * limit;

    const filter: any = {};

    let apps = req.query.apps;
    if (apps) {
      if (!Array.isArray(apps)) apps = [apps];
      filter.AppName = { $in: apps };
    }

    let levels = req.query.levels;
    if (levels) {
      if (!Array.isArray(levels)) levels = [levels];
      filter["Log.Level"] = { $in: levels };
    }

    let sort: any = {};
    if (req.query.sort === "asc") sort["Log.TimeStamp"] = 1;
    else if (req.query.sort === "desc") sort["Log.TimeStamp"] = -1;
    else sort["Log.TimeStamp"] = -1;

    const [logs, total] = await Promise.all([
      LogModel.find(filter).sort(sort).skip(skip).limit(limit),
      LogModel.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: logs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

router.get("/app-names", async (_req: Request, res: Response) => {
  try {
    const appNames = await LogModel.distinct("AppName");
    res.json({ appNames });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch app names" });
  }
});

router.get("/levels", async (_req: Request, res: Response) => {
  try {
    const levels = await LogModel.distinct("Log.Level");
    res.json({ levels });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch log levels" });
  }
});

export default router;

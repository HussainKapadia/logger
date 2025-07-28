import { Router, Request, Response } from "express";
import LogModel from "../models/logs";

const router = Router();

// GET /logs?page=1&limit=10
router.get("/", async (req: Request, res: Response) => {
  try {
    // 1. Accept and validate query parameters
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(
      1,
      Math.min(100, parseInt(req.query.limit as string) || 10)
    ); // Max 100 per page

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      LogModel.find().skip(skip).limit(limit),
      LogModel.countDocuments(),
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

export default router;

import type { Request, Response } from "express";
import { JobApplicationModel } from "../models/JobApplication.js";
import { jobApplicationInputSchema, jobApplicationUpdateSchema } from "../validation/jobApplication.js";
import { ApiError } from "../middleware/errorHandler.js";

function requireUserId(req: Request): string {
  if (!req.userId) throw new ApiError(401, "Not authenticated");
  return req.userId;
}

export async function listJobApplications(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const { status, search, sort = "-dateApplied" } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = { userId };
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { jobTitle: { $regex: search, $options: "i" } },
    ];
  }

  const applications = await JobApplicationModel.find(filter).sort(sort);
  res.json(applications);
}

export async function getJobApplication(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const application = await JobApplicationModel.findOne({ _id: req.params.id, userId });
  if (!application) throw new ApiError(404, "Job application not found");
  res.json(application);
}

export async function createJobApplication(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const data = jobApplicationInputSchema.parse(req.body);
  const application = await JobApplicationModel.create({ ...data, userId });
  res.status(201).json(application);
}

export async function updateJobApplication(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const data = jobApplicationUpdateSchema.parse(req.body);
  const application = await JobApplicationModel.findOneAndUpdate({ _id: req.params.id, userId }, data, {
    new: true,
    runValidators: true,
  });
  if (!application) throw new ApiError(404, "Job application not found");
  res.json(application);
}

export async function deleteJobApplication(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const application = await JobApplicationModel.findOneAndDelete({ _id: req.params.id, userId });
  if (!application) throw new ApiError(404, "Job application not found");
  res.status(204).send();
}

export async function getStats(req: Request, res: Response): Promise<void> {
  const userId = requireUserId(req);
  const byStatus = await JobApplicationModel.aggregate([
    { $match: { userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const total = await JobApplicationModel.countDocuments({ userId });
  res.json({ total, byStatus });
}

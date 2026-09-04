import { Router } from "express";
import {
  createJobApplication,
  deleteJobApplication,
  getJobApplication,
  getStats,
  listJobApplications,
  updateJobApplication,
} from "../controllers/jobApplicationController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/stats", asyncHandler(getStats));
router.get("/", asyncHandler(listJobApplications));
router.post("/", asyncHandler(createJobApplication));
router.get("/:id", asyncHandler(getJobApplication));
router.patch("/:id", asyncHandler(updateJobApplication));
router.delete("/:id", asyncHandler(deleteJobApplication));

export default router;

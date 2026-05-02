import { Router } from "express";
import {
  analyzeResume,
  recompareResume,
} from "../controllers/aiResumeController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/analyze", upload.single("resume"), analyzeResume);
router.post("/recompare/:id", recompareResume);

export default router;

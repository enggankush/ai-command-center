import { Response, NextFunction } from "express";
import resHandler from "../middlewares/res-hadler";
import analyzeAndSaveResume from "../services/resume/atsService";
import { recompareById } from "../services/resume/atsService";

export const analyzeResume = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const file = req.file;
    const jobDescription = req.body.jobDescription;

    if (!file) {
      return resHandler.error(res, {
        msg: "No file uploaded",
        code: 400,
      });
    }

    // delegate analysis and persistence to ats service
    const force = !!(
      req.body &&
      (req.body.forceRecompute === true || req.body.forceRecompute === "true")
    );
    const result = await analyzeAndSaveResume(file, jobDescription, { force });

    const msg = result.cached
      ? `Resume previously compared on ${result.cachedAt?.toISOString() || "unknown"}`
      : "Resume analyzed successfully";

    // result is the saved structured object returned by the service
    const saved = result || {};
    const data = {
      ...saved,
      aiResult: result.aiResult,
    };

    return resHandler.success(res, {
      data,
      meta: { cached: !!result.cached, cachedAt: result.cachedAt },
      msg,
    });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};

export const recompareResume = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    if (!id)
      return resHandler.error(res, { msg: "Missing resume id", code: 400 });

    const result = await recompareById(id, { force: true });

    const saved = result || {};
    const data = {
      ...saved,
      aiResult: result.aiResult,
    };

    return resHandler.success(res, {
      data,
      msg: "Re-compare completed",
    });
  } catch (err: any) {
    console.error(err);
    next(err);
  }
};

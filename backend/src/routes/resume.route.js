import express from "express";
import { createUploadedFile, deleteResume, getFiles, getResumeStats } from "../controller/resume.controller.js";
import { clerkAuth } from "../middleware/auth.middleware.js";

const router=express.Router();

router.post("/create",clerkAuth,createUploadedFile);

router.delete("/delete/:id",clerkAuth,deleteResume);

router.get("/get-resumes",clerkAuth,getFiles);

router.get("/stats",clerkAuth,getResumeStats);

export default router;
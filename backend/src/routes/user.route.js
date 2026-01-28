import express from "express";
import { createUser, deleteUser, getUser, updateUser } from "../controller/user.controller.js";

const router=express.Router();

router.post("/create",createUser);
router.get("/getuser",getUser);
router.delete("/delete",deleteUser);
router.put("/update",updateUser);

export default router;
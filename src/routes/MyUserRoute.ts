import express from "express";
import MyUserController from "../controllers/MyUserController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";

const router = express.Router()
// /api/my/user => any get req with this endipoint is going to be redirected here 
router.get("/", jwtCheck, jwtParse, MyUserController.getCurrentUser)
router.post("/", jwtCheck, MyUserController.createCurrentUser)
router.put("/", jwtCheck, jwtParse, validateMyUserRequest, MyUserController.updateCurrentUser)

export default router
//route to create restaurant 

import express from "express"
import multer from "multer"
import MyRestaurantController from "../controllers/MyRestaurantController"
import { jwtCheck, jwtParse } from "../middleware/auth"
import { validateMyRestaurantRequest } from "../middleware/validation"

const router = express.Router()

// multer middleware:
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
})

//GET /api/my/restaurant
router.get(
  "/",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurant
)

//POST /api/my/restaurant
router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck, //to ensure we get a valid token in the request
  jwtParse, // it pulls the current logged in user info out of the token and passes it on to the request
  MyRestaurantController.createMyRestaurant
)


export default router
//routes to get all the restaurants

import express from "express"
import { param } from "express-validator"

const router = express.Router()


//api/restaurant/search/london
router.get(
    "/search/:city",
    param("city")
        .isString()
        .trim()
        .notEmpty()
        .withMessage("City paramenter must be a valid string"),
    RestaurantController.searchRestaurants
)
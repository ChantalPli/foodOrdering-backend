//validation logic for all of the requests; added as middleware to the roots;
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";


const handleValidationErrors = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })//if there are error it will send a 400 response to the front 
    }
    next() //if no error, the req is passed to the controller to update the user profile
}

//it validates the req body
export const validateMyUserRequest = [
    body("name").isString().notEmpty().withMessage("Name must be a string"),
    body("addressLine1").isString().notEmpty().withMessage("AddressLine1 must be a string"),
    body("city").isString().notEmpty().withMessage("City must be a string"),
    body("country").isString().notEmpty().withMessage("Country must be a string"),
    handleValidationErrors
]
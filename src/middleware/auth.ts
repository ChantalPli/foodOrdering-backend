import { NextFunction, Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken"
import User from "../models/user";
import { types } from "util";

declare global {
  namespace Express {
    interface Request {
      userId: string
      auth0Id: string
    }
  }
}


//middleware added to the roots.It will check the authorisation header to verify that the token in the request belongs to a user logged in

//it checks if the user is logged in and has a valid access token 
export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: 'RS256'
});

//it gets the user info out of the access token and check if the user exists 
export const jwtParse = async (req: Request, res: Response, next: NextFunction) => {
  //to get the access token from the authorisation header in the request:
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401)
  }
  //if we have a valid authorisation header from the auth string:
  //Bearer fksjcksjdc
  const token = authorization?.split(" ")[1]

  if (!token) {
    res.status(401).send("Token is missing");
    return;
  }

  //we decode the token with jwt:
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload
    const auth0Id = decoded.sub //.sub holds the auth0 id of the user

    //looking for the userId in the db:
    const user = await User.findOne({ auth0Id })

    if (!user) {
      return res.sendStatus(401)
    }
    //if there is the user, we add the userid to the req.
    //when the token is decoded the userId is added and the req object is passed to the handler in the 
    //controller (updateCurrentUser)
    req.auth0Id = auth0Id as string
    req.userId = user._id.toString()
    next() // it calls the updateCurrentUser func 

  } catch (error) {
    return res.status(401)
  }
}

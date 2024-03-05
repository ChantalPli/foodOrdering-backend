import { Request, Response } from "express"
import Restaurant from "../models/restaurant"
import cloudinary from "cloudinary"
import mongoose from "mongoose"


//HANDLERS

const getMyRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId })

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    //if we have a restaurant we pass it back:
    res.json(restaurant)


  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error fetching restaurant" })
  }
}

const createMyRestaurant = async (req: Request, res: Response) => {
  try {
    //to check if user has an existing restaurant in the db. 
    //user can only add one restaurant.
    const existingRestaurant = await Restaurant.findOne({ user: req.userId })

    //if user already has a restaurant
    if (existingRestaurant) {
      return res
        .status(409)
        .json({ message: "User restaurant already exists" })
    }

    //to create data uri string that represents the image we got in the req//cloudinary
    const image = req.file as Express.Multer.File

    //we convert the img to a base 64 string and we pass it to a datauri string:
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    //we upload the img to cloudinary:
    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI)//img url in the uploadResonse

    const restaurant = new Restaurant(req.body) //we create a new restaurant 
    restaurant.imageUrl = uploadResponse.url//we add it the imageUrl
    restaurant.user = new mongoose.Types.ObjectId(req.userId) //we link the current loggedin user to the restaurant
    restaurant.lastUpdated = new Date()

    await restaurant.save()

    res.status(201).send(restaurant)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export default {
  getMyRestaurant,
  createMyRestaurant
}
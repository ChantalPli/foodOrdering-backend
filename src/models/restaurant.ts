import mongoose from "mongoose"

const restaurantSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, //reference to the user that created the resturant 
    restaurantName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    deliveryPrice: {
        type: Number,
        required: true
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true
    },
    cuisines: [{ type: String, required: true }],
    menuItems: [menuItemSchema],
    imageUrl: { type: String, required: true }, //url sent back by cloudinary
    lastUpdated: { type: Date, required: true }

})

const Restaurant = mongoose.model("Restaurant", restaurantSchema)
export default Restaurant
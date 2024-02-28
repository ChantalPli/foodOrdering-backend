//SERVER

import express, { Request, Response } from "express"
import cors from "cors"
import "dotenv/config"
import mongoose from "mongoose"
import myUserRoute from "./routes/MyUserRoute"

mongoose
    .connect(process.env.MONGO_DB_CONNECTION_STRING as string)
    .then(() => console.log("connected to database!"))

const app = express()
app.use(express.json()) //middleware
app.use(cors())

//RENDER - to check if the server has successfully started
app.get("/health", async (req: Request, res: Response) => {
    res.send({ message: "health ok!" })
})

app.use("/api/my/user", myUserRoute)

app.listen(7000, () => {
    console.log('listening on port 7000')
})
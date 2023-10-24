import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();
import io from "./socket.js";
import errorHandler from "./middleware/errorHandler.js";
import roomsRouter from "./routes/handleRooms.js"
const app = express();
const appPort = process.env.PORT || 5555;

app.listen(appPort,()=>{
    console.log("App is listening on port",appPort);
});
app.use(json());
app.use(cors());

app.use("/handleRooms",roomsRouter);

app.use(errorHandler);
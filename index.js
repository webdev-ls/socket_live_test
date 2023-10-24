import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv"
dotenv.config();
import errorHandler from "./middleware/errorHandler.js";
import roomsRouter from "./routes/handleRooms.js"
const app = express();
const appPort = process.env.PORT || 5555;

// app.listen(appPort,()=>{
//     console.log("App is listening on port",appPort);
// });
app.use(json());
app.use(cors());

import { createServer } from "http";
import {Server} from 'socket.io';
import { hostLiveTest, joinedTest, makeQuestionActive, revealAnswer, revealOptions, sendAnswerAnalytics, takeLiveTest } from "./controllers/testController.js";
const socketPort = process.env.PORT || 5500;
const allowedOrigins = process.env.ALLOWED_ORIGINS || "http://localhost:3000";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
  
io.on("connection", (socket) => {
    const test = socket.handshake.query.testId;

    // Invigilator Test Portal Joining Event
    hostLiveTest(socket,io);
    // Candidate Test Portal Joining Event
    takeLiveTest(socket,io);
    // Candidate Joined Event
    joinedTest(socket,io);
    // Question Active Via Invigilator
    makeQuestionActive(socket,io);
    // Question Options Revealed Via Invigilator
    revealOptions(socket,io);
    // reveal answer by invigilator
    revealAnswer(socket,io);
    // 
    sendAnswerAnalytics(socket,io);


    console.log("joined",socket.id);





    // chatEvents(socket, io);
    // notificationEvents(socket, io);
    
    
    // const roomExists = io.sockets.adapter.rooms.has(test);
    // socket.join(test);
    // socket.leave(socket.id);
    // io.sockets.adapter.rooms.delete(socket.id)
    // console.log("a new user joined",socket.id);
    // if(roomExists){
    //     console.log("a new user joined",socket.id);
    // }else{
    //     console.log("room not found");
    //     socket.disconnect(true);
    // }
});



// socket.on('joinTestPortal', (testId) => {
//     const roomExists = io.sockets.adapter.rooms.has(testId);
//     if (roomExists) {
//       socket.join(testId);
//     } else {
//       // Handle unauthorized room access or send an error message
//       socket.emit('error', 'You can only join the "123" room.');
//     }
// });
// Get the namespace
// setInterval(() => {
//     const roomNamespace = io.of('123');
//     console.log("emoit");
//     // Emit a message to a specific event for all sockets in that namespace
//     io.to('123').emit('eventName', 'Message dataascsCVJNCJ');
//     roomNamespace.emit('eventName', 'Message data');
    
// }, 4000);


httpServer.listen(socketPort,()=>{
    console.log("Socket is listening on port",socketPort);
});





app.use("/handleRooms",roomsRouter);

app.use(errorHandler);
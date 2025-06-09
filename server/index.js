const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");


const app = express();
const socket = require("socket.io");
const dotenv = require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log("DB connection succesful");
})
.catch((err)=>{
    console.log(err.message);
});


const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server Started on Port ${process.env.PORT}`);
});

app.options('*', cors());

const io = socket(server,{
    cors : {
        origin : "http://localhost:3000",
        credentials : true,
    }
});

global.onlineUsers = new Map();

io.on("connection", (socket)=>{
    global.chatSocket = socket;
    socket.on("add-user", (userId) =>{
        onlineUsers.set(userId,socket.id);
    });
    socket.on("send-msg", (data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            io.sockets.emit("msg-recieve", {receiver:sendUserSocket,data:data.message});
        }
    })
});
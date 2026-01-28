import express from "express";
import dotenv from "dotenv"
import cors from "cors"
import resumeRoute from "./src/routes/resume.route.js";
import authRoute from "./src/routes/user.route.js";
import chatRoute from "./src/routes/chat.route.js";

dotenv.config();

const app=express()
const PORT=process.env.PORT;

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000" ,
  credentials: true
}));


app.get("/",(req,res)=>{
    res.send({
        "message":"Server is working"
    })
})

app.use("/api/resume",resumeRoute);
app.use("/api/user",authRoute);
app.use("/api/chat",chatRoute);

app.listen(PORT,()=>{
    console.log(`Server is listening at port ${PORT}`);
})
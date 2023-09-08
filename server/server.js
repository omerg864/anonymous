import express from "express";
import dotenv from "dotenv";
import path from "path";
import colors from 'colors';
import { errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
const config = dotenv.config();
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import hashtagRouter from './routes/hashtagRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import groupRouter from './routes/groupRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import reportRouter from './routes/reportRoutes.js';


connectDB();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use('/api/name', name); use the route
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/hashtag", hashtagRouter);
app.use("/api/message", messageRouter);
app.use("/api/group", groupRouter);
app.use("/api/comment", commentRouter);
app.use("/api/report", reportRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'));
  })
}

app.use(errorHandler);
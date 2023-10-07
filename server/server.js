import dotenv from "dotenv";
import express from "express";
import path from "path";
import colors from 'colors';
import { errorHandler } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import hashtagRouter from './routes/hashtagRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import groupRouter from './routes/groupRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import reportRouter from './routes/reportRoutes.js';
import chatRouter from './routes/chatRoute.js';
import cors from 'cors';
import { fileURLToPath } from 'url';
import http from 'http';
import { WebSocketServer } from "ws";
import url from 'url';
import { decodeToken } from "./utils/globalFunctions.js";

const config = dotenv.config();


connectDB();

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app);

const wss = new WebSocketServer({ server: server });

wss.on('connection', function connection(ws, req) {
  const parameters = url.parse(req.url, true);
  ws.id = decodeToken(parameters.query.token);
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

server.listen(PORT, () => {
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
app.use('/api/chat', chatRouter);

  app.use(express.static(path.join(__dirname, '../client/')));

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'client', 'index.html'));
  })

app.use(errorHandler);

export { wss };
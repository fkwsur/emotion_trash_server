const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const yenv = require("yenv");
const socket = require("./service/socket");
const env = yenv("environment.yaml", {
  env: "api_server",
});
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({limit: '50mb'})); 
app.use(express.urlencoded({limit: '50mb', extended: false}));


const httpServer = require("http")
  .createServer(app)
  .listen(8081 || env.PORT, async () => {
    await Promise.all([
      socket.subscriber.connect(),
      socket.publisher.connect(),
    ]);
    console.log("server on");
  });

socket.io.attach(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

socket.ChattingAndAlarm();

const express = require("express");
const app = express();
const db = require("./models");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const yenv = require("yenv");
const socket = require("./service/socket");
const Router = require("./routes");
const utils = require('./utils');
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

app.use("/api/v1/user", Router.userRouter);
app.use("/api/v1/chat", Router.chattingRouter);

const check_mysql_health = async () => {
  setInterval(async () => {
    try {
      await db.sequelize.authenticate();
    } catch (error) {
      console.log("db ping error : ", error);
    }
  }, 60000 * 3);
};

// mysql + sequelize
db.sequelize
  .authenticate()
  .then(async () => {
    try {
      const { sequelize } = require("./models");
      await sequelize.sync(true);
      console.log("db connect ok");
    } catch (err) {
      console.log("seq:", err);
    }
  })
  .catch(async (err) => {
    await SlackAPI.SendErrorChannel({
      location: "db -sequelize",
      error: err.toString(),
    });
    process.exit(0);
});

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

check_mysql_health();
socket.Chatting();

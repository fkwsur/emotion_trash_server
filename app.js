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


const passUrls = [
  "/api/v1/user/signup",
  "/api/v1/user/signin",
  "/api/v1/user/check/phone",
  "/api/v1/user/get/password",
  "/api/v1/user/auto/signin",
  "/api/v1/user/issuetoken",
];

const loginPageURL = process.env.LOGINPAGE_URL;

app.use(async (req, res, next) => {
  try {
    if (req.url.startsWith("/api/v1")) {
      const QuerySection = req.url.split("?")[1];

      if (QuerySection != undefined) {
        if (
          QuerySection.includes("insert") ||
          QuerySection.includes("select") ||
          QuerySection.includes("delete") ||
          QuerySection.includes("update")
        ) {
          return res.redirect(loginPageURL);
        }
      }
      if (req.headers.authorization == undefined) {
        if (passUrls.includes(req.url.split("?")[0])) {
          return next();
        }
        console.log("token is undefined");
        return res.redirect(loginPageURL);
      }
      // 오류정책이 필요 // 토큰 유무만 검사
      const isOk = jwt.verifyToken(req.headers.authorization);
      if (isOk === "") {
        console.log("token is may be error, return null from verifytoken");
        return res.redirect(loginPageURL);
      }
      next();
    } else {
      console.log("this request is not available. check from routes");
      return res.redirect(loginPageURL);
    }
  } catch (error) {
    console.log(error);
    if (error.name.includes("TokenExpiredError")) {
      return res.status(200).json({ expired: true });
    }
    console.log("this error is not handling error");
    return res.redirect(loginPageURL);
  } finally {
      SlackAPI.LoggingChannel({
      url: req.url,
    });
  }
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

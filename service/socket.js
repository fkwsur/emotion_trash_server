const io = require("socket.io")();
const redis = require("redis");
const shortid = require("shortid");
const {question} = require("../service/llm");
const dotenv = require("dotenv");
dotenv.config();

//카프카
const { Kafka } = require("kafkajs");
const kafka = new Kafka({
  clientId: "kafka-client",
  brokers: [`${process.env.BROKER}:9092`],
});
const producer = kafka.producer();
const kafkaConnect = async () => {
  await producer.connect();
};

const redisOptions = {
  retry_strategy: function (options) {
    if (options.error && options.error.code === "ECONNREFUSED") {
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  },
  url: `redis://${process.env.REDIS_HOST}:6379`,
};
const subscriber = redis.createClient(redisOptions);
const publisher = redis.createClient(redisOptions);

subscriber.on("connect", () => {
  console.log("Subscriber connected to Redis");
});
publisher.on("connect", () => {
  console.log("Publisher connected to Redis");
});
subscriber.on("error", (err) => {
  console.error("Subscriber error:", err);
});
publisher.on("error", (err) => {
  console.error("Publisher error:", err);
});

module.exports = {
  subscriber,
  publisher,
  io: io,
  ChattingAndAlarm: async () => {
    io.on("connection", (socket) => {
      // llm 대답 오는거 확인하려고 했는데 금액초과됨
      socket.on("chat", async (obj) => {
        try {
          if(obj !== undefined){
            let answer = await question(obj)
            console.log(answer)
          }
        } catch (error) {
          console.log(error);
        }
      });
    });

    kafkaConnect();
  },
};

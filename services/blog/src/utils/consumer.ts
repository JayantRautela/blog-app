import amqp from "amqplib";
import { redisClient } from "./redis.js";
import type { RedisArgument } from "redis";
import { sql } from "./db.js";

interface CacheInvalidationMessage {
  action: string;
  keys: String[];
};

export const startCacheConsumer = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: process.env.RABBITMQ_PORT as unknown as number,
      username: process.env.RABBITMQ_USERNAME,
      password: process.env.RABBITMQ_PASSWORD,
    });

    const channel = await connection.createChannel();

    const queueName = "cache-invalidation";

    await channel.assertQueue(queueName, { durable: true });

    console.log("Blog service cachme consumer started");

    channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString()) as CacheInvalidationMessage;

          console.log("Message recieved ", content);

          if (content.action === "invalidateCache") {
            for (const pattern of content.keys) {
              const keys = await redisClient.keys(pattern as RedisArgument);

              if (keys.length > 0) {
                await redisClient.del(keys);
                console.log(`Blog service invalidated ${keys.length} cache keys matching : ${pattern}`);

                const searchQuery = "";
                const category = "";

                const cacheKey = `blogs:${searchQuery}:${category};`

                const blogs = await sql `SELECT * FROM blogs ORDER BY created_at DESC`;

                await redisClient.set(cacheKey, JSON.stringify(blogs), { EX: 3600 });

                console.log("Cache rebuilded in blog service with key :- ", cacheKey);
              }
            }
          }

          channel.ack(msg);
        } catch (error) {
          console.log("Error processing cache invalidation in blog service :- ", error);
          
          channel.nack(msg, false, true);
        }
      }
    })
  } catch (error) {
    console.log("Failed to start blog service consumer :- ", error);
  }
}
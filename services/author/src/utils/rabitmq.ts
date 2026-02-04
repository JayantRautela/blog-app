import amqp from "amqplib";

let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect({
      protocol: "amqp",
      hostname: "localhost",
      port: 5672,
      username: process.env.RABBITMQ_USER,
      password: process.env.RABBITMQ_PASSWORD
    });

    channel = await connection.createChannel();

    console.log("Connection to rabmitmq successful");
  } catch (error) {
    console.log("Error in connecting to rabbitmq :- ", error);
  }
}

export const publishToQueue = async (queueName: string, message: any) => {
  if (!channel) {
    console.error("RabbmitMQ channel is not initialized");
    return;
  }

  await channel.assertQueue(queueName, { durable: true });

  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true
  });
}

export const invalidateCacheJob = async (cacheKey: string[]) => {
  try {
    const message = {
      action: "InvalidateCache",
      keys: cacheKey
    };

    await publishToQueue("cache-invalidation", message);

    console.log("Cache invalidation job published to RabbitMQ")
  } catch (error) {
    console.log("Failed to publish cache on rabbitmq :- ", error);
  }
}
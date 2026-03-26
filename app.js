const express = require("express");
const { createClient } = require("redis");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = Number(process.env.PORT) || 8090;
const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_DB = process.env.MONGODB_DB || "devops_voting";
const MONGODB_COLLECTION = process.env.MONGODB_COLLECTION || "votes";
const VOTE_KEY = "world_war_3_vote_totals";

const mongoClient = new MongoClient(MONGODB_URI);
const redisClient = createClient({ url: REDIS_URL });

redisClient.on("error", (error) => {
  console.error("Redis error:", error.message);
});

async function connectDatabases() {
  await redisClient.connect();
  await mongoClient.connect();
  console.log("Connected to Redis and MongoDB");
}

async function getVoteTotals() {
  const redisVotes = await redisClient.hGetAll(VOTE_KEY);
  return {
    iran: Number(redisVotes.iran || 0),
    usa: Number(redisVotes.usa || 0),
  };
}

async function saveVote(option) {
  const normalizedOption = option === "iran" ? "iran" : option === "usa" ? "usa" : null;

  if (!normalizedOption) {
    throw new Error("Invalid vote option");
  }

  const totals = await redisClient.multi().hIncrBy(VOTE_KEY, normalizedOption, 1).hGetAll(VOTE_KEY).exec();

  const latestTotals = {
    iran: Number(totals[1].iran || 0),
    usa: Number(totals[1].usa || 0),
  };

  const votesCollection = mongoClient.db(MONGODB_DB).collection(MONGODB_COLLECTION);

  await votesCollection.updateOne(
    { question: "Who will win World War 3?" },
    {
      $set: {
        question: "Who will win World War 3?",
        totals: latestTotals,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return latestTotals;
}

app.get("/", async (req, res) => {
  try {
    const totals = await getVoteTotals();

    res.send(`
      <html>
        <head>
          <title>DevOps Voting App</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            button { margin-right: 1rem; padding: 0.5rem 1rem; }
            .count { margin-top: 1rem; }
          </style>
        </head>
        <body>
          <h1>Who will win World War 3?</h1>
          <p>Pick one option below:</p>
          <form method="POST" action="/vote">
            <button type="submit" name="option" value="iran">Iran</button>
            <button type="submit" name="option" value="usa">USA</button>
          </form>
          <div class="count"><strong>Iran Votes:</strong> ${totals.iran}</div>
          <div class="count"><strong>USA Votes:</strong> ${totals.usa}</div>
        </body>
      </html>
    `);
  } catch (error) {
    res.status(500).json({ error: "Unable to load votes", details: error.message });
  }
});

app.post("/vote", async (req, res) => {
  try {
    const totals = await saveVote(req.body.option);

    if (req.accepts("html")) {
      return res.redirect("/");
    }

    res.status(201).json({ message: "Vote saved", totals });
  } catch (error) {
    res.status(400).json({ error: "Unable to save vote", details: error.message });
  }
});

app.get("/health", async (req, res) => {
  try {
    await redisClient.ping();
    await mongoClient.db(MONGODB_DB).command({ ping: 1 });
    res.json({ status: "healthy" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", details: error.message });
  }
});

connectDatabases()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start app:", error.message);
    process.exit(1);
  });

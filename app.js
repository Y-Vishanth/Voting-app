const express = require("express");
const { createClient } = require("redis");
const { MongoClient } = require("mongodb");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
  const normalizedOption =
    option === "iran" ? "iran" : option === "usa" ? "usa" : null;

  if (!normalizedOption) {
    throw new Error("Invalid vote option");
  }

  const totals = await redisClient
    .multi()
    .hIncrBy(VOTE_KEY, normalizedOption, 1)
    .hGetAll(VOTE_KEY)
    .exec();

  const latestTotals = {
    iran: Number(totals[1].iran || 0),
    usa: Number(totals[1].usa || 0),
  };

  const votesCollection = mongoClient
    .db(MONGODB_DB)
    .collection(MONGODB_COLLECTION);

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
    { upsert: true }
  );

  return latestTotals;
}

app.get("/", async (req, res) => {
  try {
    const totals = await getVoteTotals();

    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Voting App</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="/socket.io/socket.io.js"></script>

  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }

    .container {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 16px;
      width: 90%;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }

    button {
      padding: 12px;
      margin: 10px;
      border: none;
      border-radius: 10px;
      width: 45%;
      font-size: 1rem;
      cursor: pointer;
      transition: 0.3s;
    }

    .iran { background: #22c55e; }
    .usa { background: #3b82f6; }

    button:hover { transform: scale(1.05); }

    .bar-container {
      margin-top: 10px;
      background: #334155;
      border-radius: 10px;
      overflow: hidden;
    }

    .bar {
      height: 20px;
      color: white;
      text-align: right;
      padding-right: 10px;
      line-height: 20px;
    }

    .iran-bar { background: #22c55e; }
    .usa-bar { background: #3b82f6; }
  </style>
</head>

<body>

<div class="container">
  <h1>🌍 Who will win World War 3?</h1>

  <form method="POST" action="/vote">
    <button class="iran" name="option" value="iran">🇮🇷 Iran</button>
    <button class="usa" name="option" value="usa">🇺🇸 USA</button>
  </form>

  <p>Iran: <span id="iranCount">${totals.iran}</span></p>
  <div class="bar-container">
    <div id="iranBar" class="bar iran-bar" style="width:50%"></div>
  </div>

  <p>USA: <span id="usaCount">${totals.usa}</span></p>
  <div class="bar-container">
    <div id="usaBar" class="bar usa-bar" style="width:50%"></div>
  </div>
</div>

<script>
  const socket = io();

  function updateUI(totals) {
    const total = totals.iran + totals.usa;

    const iranPercent = total ? (totals.iran / total) * 100 : 50;
    const usaPercent = total ? (totals.usa / total) * 100 : 50;

    document.getElementById("iranCount").innerText = totals.iran;
    document.getElementById("usaCount").innerText = totals.usa;

    document.getElementById("iranBar").style.width = iranPercent + "%";
    document.getElementById("usaBar").style.width = usaPercent + "%";

    document.getElementById("iranBar").innerText = Math.round(iranPercent) + "%";
    document.getElementById("usaBar").innerText = Math.round(usaPercent) + "%";
  }

  socket.on("voteUpdate", (totals) => {
    updateUI(totals);
  });
</script>

</body>
</html>
`);
  } catch (error) {
    res.status(500).json({ error: "Unable to load votes" });
  }
});

app.post("/vote", async (req, res) => {
  try {
    const totals = await saveVote(req.body.option);

    io.emit("voteUpdate", totals); // 🔥 LIVE UPDATE

    return res.redirect("/");
  } catch (error) {
    res.status(400).json({ error: "Unable to save vote" });
  }
});

app.get("/health", async (req, res) => {
  try {
    await redisClient.ping();
    await mongoClient.db(MONGODB_DB).command({ ping: 1 });
    res.json({ status: "healthy" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy" });
  }
});

connectDatabases()
  .then(() => {
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Startup failed:", error.message);
    process.exit(1);
  });

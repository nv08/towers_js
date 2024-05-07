const express = require("express");
const GameOfLife = require("./logic.js");
const cors = require("cors");
const { sendData } = require("./helper.js");
const app = express();

const port = 3000;
const REFRESH_RATE = 20000;
const height = 100;
const width = 100;
const INITIAL_CELLS = 0.35 * height * width;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const initialCells = [];

for (let i = 0; i < INITIAL_CELLS; i++) {
  initialCells.push({
    x: Math.floor(Math.random() * width),
    y: Math.floor(Math.random() * height),
  });
}

const board = new GameOfLife(height, width, initialCells);

let intervalId;

app.get("/board", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  sendData(res, board);

  if (!intervalId) {
    intervalId = setInterval(() => {
      if (board.grid && board.grid.length > 0) {
        board.simulate(1, 0);
        sendData(res, board);
      }
    }, REFRESH_RATE);
  }
});

app.post("/purchase", (req, res) => {
  const { x, y } = req.query;
  board.toggleCell(parseInt(x), parseInt(y));
  res.send({
    aliveCells: Array.from(board.aliveCells),
    purchasedCells: Array.from(board.purchasedCells),
    height: board.height,
    width: board.width,
  });
});

app.get("/reset", (req, res) => {
  const initialCells = [];

  for (let i = 0; i < INITIAL_CELLS; i++) {
    initialCells.push({
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    });
  }
  board.reset(initialCells);
  res.send({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

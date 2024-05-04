const express = require("express");
const GameOfLife = require("./logic.js");
const cors = require("cors");
const app = express();

const port = 3000;
const REFRESH_RATE = 15000;
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

app.get("/board", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // function to send data
  const sendData = () => {
    const resp = {
      aliveCells: Array.from(board.aliveCells),
      purchasedCells: Array.from(board.purchasedCells),
      height: board.height,
      width: board.width,
    };
    res.write(`data: ${JSON.stringify(resp)}\n\n`);
  };

  sendData();

  setInterval(() => {
    board.simulate(1, 0);
    sendData();
  }, REFRESH_RATE);
});

app.post("/purchase", (req, res) => {
  const { x, y } = req.query;
  const isToggled = board.toggleCell(parseInt(x), parseInt(y));
  console.log("purchase", x, y, isToggled);
  if (isToggled) {
    board.simulate(1, 0);
  }
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
  res.send({status: "ok"});
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

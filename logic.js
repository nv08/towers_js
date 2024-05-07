class GameOfLife {
  constructor(width, height, initialCells = []) {
    this.width = width;
    this.height = height;
    this.purchasedCells = new Set();
    this.aliveCells = new Set();
    this.grid = this.createGrid();
    this.populateGrid(initialCells);
  }

  createGrid() {
    const grid = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      grid[i] = new Array(this.width).fill(0);
    }
    return grid;
  }

  populateGrid(cells) {
    cells.forEach((cell) => {
      const { x, y } = cell;
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        this.grid[y][x] = 1;
        this.aliveCells.add(`${x},${y}`);
      }
    });
  }

  getNextGeneration() {
    const nextGrid = this.createGrid();
    const nextAliveCells = new Set();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isFixedCell(x, y)) {
          nextGrid[y][x] = this.grid[y][x]; // Keep the state of the fixed cell
        } else {
          const aliveNeighbours = this.countAliveNeighbours(x, y);
          if (this.grid[y][x] === 1) {
            if (aliveNeighbours < 2 || aliveNeighbours > 3) {
              nextGrid[y][x] = 0; // Cell dies due to underpopulation or overpopulation
            } else {
              nextGrid[y][x] = 1; // Cell survives
              nextAliveCells.add(`${x},${y}`);
            }
          } else {
            if (aliveNeighbours === 3) {
              nextGrid[y][x] = 1; // Cell becomes alive due to reproduction
              nextAliveCells.add(`${x},${y}`);
            }
          }
        }
      }
    }
    this.aliveCells = nextAliveCells;
    return nextGrid;
  }

  countAliveNeighbours(x, y) {
    let count = 0;
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        if (!(xOffset === 0 && yOffset === 0)) {
          const neighbourX = x + xOffset;
          const neighbourY = y + yOffset;
          if (
            neighbourX >= 0 &&
            neighbourX < this.width &&
            neighbourY >= 0 &&
            neighbourY < this.height &&
            this.grid[neighbourY][neighbourX] === 1
          ) {
            count++;
          }
        }
      }
    }
    return count;
  }

  simulate(numGenerations, delay) {
    if (numGenerations <= 0) {
      return;
    }
    this.grid = this.getNextGeneration();
    setTimeout(() => {
      this.simulate(numGenerations - 1, delay);
    }, delay);
  }

  toggleCell(x, y) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      if (this.grid[y][x] === 1 && !this.isFixedCell(x, y)) {
        this.purchasedCells.add(`${x},${y}`);
        this.aliveCells.delete(`${x},${y}`);
        this.grid[y][x] = 2;
        return 1;
      }
    }
    return 0;
  }

  isFixedCell(x, y) {
    return this.purchasedCells.has(`${x},${y}`);
  }
  reset(initialCells = []) {
    this.purchasedCells.clear();
    this.aliveCells.clear();
    this.grid = this.createGrid();
    this.populateGrid(initialCells);
  }
}

// Example usage:
// const width = 10;
// const height = 10;
// const initialCells = [
//   { x: 3, y: 3 },
//   { x: 4, y: 3 },
//   { x: 5, y: 3 },
// ];
// const game = new GameOfLife(width, height, initialCells);
// game.toggleCell(1, 4); // Toggle cell at x: 4, y: 4
// game.toggleCell(9, 4); // Toggle cell at x: 5, y: 4
// game.simulate(20, 4000); // Simulate 20 generations with a delay of 1 second between each generation

module.exports = GameOfLife;

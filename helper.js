const sendData = (res, board) => {
  const resp = {
    aliveCells: Array.from(board.aliveCells),
    purchasedCells: Array.from(board.purchasedCells),
    height: board.height,
    width: board.width,
  };
  res.write(`data: ${JSON.stringify(resp)}\n\n`);
};

module.exports = {
  sendData,
};

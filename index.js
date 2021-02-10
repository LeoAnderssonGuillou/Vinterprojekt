console.log("Hello world!");

let bg = "#3d3d40";
let ship = "#e3e3e3";
let preview = ship;
let hitBoat = "#b00000";
let missBg = "#303033";
let aimCell = "green";

let grid1 = new Array(10).fill(0).map(_ => new Array(10).fill({}));
let grid2 = new Array(10).fill(0).map(_ => new Array(10).fill({}));

let clickedCells = [];
let hitCells = [];
let boatCellsHit = 0;
let boatsPlaced = 0;
let gameState = 1;
let col = "";

const board1 = document.querySelector("#board1");
const board2 = document.querySelector("#board2");

//Setup style for boards
function boardSetup(board) {
  board.style.display = "grid";
  board.style.gridTemplateColumns = new Array(10)
    .fill("10%")
    .join(" ");
  board.style.gridTemplateRows = new Array(10).fill("10%").join(" ");
}
boardSetup(board1);
boardSetup(board2);

//Create cells for board1
for (let y = 0; y < 10; y++) {
  for (let x = 0; x < 10; x++) {
    const cell1 = document.createElement("div");
    board1.appendChild(cell1);
    cell1.addEventListener("click", () => {
      click(x, y);
    });
    cell1.addEventListener("mouseenter", () => {
      hover(x, y, true);
    });
    cell1.addEventListener("mouseleave", () => {
      hover(x, y, false);
    });

    cell1.id = `${x}:${y}`;
    grid1[x][y] = cell1.id;
    cell1.innerHTML = `${x}.${y}`;
  }
}
//Create cells for board2
for (let y = 0; y < 10; y++) {
  for (let x = 0; x < 10; x++) {
    const cell2 = document.createElement("div");
    board2.appendChild(cell2);
    cell2.addEventListener("click", () => {
      fire(x, y);
    });
    cell2.addEventListener("mouseenter", () => {
      aim(x, y, true);
    });
    cell2.addEventListener("mouseleave", () => {
      aim(x, y, false);
    });

    cell2.id = `${x}:${y}B`;
    grid2[x][y] = cell2.id;
    cell2.innerHTML = `${x}.${y}`;
  }
}

//For placing player boats
function click(x, y) {
  if (gameState == 1) {
    switch (boatsPlaced) {
      case 0: placeShip(grid1, x, y);
        break;
      case 1: placeSub(grid1, x, y);
        break;
      case 2: placeShip(grid1, x, y);
        break;
      case 3: placeCarrier(grid1, x, y);
        break;
      case 4: placeSub(grid1, x, y);
        gameState = 2;
        ship = "#6c6c70";
        placeOpponentBoats();
        break;
    }
  }
}

//For firing at opponent cell
function fire(x, y) {
  if (gameState == 2) {
    if (clickedCells.includes(grid2[x][y]) && !hitCells.includes(grid2[x][y])) {
      document.getElementById(grid2[x][y]).style.backgroundColor = hitBoat;
      hitCells.push(grid2[x][y]);
      boatCellsHit++;
      opponentAttack();
    }
    else if (!hitCells.includes(grid2[x][y])) {
      document.getElementById(grid2[x][y]).style.backgroundColor = missBg;
      hitCells.push(grid2[x][y]);
      opponentAttack();
    }
    else { }
  }
}

let validHit = false;
let baseHit = false;
let playerBoatCellsHit = 0;
let baseX = 0;
let baseY = 0;
let targetX = 0;
let targetY = 0;
let target = 0;
let state = 0;
let direction = 0;
validTarget = false;

function opponentAttack() {
  validHit = false;
  while (validHit == false)
    {
      switch (state) {
        case 0:
          baseX = random(0, 10);
          baseY = random(0, 10);
          opponentFire(baseX, baseY);
          if (baseHit == true) { state++; }
          break;
        case 1:
          validTarget = false;
          while (validTarget == false) {
            console.log("still false");
            targetX = baseX;
            targetY = baseY;
            direction = random(1, 5);
            if (direction == 1) {
              targetY = baseY - 1;
            }
            else if (direction == 2) {
              targetX = baseX + 1;
            }
            else if (direction == 3) {
              targetY = baseY + 1;
            }
            else if (direction == 4) {
              targetY = baseX - 1;
            }
            if (targetY < 10 && targetX < 10 && targetY  >= 0 && targetX >= 0) {
              console.log("inside board");
              //if (!hitCells.includes(grid1[targetX][targetY])) {
                validTarget = true;
                console.log("TRUE");
              //}
            }
          }
          baseHit = false;
          opponentFire(targetX, targetY);
          if (baseHit == true) {
            baseX = targetX;
            baseY = targetY;
          }
          break;
        case 2:

          break;
        case 3:

          break;
        case 4:

          break;
      }
  }
}

function opponentFire(x, y) {
  if (clickedCells.includes(grid1[x][y]) && !hitCells.includes(grid1[x][y])) {
    document.getElementById(grid1[x][y]).style.backgroundColor = hitBoat;
    hitCells.push(grid1[x][y]);
    playerBoatCellsHit++;
    baseHit = true;
    validHit = true;
  }
  else if (!hitCells.includes(grid1[x][y])) {
    document.getElementById(grid1[x][y]).style.backgroundColor = missBg;
    hitCells.push(grid1[x][y]);
    validHit = true;
  }
  else { }
}

//Howering over a cell when placing boats
function hover(x, y, entering) {
  if (entering == true) { col = preview; }
  else { col = bg; }
  if (gameState == 1) {
    switch (boatsPlaced) {
      case 0:
        previewShip(x, y, entering);
        break;
      case 1:
        previewSub(x, y, entering);
        break;
      case 2:
        previewShip(x, y, entering);
        break;
      case 3:
        previewCarrier(x, y, entering);
        break;
      case 4:
        previewSub(x, y, entering);
        break;
    }
  }
}

//Howering over an opponent cell during player turn
function aim(x, y, entering) {
  if (entering == true) { col = aimCell; }
  else { col = bg; }
  if (gameState == 2) {
    if (!hitCells.includes(grid2[x][y])) {
      document.getElementById(grid2[x][y]).style.backgroundColor = col;
    }
    else { }
  }
}

function placeOpponentBoats() {
  let done = false;
  let x = 0;
  let y = 0;
  boatsPlaced = 0;
  while (done == false) {
    x = random(0, 10);
    y = random(0, 10);
    console.log(`${x}.${y}`);
    switch (boatsPlaced) {
      case 0: placeShip(grid2, x, y);
        break;
      case 1: placeSub(grid2, x, y);
        break;
      case 2: placeShip(grid2, x, y);
        break;
      case 3: placeCarrier(grid2, x, y);
        break;
      case 4: placeSub(grid2, x, y);
        break;
      case 5: done = true;
        break;
    }
  }
}

function placeShip(grid, x, y) {
  if (clickedCells.includes(grid[x][y]) || clickedCells.includes(grid[x][y + 1]) || clickedCells.includes(grid[x][y - 1]) || y - 1 < 0 || y + 1 > 9) { }
  else {
    document.getElementById(grid[x][y]).style.backgroundColor = ship;
    clickedCells.push(grid[x][y]);
    document.getElementById(grid[x][y + 1]).style.backgroundColor = ship;
    clickedCells.push(grid[x][y + 1]);
    document.getElementById(grid[x][y - 1]).style.backgroundColor = ship;
    clickedCells.push(grid[x][y - 1]);
    boatsPlaced++;
  }
}
function previewShip(x, y) {
  if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x][y + 1]) || clickedCells.includes(grid1[x][y - 1]) || y - 1 < 0 || y + 1 > 9) { }
  else {
    document.getElementById(grid1[x][y]).style.backgroundColor = col;
    document.getElementById(grid1[x][y + 1]).style.backgroundColor = col;
    document.getElementById(grid1[x][y - 1]).style.backgroundColor = col;
  }
}

function placeSub(grid, x, y) {
  if (x + 1 < 10) {
    if (clickedCells.includes(grid[x][y]) || clickedCells.includes(grid[x + 1][y]) || x - 1 < 0 || x + 1 > 9) { }
    else {
      document.getElementById(grid[x][y]).style.backgroundColor = ship;
      clickedCells.push(grid[x][y]);
      document.getElementById(grid[x + 1][y]).style.backgroundColor = ship;
      clickedCells.push(grid[x + 1][y]);
      boatsPlaced++;
    }
  }
}
function previewSub(x, y) {
  if (x + 1 < 10) {
    if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x + 1][y])) { }
    else {
      document.getElementById(grid1[x][y]).style.backgroundColor = col;
      document.getElementById(grid1[x + 1][y]).style.backgroundColor = col;
    }
  }
}

function placeCarrier(grid, x, y) {
  if (x + 2 < 10 && x > 0) {
    if (clickedCells.includes(grid[x][y]) || clickedCells.includes(grid[x + 1][y]) || clickedCells.includes(grid[x + 2][y]) || clickedCells.includes(grid[x - 1][y])) { }
    else {
      document.getElementById(grid[x][y]).style.backgroundColor = ship;
      clickedCells.push(grid[x][y]);
      document.getElementById(grid[x + 1][y]).style.backgroundColor = ship;
      clickedCells.push(grid[x + 1][y]);
      document.getElementById(grid[x + 2][y]).style.backgroundColor = ship;
      clickedCells.push(grid[x + 2][y]);
      document.getElementById(grid[x - 1][y]).style.backgroundColor = ship;
      clickedCells.push(grid[x - 1][y]);
      boatsPlaced++;
    }
  }
}
function previewCarrier(x, y) {
  if (x + 2 < 10 && x > 0) {
    if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x + 1][y]) || clickedCells.includes(grid1[x + 2][y]) || clickedCells.includes(grid1[x - 1][y])) { }
    else {
      document.getElementById(grid1[x][y]).style.backgroundColor = col;
      document.getElementById(grid1[x + 1][y]).style.backgroundColor = col;
      document.getElementById(grid1[x + 2][y]).style.backgroundColor = col;
      document.getElementById(grid1[x - 1][y]).style.backgroundColor = col;
    }
  }
}


function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

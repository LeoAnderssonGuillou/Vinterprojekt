console.log("Hello world!");

let bg = "#3d3d40";
let ship = "#e3e3e3";
let preview = ship;
let hitBoat = "#b00000";
let missBg = "#303033";
let aimCell = "lime";

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
let baseX2 = 0;
let baseY2 = 0;

let state = 0;
let direction = 0;
let validTarget = false;
let targetAttempt = 0;
let patternDirection = 0;
let directionInverted = false;

function opponentAttack() {
    switch (state) {
      //A random cell is selected. If it hits a boat, that cell is remembered as "base target" or baseX/baseY, and script moves on to state 1.
      case 0:
        console.log("STATE 0 ENTERED");
        validTarget = false;
        while (validTarget == false) {
          baseX = random(0, 10);
          baseY = random(0, 10);
          if (baseY < 10 && baseX < 10 && baseY  >= 0 && baseX >= 0) {
            if (!hitCells.includes(grid1[baseX][baseY])) {
              validTarget = true;
            }
          }
        }
        opponentFire(baseX, baseY);
        if (baseHit == true) { state = 1; }
        directionInverted = false;
        break;
      //Opponent tries hitting surrounding cells. If another boat cell is hit, it becomes baseX2/baseY2 and the script moves on to state 2. If no valid cell can be hit, it returns to state 0.
      case 1:
        console.log("STATE 1 ENTERED");
        targetAttempt = 0;
        validTarget = false;
        while (validTarget == false) {
          targetX = baseX;
          targetY = baseY;
          switch (targetAttempt) {
            case 0:
              targetY = baseY - 1;
              console.log("attempt 1");
              break;
            case 1:
              targetX = baseX + 1;
              console.log("attempt 2");
              break;
            case 2:
              targetY = baseY + 1;
              console.log("attempt 3");
              break;
            case 3:
              targetX = baseX - 1;
              console.log("attempt 4");
              break;
            case 4:
              console.log("give up");
              validTarget = true;
              state = 0;
              break;
          }
          if (targetY < 10 && targetX < 10 && targetY  >= 0 && targetX >= 0) {
            if (!hitCells.includes(grid1[targetX][targetY])) {
              validTarget = true;
            }
          }
          targetAttempt++;
        }
        baseHit = false;
        if (state == 1) {
          opponentFire(targetX, targetY);
        }
        if (baseHit == true) {
          baseX2 = targetX;
          baseY2 = targetY;
          patternDirection = targetAttempt - 1;
          state = 2;
        }
        break;
      //Now knowing the locations of at least two neighbouring cells (base & base2), the opponent can keep hitting the next cells on that axis. When it inevitably misses or calcualtes an invalid target, it moves on to state 3.
      case 2:
        console.log("STATE 2 ENTERED");
        validTarget = false;
        targetX = baseX2;
        targetY = baseY2;
        switch (patternDirection) {
          case 0:
            targetY = baseY2 - 1;
            break;
          case 1:
            targetX = baseX2 + 1;
            break;
          case 2:
            targetY = baseY2 + 1;
            break;
          case 3:
            targetX = baseX2 - 1;
            break;
          }
        if (targetY < 10 && targetX < 10 && targetY  >= 0 && targetX >= 0) {
          if (!hitCells.includes(grid1[targetX][targetY])) {
            console.log("VALID");
            validTarget = true;
          }
        }
        if (validTarget == false) {
          switch (patternDirection) {
            case 0:
              patternDirection = 2;
              break;
            case 1:
              patternDirection = 3;
              break;
            case 2:
              patternDirection = 0;
              break;
            case 3:
              patternDirection = 1;
              break;
            }
            baseX2 = baseX;
            baseY2 = baseY;
            directionInverted = true;
            state = 3;
            console.log("DIRECTION INVERTED");
            opponentAttackState3();
            break;
        }
        baseHit = false;
        if (validTarget == true) {
          opponentFire(targetX, targetY);
        }
        if (baseHit == true) {
          baseX2 = targetX;
          baseY2 = targetY;
          state = 2;
        }
        break;
        //The opponent will now try to hit base neighbours in the other direction. When it once again misses or runs into an invalid target, it knows it must be done with this boat and returns to state 0.
        case 3:
          opponentAttackState3();
          break;
    }
}

function opponentAttackState3() {
  console.log("STATE 3 ENTERED");
    validTarget = false;
    targetX = baseX2;
    targetY = baseY2;
  switch (patternDirection) {
    case 0:
      targetY = baseY2 - 1;
      break;
    case 1:
      targetX = baseX2 + 1;
      break;
    case 2:
      targetY = baseY2 + 1;
      break;
    case 3:
      targetX = baseX2 - 1;
      break;
    }
  if (targetY < 10 && targetX < 10 && targetY  >= 0 && targetX >= 0) {
    if (!hitCells.includes(grid1[targetX][targetY])) {
      validTarget = true;
      console.log("has an s3 shot");
    }
  }
  if (validTarget == false) {
    console.log("failure, reverting to monke");
    while (validTarget == false) {
      baseX = random(0, 10);
      baseY = random(0, 10);
      if (baseY < 10 && baseX < 10 && baseY  >= 0 && baseX >= 0) {
        if (!hitCells.includes(grid1[baseX][baseY])) {
          validTarget = true;
          console.log("has a monke shot");
        }
      }
    }
    console.log("firing monke shot");
    opponentFire(baseX, baseY);
    if (baseHit == true) { state = 1; }
    else { state = 0; }
    directionInverted = false;
  }

  baseHit = false;
  if (state == 3) {
    console.log("firing s3 shot");
    opponentFire(targetX, targetY);
  }
  if (baseHit == true) {
    baseX2 = targetX;
    baseY2 = targetY;
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
  else {console.log("what"); }
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

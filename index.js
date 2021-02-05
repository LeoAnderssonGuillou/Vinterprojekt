console.log("Hello world!");

let grid1 = new Array(10).fill(0).map(_=>new Array(10).fill({}));
let grid2 = new Array(10).fill(0).map(_=>new Array(10).fill({}));



let clickedCells = [];
let boatsPlaced = 0;
let gameState = 1;

const board1 = document.querySelector("#board1");
const board2 = document.querySelector("#board2");

function boardSetup(board){
  board.style.display = "grid";
  board.style.gridTemplateColumns = new Array(10)
  .fill("10%")
  .join(" ");
  board.style.gridTemplateRows = new Array(10).fill("10%").join(" ");
}
boardSetup(board1);
boardSetup(board2);

for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell1 = document.createElement("div");
      board1.appendChild(cell1);
      cell1.addEventListener("click", ()=> {
        click(x,y);
      });
      cell1.addEventListener("mouseenter", ()=> {
        hover(x,y);
      });

      cell1.id = `${x}:${y}`;
      grid1[x][y] = cell1.id;
      cell1.innerHTML = `${x}:${y}`;
    }
  }
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell2 = document.createElement("div");
      board2.appendChild(cell2);
      cell2.addEventListener("click", ()=> {
        click(x,y);
      });

      cell2.id = `${x}:${y}B`;
      grid2[x][y] = cell2.id;
      cell2.innerHTML = `${x}:${y}`;
    }
  }
  

function click(x, y){
  if (gameState == 1)
  {
    switch(boatsPlaced)
    {
      case 0: placeShip(x,y);
              break;
      case 1: placeSub(x,y);
              break;
      case 2: placeShip(x,y);
              break;
      case 3: placeCarrier(x,y);
              break;
      case 4: placeSub(x,y);
              gameState = 2;
              break;
    }
  }
  if (gameState == 2)
  {
    
  }
}

function hoverEnter(x, y){
  if (gameState == 1)
  {
    switch(boatsPlaced)
    {
      case 0: placeShip(x,y);
              break;
      case 1: placeSub(x,y);
              break;
      case 2: placeShip(x,y);
              break;
      case 3: placeCarrier(x,y);
              break;
      case 4: placeSub(x,y);
              gameState = 2;
              break;
    }
  }
}

function placeShip(x, y){
  if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x][y+1]) || clickedCells.includes(grid1[x][y-1]))
  {}
  else
  {
    document.getElementById(grid1[x][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x][y]);
    document.getElementById(grid1[x][y+1]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x][y+1]);
    document.getElementById(grid1[x][y-1]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x][y-1]);
    boatsPlaced++;
  }
}
function previewShip(x, y, entering){
  col = "";
  if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x][y+1]) || clickedCells.includes(grid1[x][y-1]))
  {}
  else
  {
    if (entering == true) {col = "lightgreen";}
    else {col = "lightgray";}
    document.getElementById(grid1[x][y]).style.backgroundColor = col;
    document.getElementById(grid1[x][y+1]).style.backgroundColor = col;
    document.getElementById(grid1[x][y-1]).style.backgroundColor = col;
  }
}

function placeSub(x, y){
  if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x][y+1]))
  {}
  else
  {
    document.getElementById(grid1[x][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x][y]);
    document.getElementById(grid1[x+1][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x+1][y]);
    boatsPlaced++;
  }
}

function placeCarrier(x, y){
  if (clickedCells.includes(grid1[x][y]) || clickedCells.includes(grid1[x+1][y]) || clickedCells.includes(grid1[x+2][y]) || clickedCells.includes(grid1[x-1][y]))
  {}
  else
  {
    document.getElementById(grid1[x][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x][y]);
    document.getElementById(grid1[x+1][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x+1][y]);
    document.getElementById(grid1[x+2][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x+2][y]);
    document.getElementById(grid1[x-1][y]).style.backgroundColor = "lime";
    clickedCells.push(grid1[x-1][y]);
    boatsPlaced++;
  }
}



// if (clickedCells.includes(grid[x][y]))
//   {
//     document.getElementById(grid[x][y]).style.backgroundColor = "lightgray";
//     clickedCells.splice(grid[x][y], 1);
//     console.log("Removed");
//   }
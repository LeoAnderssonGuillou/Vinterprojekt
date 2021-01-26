console.log("Hello world!");

//let grid = new Array(10).fill(0).map(_=>new Array(10).fill({}));
let grid = [
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10),
    new Array(10)
];

const field = document.querySelector("#board");

field.style.display = "grid";
field.style.gridTemplateColumns = new Array(10)
  .fill("10%")
  .join(" ");
  field.style.gridTemplateRows = new Array(10).fill("10%").join(" ");

for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      field.appendChild(cell);
      cell.addEventListener("click", click);

      cell.id = `${x}:${y}`;
      grid[x][y] = cell.id;
      cell.innerHTML = `${x}:${y}`;
    }
  }

function click(){
  console.log("bruh");
  document.getElementById(this.id).style.backgroundColor = "#f6f8f9";
}
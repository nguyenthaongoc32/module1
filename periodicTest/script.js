const rows = 3;
const cols = 4;
let grid = [];
let playerPos = { x: 3, y: 2 };
let timer = null;
let seconds = 0;
let steps = 0;
let playing = false;
let history = [];


function createGrid() {
    const gridElement = document.getElementById("grid");
    gridElement.innerHTML = "";
    grid = [];
  
    const totalCells = rows * cols;
    const numbers = Array.from({ length: 11 }, (_, i) => i + 1);
    while (numbers.length < totalCells - 1) numbers.push(""); 
    numbers.push(""); 
  

    for (let i = 0; i < 2; i++) {
      const a = Math.floor(Math.random() * totalCells);
      const b = Math.floor(Math.random() * totalCells);
      [numbers[a], numbers[b]] = [numbers[b], numbers[a]];
    }
  
    const colors = [
      "#d1fae5", 
      "#fee2e2", 
      "#dbeafe", 
      "#ede9fe", 
      "#fce7f3", 
      "#fef9c3", 
      "#e0e7ff", 
      "#f3f4f6", 
      "#d1fae5", 
      "#fef3c7", 
      "#ecfccb"  
    ];
  
    const textColors = [
      "#10b981", "#ef4444", "#3b82f6", "#8b5cf6", "#ec4899", "#eab308",
      "#6366f1", "#6b7280", "#059669", "#f59e0b", "#65a30d"
    ];
  
    for (let y = 0; y < rows; y++) {
      const row = [];
      for (let x = 0; x < cols; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
  
        const value = numbers[y * cols + x];
        if (value === "") {
          cell.classList.add("player");
          playerPos = { x, y };
        } else {
          cell.textContent = value;
  
          const index = value - 1;
          cell.style.backgroundColor = colors[index];
          cell.style.color = textColors[index];
        }
  
        gridElement.appendChild(cell);
        row.push(cell);
      }
      grid.push(row);
    }
  }
  

function startTimer() {
  clearInterval(timer);
  seconds = 0;
  timer = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function updateTimer() {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${mins}:${secs}`;
}

function stopTimer() {
  clearInterval(timer);
}


function toggleGame() {
    const btn = document.getElementById("startBtn");
    const winMsg = document.getElementById("winMessage");
  
    if (!playing) {
      playing = true;
      steps = 0;
      winMsg.classList.add("hidden");
      createGrid();
      startTimer();
      btn.textContent = "Kết thúc";
      btn.classList.add("active"); 
    } else {
      playing = false;
      stopTimer();
      btn.textContent = "Bắt đầu";
      btn.classList.remove("active"); 
    }
  }
  


function movePlayer(dx, dy) {
  if (!playing) return;

  const newX = playerPos.x + dx;
  const newY = playerPos.y + dy;
  if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) return;

  const oldCell = grid[playerPos.y][playerPos.x];
  const newCell = grid[newY][newX];

  oldCell.textContent = newCell.textContent;
  oldCell.classList.remove("player");
  newCell.textContent = "";
  newCell.classList.add("player");

  playerPos = { x: newX, y: newY };
  steps++;
  checkWin();
}

function checkWin() {
  let expected = 1;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const cell = grid[y][x];
      const isLast = x === cols - 1 && y === rows - 1;
      if (!isLast) {
        if (parseInt(cell.textContent) !== expected) return;
        expected++;
      } else if (!cell.classList.contains("player")) {
        return;
      }
    }
  }

  playing = false;
  stopTimer();
  saveHistory();
  document.getElementById("winMessage").classList.remove("hidden");
  document.getElementById("startBtn").textContent = "Bắt đầu";
}


function saveHistory() {
  history.push({ id: history.length + 1, steps, time: seconds });
  renderHistory();
}

function renderHistory() {
  const tbody = document.getElementById("historyBody");
  tbody.innerHTML = "";
  history.forEach(h => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${h.id}</td><td>${h.steps}</td><td>${h.time}</td>`;
    tbody.appendChild(tr);
  });
}


document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp": case "w": case "W": movePlayer(0, -1); break;
    case "ArrowDown": case "s": case "S": movePlayer(0, 1); break;
    case "ArrowLeft": case "a": case "A": movePlayer(-1, 0); break;
    case "ArrowRight": case "d": case "D": movePlayer(1, 0); break;
  }
});

updateTimer();
createGrid();

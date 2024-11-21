let grid = [];
let score = 0;

// 初始化游戏网格
function initGrid() {
    for (let i = 0; i < 4; i++) {
        grid[i] = [];
        for (let j = 0; j < 4; j++) {
            grid[i][j] = 0;
        }
    }
}

// 在随机空位置生成新数字（2或4）
function generateNewNumber() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({x: i, y: j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
}

// 更新显示
function updateDisplay() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            cell.textContent = grid[i][j] || '';
            cell.style.backgroundColor = getCellColor(grid[i][j]);
        }
    }
    document.getElementById('score').textContent = score;
}

// 获取单元格颜色
function getCellColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#edc22e';
}

// 开始新游戏
function newGame() {
    score = 0;
    initGrid();
    generateNewNumber();
    generateNewNumber();
    updateDisplay();
}

// 处理键盘事件
document.addEventListener('keydown', function(event) {
    let moved = false;
    
    switch(event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    
    if (moved) {
        generateNewNumber();
        updateDisplay();
    }
});

// 向左移动
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = 0; j < row.length - 1; j++) {
            if (row[j] === row[j + 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j + 1, 1);
                moved = true;
            }
        }
        while (row.length < 4) {
            row.push(0);
        }
        if (row.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = row;
    }
    return moved;
}

// 向右移动
function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        for (let j = row.length - 1; j > 0; j--) {
            if (row[j] === row[j - 1]) {
                row[j] *= 2;
                score += row[j];
                row.splice(j - 1, 1);
                moved = true;
            }
        }
        while (row.length < 4) {
            row.unshift(0);
        }
        if (row.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = row;
    }
    return moved;
}

// 向上移动
function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            column.push(grid[i][j]);
        }
        column = column.filter(x => x !== 0);
        for (let i = 0; i < column.length - 1; i++) {
            if (column[i] === column[i + 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i + 1, 1);
                moved = true;
            }
        }
        while (column.length < 4) {
            column.push(0);
        }
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== column[i]) {
                moved = true;
            }
            grid[i][j] = column[i];
        }
    }
    return moved;
}

// 向下移动
function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            column.push(grid[i][j]);
        }
        column = column.filter(x => x !== 0);
        for (let i = column.length - 1; i > 0; i--) {
            if (column[i] === column[i - 1]) {
                column[i] *= 2;
                score += column[i];
                column.splice(i - 1, 1);
                moved = true;
            }
        }
        while (column.length < 4) {
            column.unshift(0);
        }
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== column[i]) {
                moved = true;
            }
            grid[i][j] = column[i];
        }
    }
    return moved;
}

// 初始化游戏
window.onload = function() {
    newGame();
}; 
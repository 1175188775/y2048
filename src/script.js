let grid = [];
let score = 0;
let bestScore = 0;
let isGameOver = false;
let isMoving = false;
let currentUser = null;
let leaderboard = [];

try {
    bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    currentUser = localStorage.getItem('currentUser');
} catch (error) {
    console.error('Local storage error:', error);
    // 重置数据
    localStorage.clear();
    bestScore = 0;
    leaderboard = [];
    currentUser = null;
}

// 初始化游戏网格
function initGrid() {
    grid = Array(4).fill().map(() => Array(4).fill(0));
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
        2048: '#edc22e',
        4096: '#3c3a32',
        8192: '#3c3a32',
        16384: '#3c3a32'
    };
    return colors[value] || '#3c3a32';
}

// 获取文字颜色
function getTextColor(value) {
    return value > 4 ? '#f9f6f2' : '#776e65';
}

// 更新显示
function updateDisplay() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.getElementById(`cell-${i}-${j}`);
            const value = grid[i][j];
            cell.textContent = value || '';
            cell.setAttribute('data-value', value);
            cell.style.color = getTextColor(value);
            if (value >= 1024) {
                cell.style.fontSize = '20px';
            } else if (value >= 128) {
                cell.style.fontSize = '25px';
            } else {
                cell.style.fontSize = '30px';
            }
        }
    }
    
    document.getElementById('score').textContent = score;
    if (score > bestScore) {
        bestScore = score;
        saveGameData();
        
        const userIndex = leaderboard.findIndex(user => user.name === currentUser);
        if (userIndex !== -1) {
            leaderboard[userIndex].bestScore = bestScore;
            saveGameData();
            updateLeaderboard();
        }
        
        document.getElementById('best-score').style.color = '#f65e3b';
        document.getElementById('best-score').style.textShadow = '0 0 10px rgba(246, 94, 59, 0.5)';
    }
    document.getElementById('best-score').textContent = bestScore;
}

// 生成新数字
function generateNewNumber() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({x: i, y: j});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[x][y] = Math.random() < 0.9 ? 4 : 8;
    }
}

// 检查游戏是否结束
function checkGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) return false;
            if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
            if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
        }
    }
    return true;
}

// 移动函数
function move(direction) {
    if (isGameOver || isMoving) return false;
    
    isMoving = true;
    let moved = false;
    
    try {
        switch(direction) {
            case 'left':
                moved = moveLeft();
                break;
            case 'right':
                moved = moveRight();
                break;
            case 'up':
                moved = moveUp();
                break;
            case 'down':
                moved = moveDown();
                break;
        }
        
        if (moved) {
            generateNewNumber();
            updateDisplay();
            
            if (checkGameOver()) {
                isGameOver = true;
                showGameOver();
            }
        }
    } finally {
        isMoving = false;
    }
    
    return moved;
}

// 向左移动
function moveLeft() {
    let moved = false;
    
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        let newRow = [];
        
        for (let j = 0; j < row.length; j++) {
            if (j < row.length - 1 && row[j] === row[j + 1]) {
                newRow.push(row[j] * 2);
                score += row[j] * 2;
                j++;
                moved = true;
            } else {
                newRow.push(row[j]);
            }
        }
        
        while (newRow.length < 4) newRow.push(0);
        
        if (newRow.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = newRow;
    }
    
    return moved;
}

// 向右移动
function moveRight() {
    let moved = false;
    
    for (let i = 0; i < 4; i++) {
        let row = grid[i].filter(x => x !== 0);
        let newRow = [];
        
        for (let j = row.length - 1; j >= 0; j--) {
            if (j > 0 && row[j] === row[j - 1]) {
                newRow.unshift(row[j] * 2);
                score += row[j] * 2;
                j--;
                moved = true;
            } else {
                newRow.unshift(row[j]);
            }
        }
        
        while (newRow.length < 4) newRow.unshift(0);
        
        if (newRow.join(',') !== grid[i].join(',')) {
            moved = true;
        }
        grid[i] = newRow;
    }
    
    return moved;
}

// 向上移动
function moveUp() {
    let moved = false;
    
    for (let j = 0; j < 4; j++) {
        let column = [];
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== 0) column.push(grid[i][j]);
        }
        
        let newColumn = [];
        for (let i = 0; i < column.length; i++) {
            if (i < column.length - 1 && column[i] === column[i + 1]) {
                newColumn.push(column[i] * 2);
                score += column[i] * 2;
                i++;
                moved = true;
            } else {
                newColumn.push(column[i]);
            }
        }
        
        while (newColumn.length < 4) newColumn.push(0);
        
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
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
            if (grid[i][j] !== 0) column.push(grid[i][j]);
        }
        
        let newColumn = [];
        for (let i = column.length - 1; i >= 0; i--) {
            if (i > 0 && column[i] === column[i - 1]) {
                newColumn.unshift(column[i] * 2);
                score += column[i] * 2;
                i--;
                moved = true;
            } else {
                newColumn.unshift(column[i]);
            }
        }
        
        while (newColumn.length < 4) newColumn.unshift(0);
        
        for (let i = 0; i < 4; i++) {
            if (grid[i][j] !== newColumn[i]) {
                moved = true;
            }
            grid[i][j] = newColumn[i];
        }
    }
    
    return moved;
}

// 显示游戏结束
function showGameOver() {
    // 更新当前用户的最高分
    const userIndex = leaderboard.findIndex(user => user.name === currentUser);
    if (userIndex !== -1) {
        if (score > leaderboard[userIndex].bestScore) {
            leaderboard[userIndex].bestScore = score;
            bestScore = score;
            saveGameData();
            updateLeaderboard();
        }
    }
    
    // 更新排行榜显示
    updateLeaderboard();
    
    // 显示游戏结束对话框
    const gameOver = document.createElement('div');
    gameOver.className = 'game-over';
    gameOver.innerHTML = `
        <div class="game-over-content">
            <h2>游戏结束!</h2>
            <p>本局得分: ${score}</p>
            <p>历史最高: ${bestScore}</p>
            ${score === bestScore ? '<p class="new-record">新纪录！</p>' : ''}
            <button onclick="restartGame()">重新开始</button>
        </div>
    `;
    document.querySelector('.container').appendChild(gameOver);
}

// 重新开始游戏
window.restartGame = function() {
    const gameOver = document.querySelector('.game-over');
    if (gameOver) {
        gameOver.remove();
    }
    isGameOver = false;
    score = 0;
    document.getElementById('best-score').style.color = '';
    initGrid();
    generateNewNumber();
    generateNewNumber();
    updateDisplay();
};

// 键盘事件处理
function handleKeyDown(event) {
    if (event.key.startsWith('Arrow')) {
        event.preventDefault();
        move(event.key.replace('Arrow', '').toLowerCase());
    }
}

// 触摸事件处理
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchEnd(event) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const minSwipeDistance = 20;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
            move(deltaX > 0 ? 'right' : 'left');
        }
    } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
            move(deltaY > 0 ? 'down' : 'up');
        }
    }
    
    touchStartX = 0;
    touchStartY = 0;
}

function handleTouchMove(event) {
    if (event.touches.length === 1) {
        event.preventDefault();
    }
}

// 显示用户名输入对话框
window.showNameInputDialog = function() {
    const dialog = document.createElement('div');
    dialog.className = 'game-over';
    dialog.innerHTML = `
        <div class="game-over-content">
            <h2>欢迎来到2048!</h2>
            <p>请输入你的名字 (1-5个字符):</p>
            <input type="text" id="username-input" maxlength="5" style="margin: 10px; padding: 5px;">
            <p id="name-error" style="color: #f65e3b; display: none;">名字不能为空!</p>
            <button onclick="submitUsername()">开始游戏</button>
        </div>
    `;
    document.querySelector('.container').appendChild(dialog);
    document.getElementById('username-input').focus();
};

// 提交用户名
window.submitUsername = function() {
    const input = document.getElementById('username-input');
    const error = document.getElementById('name-error');
    const name = input.value.trim();
    
    if (name.length === 0 || name.length > 5) {
        error.style.display = 'block';
        return;
    }
    
    currentUser = name;
    localStorage.setItem('currentUser', name);
    
    // 如果是新用户，添加到排行榜
    if (!leaderboard.find(user => user.name === name)) {
        leaderboard.push({ name: name, bestScore: 0 });
        saveGameData();
    }
    
    document.querySelector('.game-over').remove();
    updateLeaderboard();
    restartGame();
};

// 更新排行榜显示
function updateLeaderboard() {
    const leaderboardDiv = document.querySelector('.leaderboard') || createLeaderboardDiv();
    
    // 按分数排序
    leaderboard.sort((a, b) => b.bestScore - a.bestScore);
    
    // 更新排行榜内容
    leaderboardDiv.innerHTML = `
        <h3>排行榜</h3>
        <div class="leaderboard-list">
            ${leaderboard.map((user, index) => `
                <div class="leaderboard-item ${user.name === currentUser ? 'current-user' : ''}">
                    <span class="rank">${index + 1}</span>
                    <span class="name">${user.name}</span>
                    <span class="score">${user.bestScore}</span>
                </div>
            `).join('')}
        </div>
    `;
    saveGameData();
}

// 创建排行榜容器
function createLeaderboardDiv() {
    const leaderboardDiv = document.createElement('div');
    leaderboardDiv.className = 'leaderboard';
    document.querySelector('.container').appendChild(leaderboardDiv);
    return leaderboardDiv;
}

// 切换用户
window.switchToUser = function(username) {
    currentUser = username;
    localStorage.setItem('currentUser', username);
    
    // 更新最高分
    const user = leaderboard.find(u => u.name === username);
    if (user) {
        bestScore = user.bestScore;
        saveGameData();
    }
    
    closeUserDialog();
    updateLeaderboard();
    restartGame();
};

// 关闭对话框
window.closeUserDialog = function() {
    const dialog = document.querySelector('.game-over');
    if (dialog) {
        dialog.remove();
    }
};

// 修改初始化函数，添加切换用户按钮
window.onload = function() {
    const container = document.querySelector('.container');
    container.setAttribute('tabindex', '0');
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.focus();
    
    // 添加切换用户按钮
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.innerHTML = `
        <button onclick="newGame()">新游戏</button>
        <button onclick="showSwitchUserDialog()" class="switch-user-btn">切换用户</button>
    `;
    
    // 替换原有的新游戏按钮
    const oldButton = document.querySelector('button');
    oldButton.parentNode.replaceChild(buttonContainer, oldButton);
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.textContent = '使用方向键或滑动来移动方块';
    container.appendChild(instructions);
    
    window.newGame = restartGame;
    
    if (!currentUser) {
        showNameInputDialog();
    } else {
        updateLeaderboard();
        restartGame();
    }
};

// 添加切换用户对话框函数到全局作用域
window.showSwitchUserDialog = function() {
    const dialog = document.createElement('div');
    dialog.className = 'game-over';
    dialog.innerHTML = `
        <div class="game-over-content">
            <h2>切换用户</h2>
            <div class="user-list">
                ${leaderboard.map(user => `
                    <div class="user-item ${user.name === currentUser ? 'current-user' : ''}" 
                         onclick="switchToUser('${user.name}')">
                        ${user.name}
                        ${user.name === currentUser ? ' (当前用户)' : ''}
                    </div>
                `).join('')}
            </div>
            <div class="dialog-buttons">
                <button onclick="showNameInputDialog()">新用户</button>
                <button onclick="closeUserDialog()">取消</button>
            </div>
        </div>
    `;
    document.querySelector('.container').appendChild(dialog);
};

// 修改本地存储写入部分
function saveGameData() {
    try {
        localStorage.setItem('bestScore', bestScore);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        localStorage.setItem('currentUser', currentUser);
    } catch (error) {
        console.error('Error saving game data:', error);
        alert('保存游戏数据时出错，请确保浏览器没有禁用本地存储。');
    }
}
 
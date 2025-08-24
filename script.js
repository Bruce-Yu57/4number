// 儲存當前數字的陣列 [千位, 百位, 十位, 個位]
let currentDigits = [1, 2, 3, 4];

// 鼓勵語句陣列
const encouragements = [
    "太棒了！繼續練習吧！ 🌟",
    "你做得很好！ 👏",
    "真厲害！數字變化了！ ✨",
    "哇！你學會了！ 🎉",
    "很棒的操作！ 💫",
    "你是數字小達人！ 🏆",
    "繼續加油！ 💪",
    "數字遊戲真有趣！ 🎮"
];

// 初始化頁面
function init() {
    updateDisplay();
    updateCurrentNumber();
}

// 更新數字顯示
function updateDisplay() {
    for (let i = 0; i < 4; i++) {
        const digitElement = document.getElementById(`digit-${i}`);
        digitElement.textContent = currentDigits[i];
        
        // 添加變化動畫
        digitElement.classList.add(\'digit-change\');
        setTimeout(() => {
            digitElement.classList.remove(\'digit-change\');
        }, 500);
    }
}

// 更新當前數字顯示
function updateCurrentNumber() {
    const numberString = currentDigits.join(\'\');
    document.getElementById(\'current-number\').textContent = numberString;
    
    // 更新鼓勵語句
    const randomIndex = Math.floor(Math.random() * encouragements.length);
    document.getElementById(\'encouragement\').textContent = encouragements[randomIndex];
}

// 改變指定位數的數字
function changeDigit(position, change) {
    // 計算新的數字值
    let newValue = currentDigits[position] + change;
    
    // 確保數字在0-9範圍內（循環）
    if (newValue > 9) {
        newValue = 0;
    } else if (newValue < 0) {
        newValue = 9;
    }
    
    // 更新數字
    currentDigits[position] = newValue;
    
    // 更新顯示
    updateDisplay();
    updateCurrentNumber();
    
    // 播放音效（如果瀏覽器支援）
    playClickSound();
}

// 產生隨機數字
function generateRandomNumber() {
    for (let i = 0; i < 4; i++) {
        currentDigits[i] = Math.floor(Math.random() * 10);
    }
    
    // 更新顯示
    updateDisplay();
    updateCurrentNumber();
    
    // 播放音效
    playRandomSound();
    
    // 添加特殊動畫效果
    addRandomAnimation();
}

// 播放點擊音效
function playClickSound() {
    // 使用Web Audio API創建簡單的音效
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // 如果音效播放失敗，忽略錯誤
        console.log(\'音效播放不支援\');
    }
}

// 播放隨機音效
function playRandomSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // 播放一個上升的音調
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log(\'音效播放不支援\');
    }
}

// 添加隨機動畫效果
function addRandomAnimation() {
    const container = document.querySelector(\'\\.number-display\');
    container.style.animation = \'none\';
    
    // 強制重新計算樣式
    container.offsetHeight;
    
    // 添加搖擺動畫
    container.style.animation = \'shake 0.5s ease-in-out\';
    
    setTimeout(() => {
        container.style.animation = \'\';
    }, 500);
}

// 添加搖擺動畫的CSS
const style = document.createElement(\'style\');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// 鍵盤支援
document.addEventListener(\'keydown\', function(event) {
    switch(event.key) {
        case \'ArrowUp\':
            // 如果沒有焦點在特定位數上，預設操作個位
            changeDigit(3, 1);
            event.preventDefault();
            break;
        case \'ArrowDown\':
            changeDigit(3, -1);
            event.preventDefault();
            break;
        case \' \':
        case \'Enter\':
            generateRandomNumber();
            event.preventDefault();
            break;
        case \'1\':
            changeDigit(0, 1);
            break;
        case \'2\':
            changeDigit(1, 1);
            break;
        case \'3\':
            changeDigit(2, 1);
            break;
        case \'4\':
            changeDigit(3, 1);
            break;
    }
});

// 觸控支援
let touchStartY = 0;

document.addEventListener(\'touchstart\', function(event) {
    touchStartY = event.touches[0].clientY;
});

document.addEventListener(\'touchend\', function(event) {
    const touchEndY = event.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // 如果滑動距離足夠大
    if (Math.abs(diff) > 50) {
        const target = event.target.closest(\'\\.digit-container\');
        if (target) {
            const digitContainers = Array.from(document.querySelectorAll(\'\\.digit-container\'));
            const index = digitContainers.indexOf(target);
            
            if (index !== -1) {
                if (diff > 0) {
                    // 向上滑動，增加數字
                    changeDigit(index, 1);
                } else {
                    // 向下滑動，減少數字
                    changeDigit(index, -1);
                }
            }
        }
    }
});

// 頁面載入完成後初始化
document.addEventListener(\'DOMContentLoaded\', init);

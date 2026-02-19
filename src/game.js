
import { Player } from './player.js';
import { GateManager } from './gateManager.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        this.player = new Player(this.canvas);
        this.gateManager = new GateManager(this.canvas);

        this.score = 0;
        this.isRunning = false;
        this.isGameOver = false;
        this.speed = 5;
        this.lastTime = 0;

        // UI Elements
        this.scoreEl = document.getElementById('score');
        this.finalScoreEl = document.getElementById('final-score');
        this.startScreen = document.getElementById('start-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.startBtn = document.getElementById('start-btn');
        this.restartBtn = document.getElementById('restart-btn');

        this.bindEvents();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => this.resize());

        this.startBtn.addEventListener('click', () => this.start());
        this.restartBtn.addEventListener('click', () => this.start());

        // Input handling (Touch/Click)
        this.canvas.addEventListener('mousedown', (e) => this.input(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            this.input(e.changedTouches[0]);
        }, { passive: false });
    }

    input(e) {
        if (!this.isRunning) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        // Simple Logic: Click Left side -> Left Lane, Click Right side -> Right Lane
        if (x < this.canvas.width / 2) {
            this.player.setLane(0); // Left
        } else {
            this.player.setLane(1); // Right
        }
    }

    start() {
        this.isRunning = true;
        this.isGameOver = false;
        this.score = 0;
        this.speed = 1.5;
        this.scoreEl.innerText = this.score;

        this.player.reset();
        this.gateManager.reset();

        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');

        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }

    gameOver() {
        this.isRunning = false;
        this.isGameOver = true;
        this.finalScoreEl.innerText = this.score;

        // Titles and Messages logic
        const titleEl = document.getElementById('result-title');
        const msgEl = document.getElementById('result-message');

        // Max score is 500 (50 * 10)
        let title = "";
        let msg = "";

        if (this.score >= 500) {
            title = "伝説の理科マスター！";
            msg = "すごい！ぜんもんせいかい！\nきみは理科の天才だね！";
        } else if (this.score >= 400) {
            title = "理科博士！";
            msg = "おしい！あとすこしで満点だ！\n自信を持っていいよ！";
        } else if (this.score >= 300) {
            title = "理科名人！";
            msg = "すごいね！たくさん正解できたね。\n次は博士を目指そう！";
        } else if (this.score >= 100) {
            title = "けんきゅう生！";
            msg = "いい感じ！その調子で\nもっと勉強してみよう！";
        } else {
            title = "かけだしチャレンジャー";
            msg = "あきらめないで！\n何度も挑戦して覚えよう！";
        }

        titleEl.innerText = title;
        msgEl.innerText = msg;

        this.gameOverScreen.classList.remove('hidden');
    }

    update(deltaTime) {
        // Increase speed over time
        this.speed += deltaTime * 0.0001;

        this.player.update(deltaTime);
        this.gateManager.update(deltaTime, this.speed, this.player, this);
    }

    draw() {
        // Clear screen
        this.ctx.fillStyle = '#0a0a2a'; // Match CSS bg
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw Road/Lanes
        this.drawRoad();

        this.gateManager.draw(this.ctx);
        this.player.draw(this.ctx);
    }

    drawRoad() {
        const laneWidth = this.canvas.width / 2;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([20, 20]);

        // Middle Line
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame((t) => this.loop(t));
    }
}

// Start the game instance
window.game = new Game();

/* ==============================
   Player クラス
   ============================== */
class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.color = '#00f3ff';
    }

    reset() {
        this.lane = 0; // 0: 左, 1: 右
        this.targetX = this.getLaneCenter(0);
        this.x = this.targetX;
        this.y = this.canvas.height - 150;
        this.radius = 30;
    }

    getLaneCenter(laneIndex) {
        const laneWidth = this.canvas.width / 2;
        return (laneIndex * laneWidth) + (laneWidth / 2);
    }

    setLane(laneIndex) {
        if (laneIndex < 0 || laneIndex > 1) return;
        this.lane = laneIndex;
    }

    update(deltaTime) {
        this.targetX = this.getLaneCenter(this.lane);
        // スムーズな移動（線形補間）
        this.x += (this.targetX - this.x) * 0.2;
    }

    draw(ctx) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        // 本体（円）
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // 方向矢印（三角）
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 10);
        ctx.lineTo(this.x - 10, this.y + 10);
        ctx.lineTo(this.x + 10, this.y + 10);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

/* ==============================
   GateManager クラス
   ============================== */
class GateManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.gates = [];
        this.spawnTimer = 0;
        this.spawnInterval = 6667; // 絠4秒間隔（10秒÷1.5）

        // 50問（ユーザー提供の資料より）
        this.problems = [
            { q: "晴れの日は、1日の気温の変化はどうなりますか？", ans: "変化が大きい", wrong: "変化が小さい" },
            { q: "くもりや雨の日は、1日の気温の変化はどうなりますか？", ans: "変化が小さい", wrong: "変化が大きい" },
            { q: "気温をはかる場所は、どんなところがよいですか？", ans: "風通しのよい場所", wrong: "日当たりの強い場所" },
            { q: "気温は、地面からどのくらいの高さではかりますか？", ans: "1.2〜1.5m", wrong: "50cmくらい" },
            { q: "地面を流れる水は、どちらからどちらへ流れますか？", ans: "高いところから低いところ", wrong: "低いところから高いところ" },
            { q: "水たまりは、地面のどんなところにできますか？", ans: "低くてくぼんでいるところ", wrong: "高くて平らなところ" },
            { q: "土の種類（砂やじゃり）によって、何がちがいますか？", ans: "つぶの大きさ", wrong: "土の重さ" },
            { q: "土のつぶが大きくなると、水のしみこみ方はどうなりますか？", ans: "しみこみやすくなる", wrong: "しみこみにくくなる" },
            { q: "乾電池の向きをつなぎかえると、電流の向きはどうなりますか？", ans: "逆（ぎゃく）になる", wrong: "変わらない" },
            { q: "乾電池の向きを変えると、モーターの回る向きはどうなりますか？", ans: "逆になる", wrong: "変わらない" },
            { q: "乾電池2こを「直列（ちょくれつ）」につなぐと、電流はどうなりますか？", ans: "1このときより大きい", wrong: "1このときと同じ" },
            { q: "乾電池2こを「並列（へいれつ）」につなぐと、電流はどうなりますか？", ans: "1このときと同じくらい", wrong: "1このときより大きい" },
            { q: "モーターをもっと速く回したいときは、電池をどうつなぎますか？", ans: "直列つなぎ", wrong: "並列つなぎ" },
            { q: "とじこめた空気を押すと、体積（かさ）はどうなりますか？", ans: "小さくなる", wrong: "変わらない" },
            { q: "とじこめた空気を押すと、押し返す手ごたえはどうなりますか？", ans: "大きくなる", wrong: "小さくなる" },
            { q: "とじこめた水を押すと、体積はどうなりますか？", ans: "変わらない", wrong: "小さくなる" },
            { q: "圧縮（あっしゅく）された空気は、その後どうなろうとしますか？", ans: "もとの体積にもどろうとする", wrong: "そのまま小さくなっている" },
            { q: "体の曲げられるところにある、骨と骨のつなぎ目を何といいますか？", ans: "関節（かんせつ）", wrong: "筋肉（きんにく）" },
            { q: "腕（うで）を曲げるとき、内側の筋肉はどうなっていますか？", ans: "ちぢんでいる", wrong: "ゆるんでいる" },
            { q: "腕をのばすとき、内側の筋肉はどうなっていますか？", ans: "ゆるんでいる", wrong: "ちぢんでいる" },
            { q: "力を入れると、筋肉のかたさはどうなりますか？", ans: "かたくなる", wrong: "やわらかくなる" },
            { q: "空気、水、金属のうち、温めたときに体積が一番大きく変わるのは？", ans: "空気", wrong: "金属" },
            { q: "空気、水、金属のうち、温めたときに体積の変化が一番小さいのは？", ans: "金属", wrong: "空気" },
            { q: "水を温めると、体積はどうなりますか？", ans: "大きくなる", wrong: "小さくなる" },
            { q: "金属を冷やすと、体積はどうなりますか？", ans: "小さくなる", wrong: "大きくなる" },
            { q: "金属の体積の変化は、見た目だけでわかりますか？", ans: "わからないほど小さい", wrong: "はっきり見てわかる" },
            { q: "金属の棒や板は、どこから順に温まっていきますか？", ans: "熱した部分から順に", wrong: "全体がいっぺんに" },
            { q: "水を熱すると、温められた水はどちらへ動きますか？", ans: "上へ動く", wrong: "下へ動く" },
            { q: "空気や水は、どのようにつながって全体が温まりますか？", ans: "温まった部分が動いて回る", wrong: "じっとしていて温まる" },
            { q: "金属の温まり方は、空気や水の温まり方と同じですか？", ans: "ちがう", wrong: "同じ" },
            { q: "部屋の上の方が温かいのは、空気のどんな性質のためですか？", ans: "温まった空気が上へ動くから", wrong: "下の空気が重いから" },
            { q: "水は沸騰（ふっとう）しなくても、水蒸気になりますか？", ans: "はい（蒸発する）", wrong: "いいえ（しない）" },
            { q: "水が表面から水蒸気になって空気中に出ていくことを何といいますか？", ans: "蒸発（じょうはつ）", wrong: "結露（けつろ）" },
            { q: "しめった地面がかわくのは、水がどこへ行ったからですか？", ans: "水蒸気になって空気中へ", wrong: "地面の下へ消えた" },
            { q: "冷たいコップの表面に水滴がつくことを何といいますか？", ans: "結露（けつろ）", wrong: "蒸発（じょうはつ）" },
            { q: "月は、どちらの方角からどちらの方角へ動きますか？", ans: "東から西", wrong: "西から東" },
            { q: "月が南の空を通るとき、高さはどうなっていますか？", ans: "高いところを通る", wrong: "低いところを通る" },
            { q: "星の見え方は、時間がたつとどうなりますか？", ans: "並び方は変わらず位置が変わる", wrong: "並び方も位置もバラバラになる" },
            { q: "月の動く向きは、太陽の動く向きと同じですか？", ans: "同じ", wrong: "反対（はんたい）" },
            { q: "夏の大三角などの星は、1時間たつとどちらへ動きますか？", ans: "西の方へ動く", wrong: "東の方へ動く" },
            { q: "晴れの日の気温のグラフを見ると、午後2時ごろの気温はどうなっていますか？", ans: "1日で一番高くなっている", wrong: "1日で一番低くなっている" },
            { q: "「砂場のすな」と「じゃり」では、どちらの方が水のしみこみが速いですか？", ans: "じゃり", wrong: "砂場のすな" },
            { q: "乾電池2こを「並列つなぎ」にしたとき、電流の大きさはどうなりますか？", ans: "1このときと同じくらい", wrong: "1このときよりずっと大きい" },
            { q: "ピストンの中に水を入れて強く押すと、水の体積はどうなりますか？", ans: "変わらない", wrong: "少しだけ小さくなる" },
            { q: "ヒト以外の動物（犬やウサギなど）の体にも、関節や筋肉はありますか？", ans: "ある", wrong: "ない" },
            { q: "金属の玉を温めると、輪（わ）を通り抜けることができますか？", ans: "通り抜けられなくなる", wrong: "スルスル通り抜ける" },
            { q: "金属の棒の端を熱したとき、熱はどのように伝わっていきますか？", ans: "熱したところから順に", wrong: "熱していない反対の端から" },
            { q: "冬に窓ガラスに水滴がつくのは、空気中の何が冷やされたからですか？", ans: "水じょう気", wrong: "空気そのもの" },
            { q: "星の集まり（星座）の形は、時間がたつと変わりますか？", ans: "変わらない", wrong: "バラバラに変わる" },
            { q: "月や星は、時間がたつとどの方角へ動いていきますか？", ans: "南を通って西へ", wrong: "南を通って東へ" }
        ];

        this.shuffleDeck();
    }

    shuffleDeck() {
        // インデックスの配列を作りシャッフル（Fisher-Yates）
        this.deck = Array.from({ length: this.problems.length }, function (_, i) { return i; });
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = tmp;
        }
    }

    reset() {
        this.gates = [];
        this.spawnTimer = 0;
        this.spawnInterval = 6667;
        this.shuffleDeck();
    }

    update(deltaTime, speed, player, game) {
        var canvasH = this.canvas.height;

        // ゲートの更新と画面外削除
        for (var i = this.gates.length - 1; i >= 0; i--) {
            var row = this.gates[i];
            row.y += speed;

            // 衝突判定（ゲートボックスの中心付近で判定、バナー約70px+ゲート中心50px=120px）
            var gateCenter = row.y + 120;
            if (!row.passed && gateCenter > player.y - 40 && gateCenter < player.y + 40) {
                if (player.lane === row.correctLane) {
                    game.score += 10;
                    game.scoreEl.innerText = game.score;
                    row.passed = true;
                    row.isCorrect = true;
                } else {
                    game.gameOver();
                }
            }

            // 画面外の削除
            if (row.y > canvasH + 100) {
                this.gates.splice(i, 1);
            }
        }

        // 次の問題のスポーン：画面上にゲートがなくなってから約4秒後に出現
        if (this.gates.length === 0) {
            this.spawnTimer += deltaTime;
            if (this.spawnTimer >= this.spawnInterval) {
                this.spawnGateRow();
                this.spawnTimer = 0;
            }
        } else {
            // ゲートが残っている間はタイマーをリセット
            this.spawnTimer = 0;
        }
    }

    spawnGateRow() {
        if (this.deck.length === 0) {
            this.shuffleDeck();
        }

        var problemIndex = this.deck.pop();
        var problem = this.problems[problemIndex];
        var correctLane = Math.floor(Math.random() * 2);

        var row = {
            y: -220, // ブロック全体の上端が画面外からスタート
            question: problem.q,
            options: [],
            correctLane: correctLane,
            passed: false,
            isCorrect: false
        };

        if (correctLane === 0) {
            row.options[0] = problem.ans;
            row.options[1] = problem.wrong;
        } else {
            row.options[0] = problem.wrong;
            row.options[1] = problem.ans;
        }

        this.gates.push(row);
    }

    // テキストを折り返して描画するヘルパー
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        var line = '';
        var lines = [];
        for (var n = 0; n < text.length; n++) {
            var testLine = line + text[n];
            if (ctx.measureText(testLine).width > maxWidth && line !== '') {
                lines.push(line);
                line = text[n];
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        for (var i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + i * lineHeight);
        }
        return lines.length;
    }

    draw(ctx) {
        var self = this;
        this.gates.forEach(function (row) {
            /* ---- レイアウト定数 ---- */
            var PADDING = 12;
            var FONT_SIZE = 20;
            var LINE_H = FONT_SIZE + 8;
            var GATE_H = 100;

            ctx.font = 'bold ' + FONT_SIZE + 'px "Inter", sans-serif';
            var maxTextWidth = self.canvas.width - 40;

            // 折り返し計算（行数を取得）
            var chars = row.question;
            var tempLine = '';
            var lineCount = 1;
            for (var ci = 0; ci < chars.length; ci++) {
                var t = tempLine + chars[ci];
                if (ctx.measureText(t).width > maxTextWidth && tempLine !== '') {
                    lineCount++;
                    tempLine = chars[ci];
                } else {
                    tempLine = t;
                }
            }

            var bannerH = lineCount * LINE_H + PADDING * 2;
            var topY = row.y; // row.y はブロック全体の上端

            // 問題バナー
            ctx.fillStyle = 'rgba(0, 0, 60, 0.92)';
            ctx.fillRect(0, topY, self.canvas.width, bannerH);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold ' + FONT_SIZE + 'px "Inter", sans-serif';
            ctx.textAlign = 'center';
            self.wrapText(ctx, row.question,
                self.canvas.width / 2,
                topY + PADDING + FONT_SIZE,
                maxTextWidth, LINE_H);

            // 選択肢ボックス（バナーのすぐ下）
            var gateTop = topY + bannerH;
            for (var i = 0; i < 2; i++) {
                var xCenter = (i * self.canvas.width / 2) + (self.canvas.width / 4);
                var gateW = self.canvas.width / 2 - 20;
                var gateX = i === 0 ? 10 : self.canvas.width / 2 + 10;
                var color = 'rgba(0, 162, 255, 0.3)';
                var border = '#00f3ff';

                if (row.passed && row.isCorrect && i === row.correctLane) {
                    color = 'rgba(0, 255, 100, 0.6)';
                }

                ctx.fillStyle = color;
                ctx.strokeStyle = border;
                ctx.lineWidth = 3;
                ctx.fillRect(gateX, gateTop, gateW, GATE_H);
                ctx.strokeRect(gateX, gateTop, gateW, GATE_H);

                ctx.fillStyle = '#fff';
                ctx.font = 'bold 26px "Inter", sans-serif';
                ctx.fillText(row.options[i], xCenter, gateTop + GATE_H / 2 + 9);
            }
        });
    }
}

/* ==============================
   Game クラス（メイン）
   ============================== */
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
        this.speed = 0.75;
        this.lastTime = 0;

        // UI要素
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
        var self = this;
        window.addEventListener('resize', function () { self.resize(); });

        this.startBtn.addEventListener('click', function () { self.start(); });
        this.restartBtn.addEventListener('click', function () { self.start(); });

        // 入力処理（クリック・ドラッグ・タッチ対応）
        function handleInput(clientX) {
            if (!self.isRunning) return;
            var rect = self.canvas.getBoundingClientRect();
            var x = clientX - rect.left;
            if (x < self.canvas.width / 2) {
                self.player.setLane(0);
            } else {
                self.player.setLane(1);
            }
        }

        this.canvas.addEventListener('mousedown', function (e) { handleInput(e.clientX); });
        this.canvas.addEventListener('mousemove', function (e) {
            if (e.buttons > 0) handleInput(e.clientX);
        });
        this.canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
            handleInput(e.changedTouches[0].clientX);
        }, { passive: false });
        this.canvas.addEventListener('touchmove', function (e) {
            e.preventDefault();
            handleInput(e.changedTouches[0].clientX);
        }, { passive: false });
    }

    start() {
        this.isRunning = true;
        this.isGameOver = false;
        this.score = 0;
        this.speed = 0.375; // スロースタート
        this.scoreEl.innerText = this.score;

        this.player.reset();
        this.gateManager.reset();

        this.startScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');

        this.lastTime = performance.now();
        var self = this;
        requestAnimationFrame(function (t) { self.loop(t); });
    }

    gameOver() {
        this.isRunning = false;
        this.isGameOver = true;
        this.finalScoreEl.innerText = this.score;

        var titleEl = document.getElementById('result-title');
        var msgEl = document.getElementById('result-message');
        var title = '';
        var msg = '';

        if (this.score >= 500) {
            title = '伝説の理科マスター！';
            msg = 'すごい！ぜんもんせいかい！\nきみは理科の天才だね！';
        } else if (this.score >= 400) {
            title = '理科博士！';
            msg = 'おしい！あとすこしで満点だ！\n自信を持っていいよ！';
        } else if (this.score >= 300) {
            title = '理科名人！';
            msg = 'すごいね！たくさん正解できたね。\n次は博士を目指そう！';
        } else if (this.score >= 100) {
            title = 'けんきゅう生！';
            msg = 'いい感じ！その調子で\nもっと勉強してみよう！';
        } else {
            title = 'かけだしチャレンジャー';
            msg = 'あきらめないで！\n何度も挑戦して覚えよう！';
        }

        titleEl.innerText = title;
        msgEl.innerText = msg;
        this.gameOverScreen.classList.remove('hidden');
    }

    update(deltaTime) {
        this.speed += deltaTime * 0.000025; // さらにゆっくり加速
        this.player.update(deltaTime);
        this.gateManager.update(deltaTime, this.speed, this.player, this);
    }

    draw() {
        this.ctx.fillStyle = '#0a0a2a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawRoad();
        this.gateManager.draw(this.ctx);
        this.player.draw(this.ctx);
    }

    drawRoad() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 4;
        this.ctx.setLineDash([20, 20]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    loop(timestamp) {
        if (!this.isRunning) return;
        var deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        this.update(deltaTime);
        this.draw();
        var self = this;
        requestAnimationFrame(function (t) { self.loop(t); });
    }
}

// ゲーム起動
window.addEventListener('DOMContentLoaded', function () {
    window.game = new Game();
});

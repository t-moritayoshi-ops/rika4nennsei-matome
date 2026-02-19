
export class GateManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.gates = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2500; // ms

        // 50 Questions (Provided by User)
        this.problems = [
            { q: "晴れの日は、1日の気温の変化はどうなりますか？", ans: "変化が大きい", wrong: "変化が小さい" }, // 1
            { q: "くもりや雨の日は、1日の気温の変化はどうなりますか？", ans: "変化が小さい", wrong: "変化が大きい" }, // 2
            { q: "気温をはかる場所は、どんなところがよいですか？", ans: "風通しのよい場所", wrong: "日当たりの強い場所" }, // 3
            { q: "気温は、地面からどのくらいの高さではかりますか？", ans: "1.2〜1.5m", wrong: "50cmくらい" }, // 4
            { q: "地面を流れる水は、どちらからどちらへ流れますか？", ans: "高いところから低いところ", wrong: "低いところから高いところ" }, // 5
            { q: "水たまりは、地面のどんなところにできますか？", ans: "低くてくぼんでいるところ", wrong: "高くて平らなところ" }, // 6
            { q: "土の種類（砂やじゃり）によって、何がちがいますか？", ans: "つぶの大きさ", wrong: "土の重さ" }, // 7
            { q: "土のつぶが大きくなると、水のしみこみ方はどうなりますか？", ans: "しみこみやすくなる", wrong: "しみこみにくくなる" }, // 8
            { q: "乾電池の向きをつなぎかえると、電流の向きはどうなりますか？", ans: "逆（ぎゃく）になる", wrong: "変わらない" }, // 9
            { q: "乾電池の向きを変えると、モーターの回る向きはどうなりますか？", ans: "逆になる", wrong: "変わらない" }, // 10
            { q: "乾電池2こを「直列（ちょくれつ）」につなぐと、電流はどうなりますか？", ans: "1このときより大きい", wrong: "1このときと同じ" }, // 11
            { q: "乾電池2こを「並列（へいれつ）」につなぐと、電流はどうなりますか？", ans: "1このときと同じくらい", wrong: "1このときより大きい" }, // 12
            { q: "モーターをもっと速く回したいときは、電池をどうつなぎますか？", ans: "直列つなぎ", wrong: "並列つなぎ" }, // 13
            { q: "とじこめた空気を押すと、体積（かさ）はどうなりますか？", ans: "小さくなる", wrong: "変わらない" }, // 14
            { q: "とじこめた空気を押すと、押し返す手ごたえはどうなりますか？", ans: "大きくなる", wrong: "小さくなる" }, // 15
            { q: "とじこめた水を押すと、体積はどうなりますか？", ans: "変わらない", wrong: "小さくなる" }, // 16
            { q: "圧縮（あっしゅく）された空気は、その後どうなろうとしますか？", ans: "もとの体積にもどろうとする", wrong: "そのまま小さくなっている" }, // 17
            { q: "体の曲げられるところにある、骨と骨のつなぎ目を何といいますか？", ans: "関節（かんせつ）", wrong: "筋肉（きんにく）" }, // 18
            { q: "腕（うで）を曲げるとき、内側の筋肉はどうなっていますか？", ans: "ちぢんでいる", wrong: "ゆるんでいる" }, // 19
            { q: "腕をのばすとき、内側の筋肉はどうなっていますか？", ans: "ゆるんでいる", wrong: "ちぢんでいる" }, // 20
            { q: "力を入れると、筋肉のかたさはどうなりますか？", ans: "かたくなる", wrong: "やわらかくなる" }, // 21
            { q: "空気、水、金属のうち、温めたときに体積が一番大きく変わるのは？", ans: "空気", wrong: "金属" }, // 22
            { q: "空気、水、金属のうち、温めたときに体積の変化が一番小さいのは？", ans: "金属", wrong: "空気" }, // 23
            { q: "水を温めると、体積はどうなりますか？", ans: "大きくなる", wrong: "小さくなる" }, // 24
            { q: "金属を冷やすと、体積はどうなりますか？", ans: "小さくなる", wrong: "大きくなる" }, // 25
            { q: "金属の体積の変化は、見た目だけでわかりますか？", ans: "わからないほど小さい", wrong: "はっきり見てわかる" }, // 26
            { q: "金属の棒や板は、どこから順に温まっていきますか？", ans: "熱した部分から順に", wrong: "全体がいっぺんに" }, // 27
            { q: "水を熱すると、温められた水はどちらへ動きますか？", ans: "上へ動く", wrong: "下へ動く" }, // 28
            { q: "空気や水は、どのようにつながって全体が温まりますか？", ans: "温まった部分が動いて回る", wrong: "じっとしていて温まる" }, // 29
            { q: "金属の温まり方は、空気や水の温まり方と同じですか？", ans: "ちがう", wrong: "同じ" }, // 30
            { q: "部屋の上の方が温かいのは、空気のどんな性質のためですか？", ans: "温まった空気が上へ動くから", wrong: "下の空気が重いから" }, // 31
            { q: "水は沸騰（ふっとう）しなくても、水蒸気になりますか？", ans: "はい（蒸発する）", wrong: "いいえ（しない）" }, // 32
            { q: "水が表面から水蒸気になって空気中に出ていくことを何といいますか？", ans: "蒸発（じょうはつ）", wrong: "結露（けつろ）" }, // 33
            { q: "しめった地面がかわくのは、水がどこへ行ったからですか？", ans: "水蒸気になって空気中へ", wrong: "地面の下へ消えた" }, // 34
            { q: "冷たいコップの表面に水滴がつくことを何といいますか？", ans: "結露（けつろ）", wrong: "蒸発（じょうはつ）" }, // 35
            { q: "月は、どちらの方角からどちらの方角へ動きますか？", ans: "東から西", wrong: "西から東" }, // 36
            { q: "月が南の空を通るとき、高さはどうなっていますか？", ans: "高いところを通る", wrong: "低いところを通る" }, // 37
            { q: "星の見え方は、時間がたつとどうなりますか？", ans: "並び方は変わらず位置が変わる", wrong: "並び方も位置もバラバラになる" }, // 38
            { q: "月の動く向きは、太陽の動く向きと同じですか？", ans: "同じ", wrong: "反対（はんたい）" }, // 39
            { q: "夏の大三角などの星は、1時間たつとどちらへ動きますか？", ans: "西の方へ動く", wrong: "東の方へ動く" }, // 40
            { q: "晴れの日の気温のグラフを見ると、午後2時ごろの気温はどうなっていますか？", ans: "1日で一番高くなっている", wrong: "1日で一番低くなっている" }, // 41
            { q: "「砂場のすな」と「じゃり」では、どちらの方が水のしみこみが速いですか？", ans: "じゃり", wrong: "砂場のすな" }, // 42
            { q: "乾電池2こを「並列つなぎ」にしたとき、電流の大きさはどうなりますか？", ans: "1このときと同じくらい", wrong: "1このときよりずっと大きい" }, // 43
            { q: "ピストンの中に水を入れて強く押すと、水の体積はどうなりますか？", ans: "変わらない", wrong: "少しだけ小さくなる" }, // 44
            { q: "ヒト以外の動物（犬やウサギなど）の体にも、関節や筋肉はありますか？", ans: "ある", wrong: "ない" }, // 45
            { q: "金属の玉を温めると、輪（わ）を通り抜けることができますか？", ans: "通り抜けられなくなる", wrong: "スルスル通り抜ける" }, // 46
            { q: "金属の棒の端を熱したとき、熱はどのように伝わっていきますか？", ans: "熱したところから順に", wrong: "熱していない反対の端から" }, // 47
            { q: "冬に窓ガラスに水滴がつくのは、空気中の何が冷やされたからですか？", ans: "水じょう気", wrong: "空気そのもの" }, // 48
            { q: "星の集まり（星座）の形は、時間がたつと変わりますか？", ans: "変わらない", wrong: "バラバラに変わる" }, // 49
            { q: "月や星は、時間がたつとどの方角へ動いていきますか？", ans: "南を通って西へ", wrong: "南を通って東へ" } // 50
        ];

        this.shuffleDeck();
    }

    shuffleDeck() {
        // Create an index array [0, 1, ... n]
        this.deck = Array.from({ length: this.problems.length }, (_, i) => i);

        // Fisher-Yates Shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    reset() {
        this.gates = [];
        this.spawnTimer = 0;
        this.spawnInterval = 5000; // Reset to requested 5s
        this.shuffleDeck(); // Reshuffle on restart
    }

    update(deltaTime, speed, player, game) {
        this.spawnTimer += deltaTime;

        // Spawn Gates
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnGateRow();
            this.spawnTimer = 0;
            // Keep interval constant as requested by user (5s)
            // Or slightly decrease if they want difficulty, but user asked for "5s interval" specifically.
            // Let's keep it constant 5s for now based on "問題と問題の間隔は５秒にしてください"
            this.spawnInterval = 5000;
        }

        // Update each gate
        for (let i = this.gates.length - 1; i >= 0; i--) {
            const row = this.gates[i];
            row.y += speed;

            // Collision Check
            if (!row.passed && row.y > player.y - 30 && row.y < player.y + 30) {
                // Check if player center is within the correct gate's lane
                // Simple lane check: 0 (Left), 1 (Right)
                if (player.lane === row.correctLane) {
                    // Correct!
                    game.score += 10;
                    game.scoreEl.innerText = game.score;
                    row.passed = true;
                    row.isCorrect = true; // For visual feedback
                } else {
                    // Wrong!
                    game.gameOver();
                }
            }

            // Remove off-screen
            if (row.y > this.canvas.height + 100) {
                this.gates.splice(i, 1);
            }
        }
    }

    spawnGateRow() {
        if (this.deck.length === 0) {
            // Option A: Game Over (Win)
            // Option B: Reshuffle (Endless)
            // Since user said "50 questions all different", implied finite set or loop.
            // Let's reshuffle to keep game running but ensure full cycle first.
            this.shuffleDeck();
        }

        const problemIndex = this.deck.pop();
        const problem = this.problems[problemIndex];

        const correctLane = Math.floor(Math.random() * 2); // 0 or 1

        const row = {
            y: -150,
            question: problem.q,
            options: [],
            correctLane: correctLane,
            passed: false,
            isCorrect: false
        };

        // Assign options to lanes
        if (correctLane === 0) {
            row.options[0] = problem.ans;
            row.options[1] = problem.wrong;
        } else {
            row.options[0] = problem.wrong;
            row.options[1] = problem.ans;
        }

        this.gates.push(row);
    }

    draw(ctx) {
        this.gates.forEach(row => {
            const y = row.y;

            // Draw Question Banner
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, y - 100, this.canvas.width, 50);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 24px "Inter"';
            ctx.textAlign = 'center';
            ctx.fillText(row.question, this.canvas.width / 2, y - 68);

            // Draw Gates (Left & Right)
            for (let i = 0; i < 2; i++) {
                const xCenter = (i * this.canvas.width / 2) + (this.canvas.width / 4);

                // Color based on state?
                // Initially both look same or maybe Blue vs Red (Last War style)
                // Let's make them both Blue/Neutral until interaction
                let color = 'rgba(0, 162, 255, 0.3)';
                let borderColor = '#00f3ff';

                if (row.passed && row.isCorrect && i === row.correctLane) {
                    color = 'rgba(0, 255, 100, 0.6)'; // Green for success
                }

                ctx.fillStyle = color;
                ctx.strokeStyle = borderColor;
                ctx.lineWidth = 3;

                // Gate Box
                const gateWidth = this.canvas.width / 2 - 20;
                const gateX = i === 0 ? 10 : this.canvas.width / 2 + 10;

                ctx.fillRect(gateX, y - 40, gateWidth, 100);
                ctx.strokeRect(gateX, y - 40, gateWidth, 100);

                // Option Text
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 30px "Inter"';
                ctx.fillText(row.options[i], xCenter, y + 20);
            }
        });
    }
}


export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
        this.color = '#00f3ff';
    }

    reset() {
        this.lane = 0; // 0: Left, 1: Right
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
        // Smooth lerp movement
        this.x += (this.targetX - this.x) * 0.2;
    }

    draw(ctx) {
        // Shadow/Glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        // Body (Circle)
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Direction Indicator (Triangle)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - 10);
        ctx.lineTo(this.x - 10, this.y + 10);
        ctx.lineTo(this.x + 10, this.y + 10);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

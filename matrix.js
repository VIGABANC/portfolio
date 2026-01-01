/**
 * Matrix Portfolio - Interactive Features
 * Handles matrix background animation only
 */

class MatrixBackground {
  constructor() {
    this.canvas = document.getElementById('matrix-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.drops = [];
    this.characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"#&_(),.;:?!|{}<>';

    this.init();

    // Handle resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  init() {
    this.resizeCanvas();
    this.startAnimation();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initializeDrops();
  }

  initializeDrops() {
    const columns = Math.floor(this.canvas.width / 20);
    this.drops = [];

    for (let i = 0; i < columns; i++) {
      this.drops[i] = {
        x: i * 20,
        y: Math.random() * -100,
        speed: 1 + Math.random() * 3, // Slower, more readable speed
        length: 5 + Math.random() * 15,
        opacity: 0.05 + Math.random() * 0.1 // Subtle opacity
      };
    }
  }

  draw() {
    // Fade effect
    this.ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.font = '14px monospace';

    for (let i = 0; i < this.drops.length; i++) {
      const drop = this.drops[i];

      // Determine color - mostly green/cyan
      const isCyan = Math.random() > 0.8;
      this.ctx.fillStyle = isCyan ? 'rgba(0, 243, 255, 0.8)' : 'rgba(10, 255, 0, 0.8)';

      const charIndex = Math.floor(Math.random() * this.characters.length);
      const char = this.characters[charIndex];

      this.ctx.fillText(char, drop.x, drop.y);

      // Reset drop
      if (drop.y > this.canvas.height && Math.random() > 0.975) {
        drop.y = 0;
      }

      drop.y += drop.speed;
    }

    requestAnimationFrame(() => this.draw());
  }

  startAnimation() {
    this.draw();
  }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  new MatrixBackground();
});
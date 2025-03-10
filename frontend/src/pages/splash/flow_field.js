// flow_field.js

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
canvas.width = 1500;
canvas.height = 800;

// canvas settings
ctx.fillStyle = "white";
ctx.strokeStyle = "white";
ctx.lineWidth = 1;
ctx.letterSpacing = "20px";

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.x = Math.floor(Math.random() * this.effect.width);
    this.y = Math.floor(Math.random() * this.effect.height);
    this.speedX = 0;
    this.speedY = 0;
    this.speedModifier = Math.floor(Math.random() * 2 + .7);
    this.history = [{ x: this.x, y: this.y }];
    this.maxLength = Math.floor(Math.random() * 40 + 10);
    this.angle = 0;
    this.newAngle = 0;
    this.angleCorrector = Math.random() * 0.5 + 0.01;
    this.timer = this.maxLength * 2;
    this.colors = [
      // "#00a86b",
      // "#4169e1",
      "white",
    ];

    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
  }
  draw(context) {
    context.beginPath();
    context.moveTo(this.history[0].x, this.history[0].y);
    for (let i = 0; i < this.history.length; i++) {
      context.lineTo(this.history[i].x, this.history[i].y);
    }
    context.strokeStyle = this.color;
    context.stroke();
  }
  update() {
    this.timer--;
    if (this.timer >= 1) {
      let x = Math.floor(this.x / this.effect.cellSize);
      let y = Math.floor(this.y / this.effect.cellSize);
      let index = y * this.effect.cols + x;

      if (this.effect.flowField[index]) {
        this.newAngle = this.effect.flowField[index].colorAngle;
        if (this.angle > this.newAngle) {
          this.angle -= this.angleCorrector;
        } else if (this.angle < this.newAngle) {
          this.angle += this.angleCorrector;
        } else {
          this.angle = this.newAngle;
        }
      }

      this.speedX = Math.cos(this.angle);
      this.speedY = Math.sin(this.angle);
      this.x += this.speedX * this.speedModifier;
      this.y += this.speedY * this.speedModifier;

      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxLength) {
        this.history.shift();
      }
    } else if (this.history.length > 1) {
      this.history.shift();
    } else {
      this.reset();
    }
  }
  reset() {
    let attempts = 0;
    let resetSuccess = false;

    while (attempts < 20 && !resetSuccess) {
      attempts++;
      let testIndex = Math.floor(Math.random() * this.effect.flowField.length);
      if (this.effect.flowField[testIndex].alpha > 0) {
        this.x = this.effect.flowField[testIndex].x;
        this.y = this.effect.flowField[testIndex].y;
        this.history = [{ x: this.x, y: this.y }];
        this.timer = this.maxLength * 2;
        resetSuccess = true;
      }
    }
    if (!resetSuccess) {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.history = [{ x: this.x, y: this.y }];
      this.timer = this.maxLength * 2;
    }
  }
}

class Effect {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.context = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.particles = [];
    this.numberOfParticles = 10000;
    this.cellSize = 10;
    this.rows = 0;
    this.cols = 0;
    this.flowField = [];
    this.debug = false;
    this.text = "mx. manhattan";
    this.init();

    window.addEventListener("keydown", (e) => {
      if (e.key === "d") this.debug = !this.debug;
    });

    window.addEventListener("resize", (e) => {
      //   this.resize(e.target.innerWidth, e.target.innerHeight);
    });
  }
  drawText() {
    this.context.font = "120px Arial";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";

    const gradient1 = this.context.createLinearGradient(
      0,
      0,
      this.width,
      this.height
    );
    gradient1.addColorStop(0.2, "rgb(255,0,0)");
    gradient1.addColorStop(0.4, "rgb(0,255,0)");
    gradient1.addColorStop(0.6, "rgb(150,100,100)");
    gradient1.addColorStop(0.8, "rgb(0,255,255)");

    const gradient2 = this.context.createLinearGradient(
      0,
      0,
      this.width,
      this.height
    );
    gradient2.addColorStop(0.2, "rgb(255,255,0)");
    gradient2.addColorStop(0.4, "rgb(200,5,50)");
    gradient2.addColorStop(0.6, "rgb(150,255,255)");
    gradient2.addColorStop(0.8, "rgb(255,255,150)");

    const gradient3 = this.context.createRadialGradient(
      this.width * 0.5,
      this.height * 0.5,
      10,
      this.width * 0.5,
      this.height * 0.5,
      this.width
    );
    gradient3.addColorStop(0.2, "rgb(0,0,255)");
    gradient3.addColorStop(0.4, "rgb(200,255,0)");
    gradient3.addColorStop(0.6, "rgb(0,0,255)");
    gradient3.addColorStop(0.8, "rgb(0,0,0)");

    this.context.fillStyle = gradient2;
    this.context.fillText(
      this.text,
      this.width * 0.5,
      this.height * 0.5,
      this.width
    );
  }
  init() {
    // create flow field
    this.rows = Math.floor(this.height / this.cellSize);
    this.cols = Math.floor(this.width / this.cellSize);
    this.flowField = [];

    // draw text
    this.drawText();

    // scan pixel data
    const pixels = this.context.getImageData(
      0,
      0,
      this.width,
      this.height
    ).data;
    console.log(pixels);
    for (let y = 0; y < this.height; y += this.cellSize) {
      for (let x = 0; x < this.width; x += this.cellSize) {
        const index = (y * this.width + x) * 4;
        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const alpha = pixels[index + 3];
        const grayscale = (red + green + blue) / 3;
        const colorAngle = ((grayscale / 255) * 6.28).toFixed(2);
        this.flowField.push({
          x: x,
          y: y,
          alpha: alpha,
          colorAngle: colorAngle,
        });
      }
    }

    // create particles
    this.particles = [];
    for (let i = 0; i < this.numberOfParticles; i++) {
      this.particles.push(new Particle(this));
    }
    this.particles.forEach((particle) => particle.reset());
  }
  drawGrid() {
    this.context.save();
    this.context.strokeStyle = "white";
    this.context.lineWidth = 0.3;
    for (let c = 0; c < this.cols; c++) {
      this.context.beginPath();
      this.context.moveTo(this.cellSize * c, 0);
      this.context.lineTo(this.cellSize * c, this.height);
      this.context.stroke();
    }
    for (let r = 0; r < this.rows; r++) {
      this.context.beginPath();
      this.context.moveTo(0, this.cellSize * r);
      this.context.lineTo(this.width, this.cellSize * r);
      this.context.stroke();
    }
    this.context.restore();
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.init();
  }
  render() {
    if (this.debug) {
      this.drawGrid();
      this.drawText();
    }
    this.context.fillStyle = "rgba(255,255,255,0.05)";
    this.context.fillText(
      this.text,
      this.width * 0.5 - 5,
      this.height * 0.5 + 5,
      this.width
    );
    this.particles.forEach((particle) => {
      particle.draw(this.context);
      particle.update();
    });
  }
}

export function startAnimation() {
  const canvas = document.getElementById("canvas1");
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  canvas.width = 1500;
  canvas.height = 600;

  const effect = new Effect(canvas, ctx);

  function drawCircle(ctx, canvas) {
    ctx.strokeStyle = "white"; // Set the stroke color
    ctx.lineWidth = 5; // Set the line width

    const centerX = canvas.width / 2; // X coordinate of the circle center
    const centerY = canvas.height / 2; // Y coordinate of the circle center
    const radius = Math.min(canvas.width, canvas.height) / 3; // Radius of the circle

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); // Draw the circle
    ctx.closePath();
    ctx.stroke(); // Apply the stroke to the circle
    ctx.lineWidth = 1; // Reset the line width
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(ctx, canvas);
    effect.render();
    requestAnimationFrame(animate);
  }

  animate();
}

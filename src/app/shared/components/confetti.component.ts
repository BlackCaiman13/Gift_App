import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-confetti',
  standalone: true,
  template: '<canvas #confettiCanvas class="fixed inset-0 pointer-events-none z-50"></canvas>',
})
export class ConfettiComponent implements OnInit {
  @ViewChild('confettiCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];

  ngOnInit() {
    const canvas = this.canvas.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  launch() {
    this.particles = [];

    for (let i = 0; i < 150; i++) {
      this.particles.push(new Particle(
        Math.random() * this.canvas.nativeElement.width,
        this.canvas.nativeElement.height / 2
      ));
    }

    this.animate();
  }

  private animate() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    this.particles.forEach((particle, index) => {
      particle.update();
      particle.draw(this.ctx);

      if (particle.y > this.canvas.nativeElement.height) {
        this.particles.splice(index, 1);
      }
    });

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10 - 5;
    this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
    this.size = Math.random() * 10 + 5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.3;
    this.vx *= 0.99;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

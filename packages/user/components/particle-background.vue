<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

/**
 * 科技感粒子背景
 * - canvas 自实现，不引第三方库
 * - 粒子 + 连线 + 鼠标交互 + resize 自适应
 * - 卸载时清理 rafId 与监听，避免路由切换后占 CPU
 */

const canvasRef = ref<HTMLCanvasElement | null>(null);

const NEON_COLORS = ['#00f0ff', '#7c5cff', '#ff006e', '#3a86ff'];
const LINK_DIST = 130; // 粒子连线距离
const MOUSE_LINK_DIST = 160; // 鼠标连线距离
const BG_DRAG = 'rgba(5, 8, 22, 0.18)'; // 拖尾叠加色

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
}

let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let rafId = 0;
let mouseX = -9999;
let mouseY = -9999;
let width = 0;
let height = 0;

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pickColor() {
  return NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
}

function setupCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // 粒子数量按面积动态计算，上限 120 保性能
  const count = Math.min(120, Math.floor((width * height) / 12000));
  particles = new Array(count).fill(0).map(() => ({
    x: rand(0, width),
    y: rand(0, height),
    vx: rand(-0.6, 0.6),
    vy: rand(-0.6, 0.6),
    r: rand(0.8, 2),
    color: pickColor(),
  }));
}

function draw() {
  if (!ctx) return;

  // 拖尾叠加
  ctx.fillStyle = BG_DRAG;
  ctx.fillRect(0, 0, width, height);

  // 更新 + 绘制粒子
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    // 边界反弹
    if (p.x < 0 || p.x > width) p.vx = -p.vx;
    if (p.y < 0 || p.y > height) p.vy = -p.vy;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // 粒子间连线
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < LINK_DIST) {
        const alpha = (1 - dist / LINK_DIST) * 0.5;
        ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // 鼠标连线
  if (mouseX > -1000) {
    for (const p of particles) {
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_LINK_DIST) {
        const alpha = (1 - dist / MOUSE_LINK_DIST) * 0.6;
        ctx.strokeStyle = `rgba(124, 92, 255, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouseX, mouseY);
        ctx.stroke();
      }
    }
  }

  rafId = requestAnimationFrame(draw);
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function onMouseLeave() {
  mouseX = -9999;
  mouseY = -9999;
}

function onResize() {
  setupCanvas();
}

onMounted(() => {
  setupCanvas();
  draw();
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseleave', onMouseLeave);
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseleave', onMouseLeave);
  window.removeEventListener('resize', onResize);
});
</script>

<template>
  <canvas ref="canvasRef" class="particle-bg" />
</template>

<style scoped>
.particle-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background-color: #050816;
}
</style>

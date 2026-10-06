/**
 * SparkEngine — sistema de partículas em <canvas> que simula uma soldagem.
 *
 * Camadas desenhadas a cada frame:
 *   1. Fumaça muito discreta subindo do ponto de solda
 *   2. Clarão (flash) azul/branco no momento em que o arco abre
 *   3. Arco elétrico: núcleo branco, halo azul e reflexo laranja no metal
 *   4. Faíscas em "risco" (streaks) com gravidade, arrasto, quique no chão
 *      e esfriamento de cor (branco → amarelo → laranja → vermelho)
 *   5. Brasas minúsculas que flutuam e somem no ar
 *
 * Ciclo realista (sequence: true): carregando → abertura do arco (clarão)
 * → solda (2,8–5,5 s, com pulsos e rajadas aleatórias) → pausa curta → repete.
 *
 * Só usa canvas 2D, composição "lighter" e nenhuma biblioteca externa.
 */

const TAU = Math.PI * 2;
const rand = (min, max) => min + Math.random() * (max - min);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// Paleta de esfriamento do metal incandescente (t = 0 quente → 1 frio)
const HEAT = [
  [255, 255, 240],
  [255, 236, 160],
  [255, 184, 70],
  [255, 122, 26],
  [214, 58, 10],
];
function heatColor(t) {
  const s = clamp(t, 0, 0.999) * (HEAT.length - 1);
  const i = Math.floor(s);
  const f = s - i;
  const a = HEAT[i];
  const b = HEAT[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

const DEFAULTS = {
  origin: { x: 50, y: 50 }, // posição do ponto de solda em % do canvas
  intensity: 1,             // multiplicador geral (hover pode aumentar)
  density: 1,               // multiplicador de partículas (menor no celular)
  sequence: true,           // ciclo solda/pausa com clarão na abertura
  arc: true,                // desenha o arco elétrico
  smoke: true,              // fumaça discreta
  floor: 0.06,              // distância do "chão" abaixo da solda (fração da altura) — null desativa
  spread: 'up',             // 'up' (spray para cima/lados) | 'radial'
  arcSize: 1,
  startDelay: 0.6,          // segundos antes do primeiro arco
  onArc: null,              // callback(level 0..1) para sincronizar CSS
};

export default class SparkEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.o = { ...DEFAULTS, ...options };
    this.sparks = [];
    this.embers = [];
    this.smoke = [];
    this.running = false;
    this.raf = 0;
    this.last = 0;
    this.time = 0;

    this.intensity = this.o.intensity;
    this.targetIntensity = this.o.intensity;
    this.flash = 0;
    this.arcLevel = 0;      // brilho atual do arco 0..1
    this.arcTarget = 0;
    this.lastArcReport = -1;

    // máquina de estados do ciclo de solda
    this.state = this.o.sequence ? 'waiting' : 'weld';
    this.stateTime = 0;
    this.stateDuration = this.o.startDelay;
    if (!this.o.sequence) this.arcTarget = 1;

    this.loop = this.loop.bind(this);
    this.resize();
  }

  /* ---------- API pública ---------- */
  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.sparks.length = 0;
    this.embers.length = 0;
    this.smoke.length = 0;
  }

  setIntensity(v) {
    this.targetIntensity = v;
  }

  setOrigin(x, y) {
    this.o.origin = { x, y };
    this.ox = (x / 100) * this.w;
    this.oy = (y / 100) * this.h;
  }

  /** Liga/desliga o arco manualmente (quando sequence = false). */
  setArc(on) {
    const wasOff = this.arcTarget < 1;
    this.arcTarget = on ? 1 : 0;
    if (on && wasOff) this.strike();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth || 1;
    const h = this.canvas.clientHeight || 1;
    this.w = w;
    this.h = h;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.scale = Math.max(Math.min(w, h) / 560, 0.45);
    this.setOrigin(this.o.origin.x, this.o.origin.y);
  }

  /** Desenha só o brilho (usado com prefers-reduced-motion). */
  renderStatic() {
    this.arcLevel = 0.85;
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.ctx.globalCompositeOperation = 'lighter';
    this.drawArc(0.85);
    this.ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- Ciclo ---------- */
  strike() {
    this.flash = 1;
    this.burst(rand(28, 46));
  }

  updateSequence(dt) {
    if (!this.o.sequence) return;
    this.stateTime += dt;
    if (this.stateTime < this.stateDuration) return;

    switch (this.state) {
      case 'waiting':
      case 'pause':
        // "carregando": o ponto começa a emitir luz antes do clarão
        this.stateDuration = this.state === 'waiting' ? 0.9 : rand(0.18, 0.35);
        this.state = 'charging';
        this.arcTarget = 0.18;
        break;
      case 'charging':
        this.state = 'weld';
        this.stateDuration = rand(2.8, 5.5);
        this.arcTarget = 1;
        this.strike();
        break;
      case 'weld':
        this.state = 'pause';
        this.stateDuration = rand(0.35, 0.9);
        this.arcTarget = 0;
        break;
      default:
        break;
    }
    this.stateTime = 0;
  }

  /* ---------- Partículas ---------- */
  spawnSpark(power = 1) {
    const s = this.scale;
    let angle;
    if (this.o.spread === 'radial') {
      angle = rand(0, TAU);
    } else {
      // 72% para cima/lados, 28% em qualquer direção (respingos)
      angle = Math.random() < 0.72 ? rand(-Math.PI * 0.98, -Math.PI * 0.02) : rand(0, TAU);
    }
    const heavy = Math.random() < 0.14;
    const speed = (heavy ? rand(120, 380) : rand(220, 980) * Math.pow(Math.random(), 0.55)) * s * power;
    this.sparks.push({
      x: this.ox + rand(-3, 3) * s,
      y: this.oy + rand(-2, 2) * s,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: heavy ? rand(0.9, 1.7) : rand(0.3, 1.15),
      age: 0,
      w: heavy ? rand(1.6, 2.6) : rand(0.7, 1.7),
      heavy,
      bounced: false,
      drag: heavy ? 0.35 : rand(0.8, 1.8),
      trail: heavy ? 0.012 : rand(0.016, 0.03),
    });
  }

  spawnEmber(x = this.ox, y = this.oy) {
    const s = this.scale;
    this.embers.push({
      x: x + rand(-14, 14) * s,
      y: y + rand(-10, 4) * s,
      vx: rand(-40, 40) * s,
      vy: rand(-90, -20) * s,
      life: rand(0.8, 2.2),
      age: 0,
      r: rand(0.5, 1.4) * Math.max(s, 0.7),
      phase: rand(0, TAU),
    });
  }

  spawnSmoke() {
    const s = this.scale;
    this.smoke.push({
      x: this.ox + rand(-10, 10) * s,
      y: this.oy - rand(4, 14) * s,
      vx: rand(-8, 14) * s,
      vy: rand(-38, -20) * s,
      r: rand(18, 34) * s,
      grow: rand(18, 34) * s,
      life: rand(2.4, 4),
      age: 0,
    });
  }

  burst(n) {
    const count = Math.round(n * this.o.density * this.intensity);
    for (let i = 0; i < count; i++) this.spawnSpark(rand(0.9, 1.25));
    for (let i = 0; i < count / 4; i++) this.spawnEmber();
  }

  emit(dt) {
    const welding = this.arcTarget >= 1 && this.arcLevel > 0.4;
    const k = this.o.density * this.intensity;

    if (welding) {
      // taxa variável (o arco "chia" e oscila)
      const flicker = 0.55 + 0.45 * Math.abs(Math.sin(this.time * 23.1) * Math.sin(this.time * 7.3));
      const rate = 150 * k * flicker;
      let n = rate * dt;
      while (n > 1) { this.spawnSpark(); n--; }
      if (Math.random() < n) this.spawnSpark();

      // rajadas aleatórias para nunca parecer repetitivo
      if (Math.random() < 1.3 * dt * this.intensity) this.burst(rand(10, 30));
      if (Math.random() < 9 * dt * k) this.spawnEmber();
      if (this.o.smoke && Math.random() < 2.2 * dt) this.spawnSmoke();
    } else if (this.arcLevel > 0.08 && Math.random() < 6 * dt * k) {
      // "carregando": algumas fagulhas tímidas
      this.spawnSpark(0.45);
    }
  }

  update(dt) {
    const s = this.scale;
    const g = 980 * s;
    const floorY = this.o.floor == null ? Infinity : this.oy + this.o.floor * this.h;

    for (let i = this.sparks.length - 1; i >= 0; i--) {
      const p = this.sparks[i];
      p.age += dt;
      if (p.age >= p.life || p.x < -40 || p.x > this.w + 40 || p.y > this.h + 40) {
        this.sparks[i] = this.sparks[this.sparks.length - 1];
        this.sparks.pop();
        continue;
      }
      const d = 1 - p.drag * dt;
      p.vx *= d;
      p.vy = p.vy * d + g * dt * (p.heavy ? 1.15 : 0.7);
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // quique no metal / chão com chance de se partir
      if (p.y > floorY && p.vy > 0 && !p.bounced) {
        p.y = floorY;
        p.vy *= -rand(0.18, 0.4);
        p.vx *= rand(0.5, 0.8);
        p.bounced = true;
        if (Math.random() < 0.35 && this.sparks.length < 900) {
          this.sparks.push({ ...p, vx: -p.vx * rand(0.4, 0.9), w: p.w * 0.7, life: p.age + rand(0.15, 0.4) });
        }
      }
    }

    for (let i = this.embers.length - 1; i >= 0; i--) {
      const e = this.embers[i];
      e.age += dt;
      if (e.age >= e.life) {
        this.embers[i] = this.embers[this.embers.length - 1];
        this.embers.pop();
        continue;
      }
      e.vx += Math.sin(this.time * 3 + e.phase) * 30 * s * dt;
      e.vy -= 12 * s * dt; // ar quente sobe
      e.x += e.vx * dt;
      e.y += e.vy * dt;
    }

    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const m = this.smoke[i];
      m.age += dt;
      if (m.age >= m.life) {
        this.smoke.splice(i, 1);
        continue;
      }
      m.x += m.vx * dt;
      m.y += m.vy * dt;
      m.r += m.grow * dt;
    }
  }

  /* ---------- Desenho ---------- */
  drawSmoke() {
    const ctx = this.ctx;
    ctx.globalCompositeOperation = 'source-over';
    for (const m of this.smoke) {
      const t = m.age / m.life;
      const a = Math.sin(t * Math.PI) * 0.055;
      const grd = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r);
      grd.addColorStop(0, `rgba(170,180,196,${a})`);
      grd.addColorStop(1, 'rgba(170,180,196,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, TAU);
      ctx.fill();
    }
  }

  drawArc(level) {
    if (level <= 0.01) return;
    const ctx = this.ctx;
    const s = this.scale * this.o.arcSize;
    const x = this.ox;
    const y = this.oy;
    const pulse = 0.82 + 0.18 * Math.sin(this.time * 31) * Math.sin(this.time * 13.7);
    const boost = clamp(this.intensity, 0.6, 1.8);

    // reflexo laranja no metal ao redor
    const spill = 220 * s * level * boost;
    let grd = ctx.createRadialGradient(x, y, 0, x, y, spill);
    grd.addColorStop(0, `rgba(255,140,40,${0.22 * level})`);
    grd.addColorStop(0.5, `rgba(255,100,20,${0.08 * level})`);
    grd.addColorStop(1, 'rgba(255,90,10,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(x - spill, y - spill, spill * 2, spill * 2);

    // halo azul elétrico
    const halo = 90 * s * level * pulse * boost;
    grd = ctx.createRadialGradient(x, y, 0, x, y, halo);
    grd.addColorStop(0, `rgba(210,235,255,${0.85 * level})`);
    grd.addColorStop(0.25, `rgba(110,180,255,${0.45 * level})`);
    grd.addColorStop(0.6, `rgba(60,120,255,${0.12 * level})`);
    grd.addColorStop(1, 'rgba(40,90,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(x - halo, y - halo, halo * 2, halo * 2);

    // núcleo branco
    const core = 14 * s * (0.75 + 0.5 * pulse) * Math.max(level, 0.3);
    grd = ctx.createRadialGradient(x, y, 0, x, y, core);
    grd.addColorStop(0, `rgba(255,255,255,${level})`);
    grd.addColorStop(0.5, `rgba(240,248,255,${0.8 * level})`);
    grd.addColorStop(1, 'rgba(200,225,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(x, y, core, 0, TAU);
    ctx.fill();

    // raios curtos do arco (estrela de luz)
    ctx.strokeStyle = `rgba(220,240,255,${0.35 * level * pulse})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const rays = 6;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * TAU + this.time * 0.6;
      const len = core * rand(1.6, 3.2);
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
    }
    ctx.stroke();
  }

  drawFlash() {
    if (this.flash <= 0.01) return;
    const ctx = this.ctx;
    const r = Math.max(this.w, this.h) * 0.9;
    const grd = ctx.createRadialGradient(this.ox, this.oy, 0, this.ox, this.oy, r);
    grd.addColorStop(0, `rgba(235,245,255,${0.75 * this.flash})`);
    grd.addColorStop(0.15, `rgba(150,200,255,${0.35 * this.flash})`);
    grd.addColorStop(1, 'rgba(80,140,255,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, this.w, this.h);
  }

  drawSparks() {
    const ctx = this.ctx;
    ctx.lineCap = 'round';
    for (const p of this.sparks) {
      const t = p.age / p.life;
      const [r, g, b] = heatColor(t * (p.heavy ? 0.85 : 1.05));
      const alpha = (1 - t * t) * (0.65 + Math.random() * 0.35); // cintilação
      const tx = p.x - p.vx * p.trail;
      const ty = p.y - p.vy * p.trail;

      // brilho externo (glow)
      ctx.strokeStyle = `rgba(${r},${Math.max(g - 60, 0)},${Math.max(b - 30, 0)},${alpha * 0.22})`;
      ctx.lineWidth = p.w * 3.6;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      // núcleo do risco
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = p.w;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }

  drawEmbers() {
    const ctx = this.ctx;
    for (const e of this.embers) {
      const t = e.age / e.life;
      const a = (1 - t) * (0.5 + 0.5 * Math.sin(this.time * 18 + e.phase));
      const [r, g, b] = heatColor(0.35 + t * 0.6);
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, TAU);
      ctx.fill();
    }
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.time += dt;

    this.intensity += (this.targetIntensity - this.intensity) * Math.min(dt * 4, 1);
    this.updateSequence(dt);

    // o arco sobe rápido e apaga rápido, com tremulação
    const speed = this.arcTarget > this.arcLevel ? 14 : 9;
    this.arcLevel += (this.arcTarget - this.arcLevel) * Math.min(dt * speed, 1);
    this.flash *= Math.exp(-dt * 6.5);

    this.emit(dt);
    this.update(dt);

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    if (this.o.smoke) this.drawSmoke();
    ctx.globalCompositeOperation = 'lighter';
    this.drawFlash();
    const flick = this.arcTarget >= 1 ? 0.85 + Math.random() * 0.15 : 1;
    if (this.o.arc) this.drawArc(this.arcLevel * flick);
    this.drawSparks();
    this.drawEmbers();
    ctx.globalCompositeOperation = 'source-over';

    // informa o nível do arco (para luz/reflexo em CSS), sem spam de updates
    if (this.o.onArc) {
      const lvl = clamp(this.arcLevel * flick + this.flash * 0.6, 0, 1.4);
      if (Math.abs(lvl - this.lastArcReport) > 0.03) {
        this.lastArcReport = lvl;
        this.o.onArc(lvl);
      }
    }

    this.raf = requestAnimationFrame(this.loop);
  }
}

/**
 * EmberField — brasas e fagulhas flutuando em toda a área (fundos de seção).
 */
export class EmberField {
  constructor(canvas, { density = 1, color = 'warm' } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.density = density;
    this.color = color;
    this.parts = [];
    this.running = false;
    this.loop = this.loop.bind(this);
    this.resize();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth || 1;
    this.h = this.canvas.clientHeight || 1;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.max = Math.round(((this.w * this.h) / 9000) * this.density);
  }

  spawn(initial = false) {
    this.parts.push({
      x: rand(0, this.w),
      y: initial ? rand(0, this.h) : this.h + 10,
      vx: rand(-12, 18),
      vy: rand(-70, -22),
      r: rand(0.6, 2),
      life: rand(4, 9),
      age: initial ? rand(0, 4) : 0,
      phase: rand(0, TAU),
      streak: Math.random() < 0.18,
    });
  }

  start() {
    if (this.running) return;
    this.running = true;
    if (!this.parts.length) for (let i = 0; i < this.max * 0.7; i++) this.spawn(true);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  destroy() {
    this.stop();
    this.parts.length = 0;
  }

  loop(now) {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = 'lighter';

    if (this.parts.length < this.max && Math.random() < 0.6) this.spawn();

    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.age += dt;
      if (p.age > p.life || p.y < -20) {
        this.parts.splice(i, 1);
        continue;
      }
      p.vx += Math.sin(p.age * 2 + p.phase) * 10 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const t = p.age / p.life;
      const a = Math.sin(t * Math.PI) * (0.45 + 0.55 * Math.abs(Math.sin(p.age * 6 + p.phase)));
      const [r, g, b] = heatColor(0.3 + t * 0.6);
      if (p.streak) {
        ctx.strokeStyle = `rgba(${r},${g},${b},${a * 0.9})`;
        ctx.lineWidth = p.r * 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.12, p.y - p.vy * 0.12);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(${r},${g},${b},${a * 0.25})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, TAU);
        ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    this.raf = requestAnimationFrame(this.loop);
  }
}

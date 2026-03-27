import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface Achievement {
  game: string;
  feat: string;
  badge: string;
  color: string;
}

const achievements: Achievement[] = [
  { game: 'Sekiro: Shadows Die Twice', feat: 'Defeated 7 times — every memory, every path', badge: '×7', color: '#E8645A' },
  { game: 'Sekiro', feat: 'Visited all 4 endings — True Immortal, Shura, Return, Dragon\'s Homecoming', badge: '4/4', color: '#F5C842' },
  { game: 'Hades', feat: 'Cleared the Gauntlet — all Pact of Punishment runs', badge: '∞', color: '#c084fc' },
  { game: 'Hollow Knight', feat: 'All endings unlocked — Sealed Siblings, Dream No More, Embrace the Void', badge: '3/3', color: '#5B9CF6' },
  { game: 'Ghost of Tsushima', feat: 'Completed — liberated every inch of Tsushima', badge: '100%', color: '#5DBE89' },
  { game: 'Minecraft', feat: 'Full Diamond Beacon — all 5 effects, all 6 layers', badge: '◆', color: '#38bdf8' },
];

const CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const ITEM = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

// Tiny snake game
const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CELL = 18;
    const COLS = Math.floor(canvas.width / CELL);
    const ROWS = Math.floor(canvas.height / CELL);

    let snake = [{ x: 5, y: 5 }];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = { x: 15, y: 10 };
    let score = 0;
    let alive = true;
    let animId: number;

    const placeFood = () => {
      food = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
    };

    const draw = () => {
      ctx.fillStyle = '#F8F7F4';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid lines
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 0.5;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, canvas.height); ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(canvas.width, r * CELL); ctx.stroke();
      }

      // Food
      ctx.fillStyle = '#E8645A';
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Snake
      snake.forEach((seg, i) => {
        const alpha = 0.5 + 0.5 * (i / snake.length);
        ctx.fillStyle = i === 0 ? '#1A1A1A' : `rgba(91,156,246,${alpha})`;
        ctx.beginPath();
        ctx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
        ctx.fill();
      });

      // Score
      ctx.fillStyle = '#1A1A1A';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${score}`, 8, 16);

      if (!alive) {
        ctx.fillStyle = 'rgba(248,247,244,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1A1A1A';
        ctx.font = 'bold 18px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 12);
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText(`Score: ${score} — Click to restart`, canvas.width / 2, canvas.height / 2 + 12);
      }
    };

    let last = 0;
    const SPEED = 120;
    const tick = (ts: number) => {
      if (!alive) { draw(); return; }
      if (ts - last > SPEED) {
        last = ts;
        dir = nextDir;
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { alive = false; draw(); return; }
        if (snake.some(s => s.x === head.x && s.y === head.y)) { alive = false; draw(); return; }

        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
          score++;
          placeFood();
        } else {
          snake.pop();
        }
      }
      draw();
      animId = requestAnimationFrame(tick);
    };

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault(); // Stop page scroll while playing
        if (!(d.x === -dir.x && d.y === -dir.y)) nextDir = d;
      }
    };

    const restart = () => {
      if (!alive) {
        snake = [{ x: 5, y: 5 }];
        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
        placeFood();
        score = 0;
        alive = true;
        animId = requestAnimationFrame(tick);
      }
    };

    canvas.addEventListener('click', restart);
    window.addEventListener('keydown', onKey);
    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('click', restart);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-mono text-xs text-text-secondary tracking-widest uppercase">Arrow Keys to move · Click to restart</p>
      <canvas
        ref={canvasRef}
        width={540}
        height={300}
        className="rounded-2xl border border-border shadow-[var(--shadow)] cursor-pointer"
      />
    </div>
  );
};

export const GamesPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary font-sans">
      {/* Back nav */}
      <motion.a
        href={import.meta.env.BASE_URL}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-8 left-8 z-50 font-mono text-xs tracking-widest uppercase text-text-secondary hover:text-text-primary transition-colors duration-200 flex items-center gap-2 group"
      >
        <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        Back
      </motion.a>

      <div className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20"
        >
          <p className="font-mono text-xs tracking-[0.4em] uppercase text-accent-primary mb-3">Easter Egg · /games</p>
          <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.9] tracking-tighter text-text-primary">
            My<br />
            <span className="text-text-secondary opacity-30">achievements</span>
          </h1>
          <p className="mt-6 text-text-secondary font-sans text-base max-w-md leading-relaxed">
            Games aren't entertainment. They're systems — and I study every seam until they break.
          </p>
        </motion.div>

        {/* Achievements */}
        <section className="mb-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-[10px] tracking-[0.5em] uppercase text-text-muted mb-8"
          >
            ── Confirmed Completions
          </motion.p>

          <motion.div
            variants={CONTAINER}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-4"
          >
            {achievements.map((a) => (
              <motion.div
                key={a.game}
                variants={ITEM}
                className="group flex items-center gap-5 p-5 rounded-2xl border border-border bg-bg-secondary/60 hover:bg-bg-secondary transition-all duration-300"
              >
                {/* Badge */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-display text-xl font-black shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${a.color}18`, color: a.color, border: `1px solid ${a.color}30` }}
                >
                  {a.badge}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm uppercase tracking-widest text-text-primary font-bold truncate">{a.game}</p>
                  <p className="font-mono text-xs text-text-secondary mt-0.5 leading-relaxed">{a.feat}</p>
                </div>

                {/* Tick */}
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold"
                  style={{ backgroundColor: a.color, color: '#fff' }}
                >
                  ✓
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Snake */}
        <section>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-mono text-[10px] tracking-[0.5em] uppercase text-text-muted mb-8"
          >
            ── Mini Game · Snake
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <SnakeGame />
          </motion.div>
        </section>
      </div>
    </div>
  );
};

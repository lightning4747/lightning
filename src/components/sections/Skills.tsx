import React, { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { FadeSection } from "../ui/FadeSection";
import BorderGlow from "../ui/BorderGlow";

/* ─── Types ─────────────────────────────────────────────────────────────── */

interface Skill { name: string; icon: string; }
type Vec3 = [number, number, number];
type Triangle = [Vec3, Vec3, Vec3];

/* ─── Constants ──────────────────────────────────────────────────────────── */

const SKILLS: Skill[] = [
  { name: "React",      icon: "devicon-react-original colored" },
  { name: "TypeScript", icon: "devicon-typescript-plain colored" },
  { name: "JavaScript", icon: "devicon-javascript-plain colored" },
  { name: "Node.js",    icon: "devicon-nodejs-plain colored" },
  { name: "Python",     icon: "devicon-python-plain colored" },
  { name: "Java",       icon: "devicon-java-plain colored" },
  { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
  { name: "MongoDB",    icon: "devicon-mongodb-plain colored" },
  { name: "Docker",     icon: "devicon-docker-plain colored" },
  { name: "Git",        icon: "devicon-git-plain colored" },
  { name: "AWS",        icon: "devicon-amazonwebservices-plain-wordmark colored" },
  { name: "Linux",      icon: "devicon-linux-plain colored" },
  { name: "Express",    icon: "devicon-express-original" },
  { name: "Redis",      icon: "devicon-redis-plain colored" },
  { name: "Tailwind",   icon: "devicon-tailwindcss-original colored" },
  { name: "Three.js",   icon: "devicon-threejs-original colored" },
  { name: "HTML5",      icon: "devicon-html5-plain colored" },
  { name: "CSS3",       icon: "devicon-css3-plain colored" },
  { name: "MySQL",      icon: "devicon-mysql-plain colored" },
  { name: "GraphQL",    icon: "devicon-graphql-plain colored" },
];

const LIGHT_PALETTE = ['#E8645A', '#F5C842', '#5B9CF6', '#5DBE89'];
const CONIC_GRADIENT = `conic-gradient(from 0deg, ${LIGHT_PALETTE[0]}, ${LIGHT_PALETTE[1]}, ${LIGHT_PALETTE[2]}, ${LIGHT_PALETTE[3]}, ${LIGHT_PALETTE[0]})`;

const GLOBE_RADIUS = 240;
const SKILL_RADIUS = GLOBE_RADIUS * 1.15;
const GLOBE_SIZE   = 660;
const GLOBE_FOV    = 700;

/* ─── Pure Math Helpers ──────────────────────────────────────────────────── */

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return normalize([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
}

function rotatePoint(x: number, y: number, z: number, rx: number, ry: number): Vec3 {
  const cosY = Math.cos(ry), sinY = Math.sin(ry);
  const x1 =  x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(rx), sinX = Math.sin(rx);
  return [x1, y * cosX - z1 * sinX, y * sinX + z1 * cosX];
}

function project3D(px: number, py: number, pz: number, cx: number, cy: number, fov: number) {
  const scale = fov / (fov + pz);
  return { sx: cx + px, sy: cy + py, scale };
}

function getFibonacciSpherePoints(n: number, radius: number) {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi   = (2 * Math.PI * i) / goldenRatio;
    return {
      x: radius * Math.sin(theta) * Math.cos(phi),
      y: radius * Math.sin(theta) * Math.sin(phi),
      z: radius * Math.cos(theta),
    };
  });
}

function buildGeodesicTriangles(subdivisions: number, radius: number): Triangle[] {
  const t = (1 + Math.sqrt(5)) / 2;
  let verts: Vec3[] = (
    [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]] as Vec3[]
  ).map(normalize);

  let faces: [number,number,number][] = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  for (let s = 0; s < subdivisions; s++) {
    const midCache = new Map<string, number>();
    const getMid = (a: number, b: number): number => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (midCache.has(key)) return midCache.get(key)!;
      verts.push(midpoint(verts[a], verts[b]));
      midCache.set(key, verts.length - 1);
      return verts.length - 1;
    };
    const next: [number,number,number][] = [];
    for (const [a, b, c] of faces) {
      const ab = getMid(a,b), bc = getMid(b,c), ca = getMid(c,a);
      next.push([a,ab,ca],[b,bc,ab],[c,ca,bc],[ab,bc,ca]);
    }
    faces = next;
  }

  const scaled = verts.map(v => [v[0]*radius, v[1]*radius, v[2]*radius] as Vec3);
  return faces.map(([a,b,c]) => [scaled[a], scaled[b], scaled[c]]);
}

/* ─── BentoCard ──────────────────────────────────────────────────────────── */

const BentoCard = ({ children, className, isDarkMode, id, delay = 0 }: any) => {
  const CardContent = () => (
    <div className="p-10 h-full flex flex-col justify-center relative overflow-hidden">
      {/* Grain overlay — static SVG, no re-renders */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay grayscale invert">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id={`nF-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#nF-${id})`} />
        </svg>
      </div>
      <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
        {children}
      </div>
      <div className={`absolute top-6 right-8 font-mono text-[9px] tracking-[0.4em] uppercase opacity-20 pointer-events-none select-none
        ${isDarkMode ? "text-accent-primary" : "text-slate-400"}`}>
        SYS-OP / {id?.toUpperCase()}-SEC
      </div>
      <div className={`absolute bottom-6 left-10 w-8 h-[1px] opacity-30 ${isDarkMode ? "bg-accent-primary" : "bg-slate-400"}`} />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className={`${className} relative group h-full transition-transform duration-500`}
    >
      {isDarkMode ? (
        <BorderGlow borderRadius={40} glowColor="180 80 80" backgroundColor="#13141a"
          glowRadius={60} glowIntensity={0.6} edgeSensitivity={40} className="h-full cursor-default">
          <CardContent />
        </BorderGlow>
      ) : (
        <div className="relative h-full w-full rounded-[40px] overflow-visible">
          {/* CSS keyframe animation — zero JS re-renders */}
          <div
            className="absolute -inset-[3px] rounded-[43px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none"
            style={{ background: CONIC_GRADIENT }}
          />
          <div
            className="absolute inset-2 -z-20 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-700"
            style={{ background: CONIC_GRADIENT, borderRadius: '40px' }}
          />
          <div className="h-full w-full rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <CardContent />
          </div>
        </div>
      )}
    </motion.div>
  );
};

/* ─── SkillWord ──────────────────────────────────────────────────────────── */

const SkillWord = ({ word, isDarkMode }: { word: string; isDarkMode: boolean }) => {
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const colors = isDarkMode ? ["#4ecdc4", "#3b82f6", "#0ea5e9"] : LIGHT_PALETTE;
  return (
    <span
      onMouseEnter={() => setHoverColor(colors[Math.floor(Math.random() * colors.length)])}
      onMouseLeave={() => setHoverColor(null)}
      className={`font-bold transition-all duration-300 hover:scale-110 inline-block cursor-crosshair
        ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
      style={{ color: hoverColor || undefined }}
    >
      {word}
    </span>
  );
};

/* ─── HighlightedText ────────────────────────────────────────────────────── */

const HighlightedText = ({ category, tech, isDarkMode }: any) => (
  <div className="max-w-md select-none">
    <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.4em] mb-4 block
      ${isDarkMode ? "text-accent-primary/80" : "text-slate-500/80"}`}>
      {category}
    </span>
    <p className={`text-base sm:text-2xl font-display tracking-tighter leading-tight transition-colors duration-300
      ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
      {tech.split(', ').map((word: string, i: number, arr: string[]) => (
        <React.Fragment key={word}>
          <SkillWord word={word} isDarkMode={isDarkMode} />
          {i < arr.length - 1 && <span className="opacity-20 mx-2 font-light">/</span>}
        </React.Fragment>
      ))}
    </p>
  </div>
);

/* ─── Skills (Main) ──────────────────────────────────────────────────────── */

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  /* Canvas / overlay refs */
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animRef    = useRef<number>(0);

  /* Physics state — all in refs to avoid re-renders */
  const rotRef      = useRef({ x: 0.3, y: 0 });
  const velRef      = useRef({ x: 0.0012, y: 0.003 });
  const baseVelRef  = useRef({ x: 0.0012, y: 0.003 });
  const dragRef     = useRef(false);
  const lastPosRef  = useRef({ x: 0, y: 0 });
  const isDarkRef   = useRef(isDarkMode);
  const isVisRef    = useRef(true);

  /* Skill hover state */
  const hoveredRef  = useRef<number | null>(null);
  const hoverStates = useRef<number[]>(new Array(SKILLS.length).fill(0));

  /* ── OPTIMIZATION 1: Memoized geometry — computed once, never recalculated ── */
  const triangles = useMemo(() => buildGeodesicTriangles(2, GLOBE_RADIUS), []);
  const skillPoints = useMemo(() => getFibonacciSpherePoints(SKILLS.length, SKILL_RADIUS), []);

  /* ── OPTIMIZATION 2: tagRefs array — eliminates querySelectorAll every frame ── */
  const tagRefs = useRef<(HTMLDivElement | null)[]>(new Array(SKILLS.length).fill(null));

  useEffect(() => { isDarkRef.current = isDarkMode; }, [isDarkMode]);

  /* ── Pause RAF when section is off-screen ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const obs = new IntersectionObserver(([e]) => { isVisRef.current = e.isIntersecting; }, { threshold: 0 });
    obs.observe(canvas);
    return () => obs.disconnect();
  }, []);

  /* ── DRAW LOOP ── */
  const draw = useCallback(() => {
    animRef.current = requestAnimationFrame(draw);

    /* ── OPTIMIZATION 3: skip all work when off-screen ── */
    if (!isVisRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const W  = canvas.width,  H  = canvas.height;
    const cx = W / 2,         cy = H / 2;
    const dark = isDarkRef.current;
    const rx = rotRef.current.x, ry = rotRef.current.y;

    ctx.clearRect(0, 0, W, H);

    /* ── OPTIMIZATION 4: Early back-face cull — skip triangles before project/fill ── */
    for (const [va, vb, vc] of triangles) {
      const [rax, ray, raz] = rotatePoint(va[0], va[1], va[2], rx, ry);
      const [rbx, rby, rbz] = rotatePoint(vb[0], vb[1], vb[2], rx, ry);
      const [rcx, rcy, rcz] = rotatePoint(vc[0], vc[1], vc[2], rx, ry);

      const avgZ = (raz + rbz + rcz) / 3;
      /* Cull back hemisphere — saves ~50% of fill() calls */
      if (avgZ < -GLOBE_RADIUS * 0.1) continue;

      const pa = project3D(rax, ray, raz, cx, cy, GLOBE_FOV);
      const pb = project3D(rbx, rby, rbz, cx, cy, GLOBE_FOV);
      const pc = project3D(rcx, rcy, rcz, cx, cy, GLOBE_FOV);

      /* Lighting */
      const abx = rbx-rax, aby = rby-ray, abz = rbz-raz;
      const acx = rcx-rax, acy = rcy-ray, acz = rcz-raz;
      const nx = aby*acz - abz*acy;
      const ny = abz*acx - abx*acz;
      const nz = abx*acy - aby*acx;
      const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz) || 1;
      const lx = 0.4, ly = -0.6, lz = 1.0;
      const lLen = Math.sqrt(lx*lx + ly*ly + lz*lz);
      const dot = (nx/nLen)*(lx/lLen) + (ny/nLen)*(ly/lLen) + (nz/nLen)*(lz/lLen);
      const fBr = Math.max(0, dot);

      const depth = (avgZ + GLOBE_RADIUS) / (GLOBE_RADIUS * 2);
      const fillAlpha  = dark ? 0.03 + fBr*0.07 + depth*0.04 : 0.02 + fBr*0.06 + depth*0.03;
      const edgeAlpha  = dark ? 0.08 + depth*0.45 + fBr*0.2  : 0.06 + depth*0.4  + fBr*0.18;

      ctx.beginPath();
      ctx.moveTo(pa.sx, pa.sy);
      ctx.lineTo(pb.sx, pb.sy);
      ctx.lineTo(pc.sx, pc.sy);
      ctx.closePath();
      ctx.fillStyle   = dark ? `rgba(78,205,196,${fillAlpha.toFixed(3)})` : `rgba(59,130,246,${fillAlpha.toFixed(3)})`;
      ctx.fill();
      ctx.strokeStyle = dark ? `rgba(78,205,196,${Math.min(edgeAlpha,0.8).toFixed(3)})` : `rgba(59,130,246,${Math.min(edgeAlpha,0.75).toFixed(3)})`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    /* Equator ring */
    ctx.beginPath();
    let first = true;
    for (let s = 0; s <= 60; s++) {
      const theta = (2 * Math.PI * s) / 60;
      const [rx3, ry3, rz3] = rotatePoint(GLOBE_RADIUS*Math.cos(theta), 0, GLOBE_RADIUS*Math.sin(theta), rx, ry);
      const { sx, sy } = project3D(rx3, ry3, rz3, cx, cy, GLOBE_FOV);
      first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      first = false;
    }
    ctx.closePath();
    ctx.strokeStyle = dark ? "rgba(78,205,196,0.15)" : "rgba(59,130,246,0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();

    /* ── OPTIMIZATION 5: tagRefs — direct DOM access, no querySelectorAll ── */
    const projected = skillPoints.map(p => {
      const [rx3, ry3, rz3] = rotatePoint(p.x, p.y, p.z, rx, ry);
      return project3D(rx3, ry3, rz3, cx, cy, GLOBE_FOV);
    });

    const minScale = GLOBE_FOV / (GLOBE_FOV + SKILL_RADIUS);
    const maxScale = GLOBE_FOV / (GLOBE_FOV - SKILL_RADIUS);

    for (let i = 0; i < SKILLS.length; i++) {
      const tag = tagRefs.current[i];
      const pd  = projected[i];
      if (!tag || !pd) continue;

      const target = hoveredRef.current === i ? 1 : 0;
      hoverStates.current[i] += (target - hoverStates.current[i]) * 0.15;
      const h = hoverStates.current[i];

      const frontDepth    = Math.max(0, (pd.scale - minScale) / (maxScale - minScale));
      const visThreshold  = 0.45;
      const adjDepth      = Math.max(0, (frontDepth - visThreshold) / (1 - visThreshold));

      const depth        = (pd.scale * (GLOBE_FOV + SKILL_RADIUS) - GLOBE_FOV + SKILL_RADIUS) / (SKILL_RADIUS * 2);
      const baseScale    = 0.5 + depth * 0.5;
      const currentScale = baseScale * (1 + h * 0.3);
      const opacity      = (adjDepth ** 1.8) * (1 - h) + h;

      /* Batch style writes — single reflow per tag per frame */
      tag.style.left        = `${pd.sx}px`;
      tag.style.top         = `${pd.sy}px`;
      tag.style.transform   = `translate(-50%,-50%) scale(${currentScale.toFixed(3)}) rotate(${(h * -5).toFixed(1)}deg)`;
      tag.style.opacity     = opacity.toFixed(3);
      tag.style.zIndex      = (Math.round((pd.scale - 1) * 1000 + 1000) + (h > 0.1 ? 5000 : 0)).toString();
      tag.style.pointerEvents = adjDepth > 0.1 ? "auto" : "none";
      tag.style.visibility    = adjDepth > 0.01 ? "visible" : "hidden";

      const icon = tag.firstElementChild as HTMLElement | null;
      const span = tag.lastElementChild  as HTMLElement | null;
      if (icon && h > 0.01) {
        icon.style.filter = `drop-shadow(0 0 ${(h*20).toFixed(1)}px ${dark ? "rgba(78,205,196,0.8)" : "rgba(59,130,246,0.6)"}) brightness(${(1 + h * 0.2).toFixed(2)})`;
      } else if (icon) {
        icon.style.filter = "none";
      }
      if (span) {
        span.style.opacity   = (0.4 + h * 0.6).toFixed(3);
        span.style.transform = `translateY(${((1-h)*4).toFixed(1)}px) scale(${(1+h*0.1).toFixed(3)})`;
        span.style.color     = h > 0.5 ? (dark ? "#4ecdc4" : "#3b82f6") : "";
      }
    }

    /* ── OPTIMIZATION 6: Physics runs in RAF, not on mousemove ── */
    if (!dragRef.current) {
      const slowdown = hoveredRef.current !== null ? 0.05 : 1;
      const tvx = baseVelRef.current.x * slowdown;
      const tvy = baseVelRef.current.y * slowdown;

      velRef.current.x = velRef.current.x * 0.95 + (tvx - velRef.current.x) * 0.05;
      velRef.current.y = velRef.current.y * 0.95 + (tvy - velRef.current.y) * 0.05;
      rotRef.current.x += velRef.current.x;
      rotRef.current.y += velRef.current.y;
    }
  }, [triangles, skillPoints]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  /* ── Mouse / Touch handlers — only accumulate deltas, physics in RAF ── */
  const onMouseDown = (e: React.MouseEvent) => {
    dragRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    /* Apply force: only accumulate into velocity/rotation refs */
    velRef.current.y   =  dx * 0.008;
    velRef.current.x   = -dy * 0.008;
    rotRef.current.y  +=  dx * 0.008;
    rotRef.current.x  +=  dy * 0.008;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };
  const onTouchStart = (e: React.TouchEvent) => {
    dragRef.current = true;
    lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!dragRef.current) return;
    const dx = e.touches[0].clientX - lastPosRef.current.x;
    const dy = e.touches[0].clientY - lastPosRef.current.y;
    velRef.current.y  =  dx * 0.008;
    velRef.current.x  = -dy * 0.008;
    rotRef.current.y +=  dx * 0.008;
    rotRef.current.x +=  dy * 0.008;
    lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  return (
    <section id="skills" className="pt-12 pb-12 px-6 md:px-10 max-w-6xl mx-auto min-h-screen flex flex-col items-center overflow-visible">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />

      <FadeSection direction="down" delay={0.2} className="w-full text-left">
        <div className="section-header mb-16">
          <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
            / Skills
          </span>
        </div>
      </FadeSection>

      {/* 3D Globe */}
      <div className="w-full flex justify-center mb-24 overflow-visible">
        <div
          className="relative cursor-grab active:cursor-grabbing select-none"
          style={{ width: GLOBE_SIZE, height: GLOBE_SIZE }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={() => { dragRef.current = false; }}
          onMouseLeave={() => { dragRef.current = false; }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => { dragRef.current = false; }}
        >
          <canvas
            ref={canvasRef}
            width={GLOBE_SIZE}
            height={GLOBE_SIZE}
            className="absolute inset-0"
            style={{ pointerEvents: "none", opacity: isDarkMode ? 0.7 : 0.9 }}
          />

          <div ref={overlayRef} className="absolute inset-0" style={{ pointerEvents: "none" }}>
            {SKILLS.map((skill, i) => (
              <div
                key={i}
                /* ── tagRefs[i]: direct ref instead of querySelectorAll ── */
                ref={el => { tagRefs.current[i] = el; }}
                className="skill-tag absolute flex flex-col items-center gap-0.5"
                style={{
                  pointerEvents: "auto",
                  transition: "none",
                  /* GPU hints — promote each tag to its own compositing layer */
                  willChange: "transform, opacity",
                }}
                onMouseEnter={() => { hoveredRef.current = i; }}
                onMouseLeave={() => { hoveredRef.current = null; }}
              >
                <i className={`${skill.icon} text-3xl`} />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase mt-1 pointer-events-none">
                  {skill.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bento Tech Stack Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[220px] mb-20 overflow-visible">
        <BentoCard id="stack-backend" className="md:col-span-8" isDarkMode={isDarkMode} delay={0.1}>
          <HighlightedText category="Infrastructure & Backend" tech="Node.js, Express, Python, fastify, NestJS" isDarkMode={isDarkMode} />
        </BentoCard>

        <BentoCard id="stack-ml" className="md:col-span-4" isDarkMode={isDarkMode} delay={0.2}>
          <HighlightedText category="Machine Learning" tech="XGBoost, PyTorch, TensorFlow, LangChain" isDarkMode={isDarkMode} />
        </BentoCard>

        <BentoCard id="stack-arch" className="md:col-span-4" isDarkMode={isDarkMode} delay={0.1}>
          <HighlightedText category="Architecture" tech="AWS, Docker, Linux, Git, Terraform" isDarkMode={isDarkMode} />
        </BentoCard>

        <BentoCard id="stack-data" className="md:col-span-8" isDarkMode={isDarkMode} delay={0.2}>
          <HighlightedText category="Data Persistence" tech="PostgreSQL, MongoDB, Redis, MySQL, DynamoDB" isDarkMode={isDarkMode} />
        </BentoCard>

        <BentoCard id="stack-fe" className="md:col-span-12" isDarkMode={isDarkMode} delay={0.3}>
          <HighlightedText category="Interactive Frontend" tech="React, TypeScript, Three.js, Framer Motion, Tailwind, Next.js" isDarkMode={isDarkMode} />
        </BentoCard>
      </div>
    </section>
  );
};
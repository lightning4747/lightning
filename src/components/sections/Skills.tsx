import React, { useEffect, useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";
import { FadeSection } from "../ui/FadeSection";
import BorderGlow from "../ui/BorderGlow";

interface Skill {
  name: string;
  icon: string;
}

const SKILLS: Skill[] = [
  { name: "React", icon: "devicon-react-original colored" },
  { name: "TypeScript", icon: "devicon-typescript-plain colored" },
  { name: "JavaScript", icon: "devicon-javascript-plain colored" },
  { name: "Node.js", icon: "devicon-nodejs-plain colored" },
  { name: "Python", icon: "devicon-python-plain colored" },
  { name: "Java", icon: "devicon-java-plain colored" },
  { name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
  { name: "MongoDB", icon: "devicon-mongodb-plain colored" },
  { name: "Docker", icon: "devicon-docker-plain colored" },
  { name: "Git", icon: "devicon-git-plain colored" },
  { name: "AWS", icon: "devicon-amazonwebservices-plain-wordmark colored" },
  { name: "Linux", icon: "devicon-linux-plain colored" },
  { name: "Express", icon: "devicon-express-original" },
  { name: "Redis", icon: "devicon-redis-plain colored" },
  { name: "Tailwind", icon: "devicon-tailwindcss-original colored" },
  { name: "Three.js", icon: "devicon-threejs-original colored" },
  { name: "HTML5", icon: "devicon-html5-plain colored" },
  { name: "CSS3", icon: "devicon-css3-plain colored" },
  { name: "MySQL", icon: "devicon-mysql-plain colored" },
  { name: "GraphQL", icon: "devicon-graphql-plain colored" },
];

const LIGHT_PALETTE = ['#E8645A', '#F5C842', '#5B9CF6', '#5DBE89'];

const GLOBE_RADIUS = 240;
const SKILL_RADIUS = GLOBE_RADIUS * 1.15;
const GLOBE_SIZE = 660;
const GLOBE_FOV = 700;

function project3D(px: number, py: number, pz: number, cx: number, cy: number, fov: number) {
  const scale = fov / (fov + pz);
  return { sx: cx + px, sy: cy + py, scale };
}

function rotatePoint(x: number, y: number, z: number, rx: number, ry: number): [number, number, number] {
  const cosY = Math.cos(ry), sinY = Math.sin(ry);
  const x1 = x * cosY + z * sinY;
  const z1 = -x * sinY + z * cosY;
  const cosX = Math.cos(rx), sinX = Math.sin(rx);
  return [x1, y * cosX - z1 * sinX, y * sinX + z1 * cosX];
}

function getFibonacciSpherePoints(n: number, radius: number) {
  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  return Array.from({ length: n }, (_, i) => {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi = (2 * Math.PI * i) / goldenRatio;
    return { x: radius * Math.sin(theta) * Math.cos(phi), y: radius * Math.sin(theta) * Math.sin(phi), z: radius * Math.cos(theta) };
  });
}

type Vec3 = [number, number, number];
type Triangle = [Vec3, Vec3, Vec3];

function normalize(v: Vec3): Vec3 {
  const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
  return [v[0] / len, v[1] / len, v[2] / len];
}

function midpoint(a: Vec3, b: Vec3): Vec3 {
  return normalize([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
}

function buildGeodesicTriangles(subdivisions: number, radius: number): Triangle[] {
  const t = (1 + Math.sqrt(5)) / 2;
  const baseVerts: Vec3[] = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]].map(normalize) as Vec3[];
  let faces: [number, number, number][] = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  let verts = [...baseVerts];
  for (let s = 0; s < subdivisions; s++) {
    const midCache = new Map<string, number>();
    const getMid = (a: number, b: number): number => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      if (midCache.has(key)) return midCache.get(key)!;
      const mid = midpoint(verts[a], verts[b]);
      verts.push(mid);
      const idx = verts.length - 1;
      midCache.set(key, idx);
      return idx;
    };
    const newFaces: [number, number, number][] = [];
    for (const [a, b, c] of faces) {
      const ab = getMid(a, b); const bc = getMid(b, c); const ca = getMid(c, a);
      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = newFaces;
  }
  const scaled = verts.map(v => [v[0] * radius, v[1] * radius, v[2] * radius] as Vec3);
  return faces.map(([a, b, c]) => [scaled[a], scaled[b], scaled[c]]);
}

const BentoCard = ({ children, className, isDarkMode, id, delay = 0 }: any) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isDarkMode) return;
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1.5) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, [isDarkMode]);

  const conicGradient = `conic-gradient(from ${rotation}deg, ${LIGHT_PALETTE[0]}, ${LIGHT_PALETTE[1]}, ${LIGHT_PALETTE[2]}, ${LIGHT_PALETTE[3]}, ${LIGHT_PALETTE[0]})`;

  // Content Wrapper with Noise and Decorative elements
  const CardContent = () => (
    <div className="p-10 h-full flex flex-col justify-center relative overflow-hidden h-full">
      {/* Industrial Texture / Grain Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay grayscale invert">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id={`noiseFilter-${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#noiseFilter-${id})`} />
        </svg>
      </div>

      <div className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
        {children}
      </div>

      {/* Decorative "Human" Detail Elements */}
      <div className={`absolute top-6 right-8 font-mono text-[9px] tracking-[0.4em] uppercase opacity-20 pointer-events-none select-none
        ${isDarkMode ? "text-accent-primary" : "text-slate-400"}`}>
        SYS-OP / {id?.toUpperCase()}-SEC
      </div>
      
      <div className={`absolute bottom-6 left-10 w-8 h-[1px] opacity-30
        ${isDarkMode ? "bg-accent-primary" : "bg-slate-400"}`} 
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 30 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      viewport={{ once: true }}
      className={`${className} relative group h-full transition-transform duration-500`}
    >
      {isDarkMode ? (
        // DARK MODE: Restore to simple original card using BorderGlow
        <BorderGlow
          borderRadius={40}
          glowColor="180 80 80"
          backgroundColor="#13141a"
          glowRadius={60}
          glowIntensity={0.6}
          edgeSensitivity={40}
          className="h-full cursor-default"
        >
          <CardContent />
        </BorderGlow>
      ) : (
        // LIGHT MODE: Gradient border appears strictly BEHIND on hover
        <div className="relative h-full w-full rounded-[40px] overflow-visible">
          {/* Conic Gradient Border/Shape strictly BEHIND card (revealed on hover) */}
          <div 
            className="absolute -inset-[3px] rounded-[43px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 pointer-events-none"
            style={{
              background: conicGradient,
            }}
          />

          {/* Glowing Shadow BEHIND card */}
          <div className="absolute inset-2 -z-20 blur-2xl opacity-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
            style={{ background: conicGradient, borderRadius: '40px' }}
          />

          {/* Clean Light Interior */}
          <div className="h-full w-full rounded-[40px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            <CardContent />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const SkillWord = ({ word, isDarkMode }: { word: string, isDarkMode: boolean }) => {
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const colors = isDarkMode 
    ? ["#4ecdc4", "#3b82f6", "#0ea5e9", "#4ecdc4"]
    : LIGHT_PALETTE; 

  const handleMouseEnter = () => {
    setRotationGlobal(); // Trigger a slight rotation nudge maybe
    setHoverColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const setRotationGlobal = () => {};

  return (
    <span 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHoverColor(null)}
      className={`font-bold transition-all duration-300 hover:scale-110 inline-block cursor-crosshair
        ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
      style={{ color: hoverColor || undefined }}
    >
      {word}
    </span>
  );
};

const HighlightedText = ({ category, tech, isDarkMode }: any) => (
  <div className="max-w-md select-none">
    <span className={`text-[10px] font-mono font-bold uppercase tracking-[0.4em] mb-4 block
      ${isDarkMode ? "text-accent-primary/80" : "text-slate-500/80"}`}>
      {category}
    </span>
    <p className={`text-base sm:text-2xl font-display tracking-tighter leading-tight transition-colors duration-300
      ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}>
      {tech.split(', ').map((word: string, i: number, arr: any) => (
        <React.Fragment key={word}>
          <SkillWord word={word} isDarkMode={isDarkMode} />
          {i < arr.length - 1 && <span className="opacity-20 mx-2 font-light">/</span>}
        </React.Fragment>
      ))}
    </p>
  </div>
);

export const Skills: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const rotRef = useRef({ x: 0.3, y: 0 });
  const velRef = useRef({ x: 0.0012, y: 0.003 });
  const baseVelRef = useRef({ x: 0.0012, y: 0.003 });
  const dragRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const isDarkRef = useRef(isDarkMode);
  const trianglesRef = useRef<Triangle[]>([]);

  const hoveredRef = useRef<number | null>(null);
  const hoverStates = useRef<number[]>(new Array(SKILLS.length).fill(0));

  useEffect(() => { isDarkRef.current = isDarkMode; }, [isDarkMode]);
  useEffect(() => { trianglesRef.current = buildGeodesicTriangles(2, GLOBE_RADIUS); }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dark = isDarkRef.current;
    const rx = rotRef.current.x, ry = rotRef.current.y;
    ctx.clearRect(0, 0, W, H);

    const triangles = trianglesRef.current;
    for (const [va, vb, vc] of triangles) {
      const [rax, ray, raz] = rotatePoint(va[0], va[1], va[2], rx, ry);
      const [rbx, rby, rbz] = rotatePoint(vb[0], vb[1], vb[2], rx, ry);
      const [rcx, rcy, rcz] = rotatePoint(vc[0], vc[1], vc[2], rx, ry);
      const avgZ = (raz + rbz + rcz) / 3;

      const abx = rbx - rax, aby = rby - ray, abz = rbz - raz;
      const acx = rcx - rax, acy = rcy - ray, acz = rcz - raz;
      const nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
      const nLen = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      const lightX = 0.4, lightY = -0.6, lightZ = 1.0;
      const lLen = Math.sqrt(lightX ** 2 + lightY ** 2 + lightZ ** 2);
      const dot = (nx / nLen) * (lightX / lLen) + (ny / nLen) * (lightY / lLen) + (nz / nLen) * (lightZ / lLen);

      const depth = (pd_scale(raz, rbz, rcz) + GLOBE_RADIUS) / (GLOBE_RADIUS * 2);
      if (avgZ < -GLOBE_RADIUS * 0.75) continue;

      const pa = project3D(rax, ray, raz, cx, cy, GLOBE_FOV);
      const pb = project3D(rbx, rby, rbz, cx, cy, GLOBE_FOV);
      const pc = project3D(rcx, rcy, rcz, cx, cy, GLOBE_FOV);

      const fBr = Math.max(0, dot);
      const fillAlpha = dark ? 0.03 + fBr * 0.07 + depth * 0.04 : 0.02 + fBr * 0.06 + depth * 0.03;

      ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.lineTo(pc.sx, pc.sy); ctx.closePath();
      ctx.fillStyle = dark ? `rgba(78, 205, 196, ${fillAlpha.toFixed(3)})` : `rgba(59, 130, 246, ${fillAlpha.toFixed(3)})`;
      ctx.fill();

      const egAl = dark ? 0.08 + depth * 0.45 + fBr * 0.2 : 0.06 + depth * 0.4 + fBr * 0.18;
      ctx.strokeStyle = dark ? `rgba(78, 205, 196, ${Math.min(egAl, 0.8).toFixed(3)})` : `rgba(59, 130, 246, ${Math.min(egAl, 0.75).toFixed(3)})`;
      ctx.lineWidth = 0.7; ctx.stroke();
    }

    function pd_scale(za: number, zb: number, zc: number) { return (za + zb + zc) / 3; }

    const STEPS = 80;
    ctx.beginPath();
    let firstEq = true;
    for (let s = 0; s <= STEPS; s++) {
      const theta = (2 * Math.PI * s) / STEPS;
      const [rx3, ry3, rz3] = rotatePoint(GLOBE_RADIUS * Math.cos(theta), 0, GLOBE_RADIUS * Math.sin(theta), rx, ry);
      const { sx, sy } = project3D(rx3, ry3, rz3, cx, cy, GLOBE_FOV);
      firstEq ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); firstEq = false;
    }
    ctx.closePath();
    ctx.strokeStyle = dark ? "rgba(78, 205, 196, 0.15)" : "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 1; ctx.stroke();

    const skillPoints = getFibonacciSpherePoints(SKILLS.length, SKILL_RADIUS);
    const tags = overlay.querySelectorAll<HTMLDivElement>(".skill-tag");
    const projected = skillPoints.map((p) => {
      const [rx3, ry3, rz3] = rotatePoint(p.x, p.y, p.z, rx, ry);
      return project3D(rx3, ry3, rz3, cx, cy, GLOBE_FOV);
    });

    tags.forEach((tag, i) => {
      const pd = projected[i]; if (!pd) return;
      const target = (hoveredRef.current === i) ? 1 : 0;
      hoverStates.current[i] += (target - hoverStates.current[i]) * 0.15;
      const h = hoverStates.current[i];

      const frontDepth = Math.max(0, (pd.scale - (GLOBE_FOV / (GLOBE_FOV + SKILL_RADIUS))) / (1 - (GLOBE_FOV / (GLOBE_FOV + SKILL_RADIUS))));
      const visibleThreshold = 0.45;
      const adjustedDepth = Math.max(0, (frontDepth - visibleThreshold) / (1 - visibleThreshold));

      const depth = (pd.scale * (GLOBE_FOV + SKILL_RADIUS) - GLOBE_FOV + SKILL_RADIUS) / (SKILL_RADIUS * 2);
      const baseScale = 0.5 + depth * 0.5;
      const currentScale = baseScale * (1 + h * 0.3);
      const currentOpacity = (adjustedDepth ** 1.8) * (1 - h) + h;

      tag.style.left = `${pd.sx}px`; tag.style.top = `${pd.sy}px`;
      tag.style.transform = `translate(-50%, -50%) scale(${currentScale.toFixed(3)}) rotate(${(h * -5).toFixed(1)}deg)`;
      tag.style.opacity = currentOpacity.toFixed(3);
      tag.style.zIndex = (Math.round((pd.scale - 1) * 1000 + 1000) + (h > 0.1 ? 5000 : 0)).toString();
      tag.style.pointerEvents = adjustedDepth > 0.1 ? "auto" : "none";
      tag.style.visibility = adjustedDepth > 0.01 ? "visible" : "hidden";

      const icon = tag.querySelector("i");
      const span = tag.querySelector("span");
      if (icon) {
        icon.style.filter = h > 0.01 ? `drop-shadow(0 0 ${h * 20}px ${dark ? "rgba(78,205,196,0.8)" : "rgba(59,130,246,0.6)"})` : "none";
        icon.style.filter += h > 0.01 ? ` brightness(${1 + h * 0.2})` : "";
      }
      if (span) {
        span.style.opacity = (0.4 + h * 0.6).toFixed(3);
        span.style.transform = `translateY(${(1 - h) * 4}px) scale(${1 + h * 0.1})`;
        span.style.color = h > 0.5 ? (dark ? "#4ecdc4" : "#3b82f6") : "";
      }
    });

    if (!dragRef.current) {
      // momentum logic
      const targetVelX = hoveredRef.current !== null ? baseVelRef.current.x * 0.05 : baseVelRef.current.x;
      const targetVelY = hoveredRef.current !== null ? baseVelRef.current.y * 0.05 : baseVelRef.current.y;

      // friction
      velRef.current.x *= 0.95;
      velRef.current.y *= 0.95;

      // blend with target base rotation
      velRef.current.x += (targetVelX - velRef.current.x) * 0.05;
      velRef.current.y += (targetVelY - velRef.current.y) * 0.05;

      rotRef.current.x += velRef.current.x;
      rotRef.current.y += velRef.current.y;
    }
    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  const onMouseDown = (e: React.MouseEvent) => { dragRef.current = true; lastPosRef.current = { x: e.clientX, y: e.clientY }; };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - lastPosRef.current.x; const dy = e.clientY - lastPosRef.current.y;
    // apply force immediately
    velRef.current.y = dx * 0.008;
    velRef.current.x = -dy * 0.008; // X rotation uses Y delta
    rotRef.current.y += dx * 0.008;
    rotRef.current.x += dy * 0.008;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <section id="skills" className="py-32 px-6 md:px-10 max-w-6xl mx-auto min-h-screen flex flex-col items-center overflow-visible">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      <FadeSection direction="down" delay={0.2} className="w-full text-left">
        <div className="section-header mb-16">
          <span className={`text-4xl font-mono font-bold tracking-tighter ${isDarkMode ? "text-accent-primary" : "text-blue-500"}`}>
            / Skills
          </span>
        </div>
      </FadeSection>

      {/* 3D Globe Section */}
      <div className="w-full flex justify-center mb-24 overflow-visible">
        <div className="relative cursor-grab active:cursor-grabbing select-none" style={{ width: GLOBE_SIZE, height: GLOBE_SIZE }} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={() => dragRef.current = false} onMouseLeave={() => dragRef.current = false} onTouchStart={(e) => { dragRef.current = true; lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }} onTouchMove={(e) => { if (dragRef.current) { const dx = e.touches[0].clientX - lastPosRef.current.x; const dy = e.touches[0].clientY - lastPosRef.current.y; velRef.current.y = dx * 0.008; velRef.current.x = -dy * 0.008; rotRef.current.y += dx * 0.008; rotRef.current.x += dy * 0.008; lastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; } }} onTouchEnd={() => dragRef.current = false}>
          <canvas ref={canvasRef} width={GLOBE_SIZE} height={GLOBE_SIZE} className="absolute inset-0" style={{ pointerEvents: "none", opacity: isDarkMode ? 0.7 : 0.9 }} />
          <div ref={overlayRef} className="absolute inset-0" style={{ pointerEvents: "none" }}>
            {SKILLS.map((skill, i) => (
              <div key={i} className="skill-tag absolute flex flex-col items-center gap-0.5"
                style={{ pointerEvents: "auto", transition: "none" }}
                onMouseEnter={() => { hoveredRef.current = i; }}
                onMouseLeave={() => { hoveredRef.current = null; }}>
                <i className={`${skill.icon} text-3xl`} />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase mt-1 pointer-events-none">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[220px] mb-20 overflow-visible">
        <BentoCard id="stack-backend" className="md:col-span-8" isDarkMode={isDarkMode} delay={0.1}>
          <HighlightedText 
            category="Infrastructure & Backend" 
            tech="Node.js, Express, Python, fastify, NestJS" 
            isDarkMode={isDarkMode} 
          />
        </BentoCard>

        <BentoCard id="stack-ml" className="md:col-span-4" isDarkMode={isDarkMode} delay={0.2}>
          <HighlightedText 
            category="Machine Learning" 
            tech="GNNs, XGBoost, PyTorch, TensorFlow, LangChain" 
            isDarkMode={isDarkMode} 
          />
        </BentoCard>

        <BentoCard id="stack-arch" className="md:col-span-4" isDarkMode={isDarkMode} delay={0.1}>
          <HighlightedText 
            category="Architecture" 
            tech="AWS, Docker, Linux, Git, Terraform" 
            isDarkMode={isDarkMode} 
          />
        </BentoCard>

        <BentoCard id="stack-data" className="md:col-span-8" isDarkMode={isDarkMode} delay={0.2}>
          <HighlightedText 
            category="Data Persistence" 
            tech="PostgreSQL, MongoDB, Redis, MySQL, DynamoDB" 
            isDarkMode={isDarkMode} 
          />
        </BentoCard>

        <BentoCard id="stack-fe" className="md:col-span-12" isDarkMode={isDarkMode} delay={0.3}>
          <HighlightedText 
            category="Interactive Frontend" 
            tech="React, TypeScript, Three.js, Framer Motion, Tailwind, Next.js" 
            isDarkMode={isDarkMode} 
          />
        </BentoCard>
      </div>
    </section>
  );
};
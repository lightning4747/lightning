import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  length: number;
  baseAlpha: number;
  currentAlpha: number;
  delay: number;
  randomColor: string;
}

const LIGHT_PALETTE = [
  '#E8645A', // red
  '#F5C842', // yellow
  '#5B9CF6', // blue
  '#5DBE89', // green
  '#4ECDC4', // teal
];

export const ParticlePortrait: React.FC = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const linesRef = useRef<Particle[]>([]);
  const imageLoadedRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);
  const [size, setSize] = useState(400);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;

      if (width <= 480) {
        setSize(Math.min(220, width - 40));
      } else if (width <= 768) {
        setSize(Math.min(280, width - 60));
      } else {
        setSize(400);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const canvasWidth = size;
    const canvasHeight = size;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let animationId: number;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = "/assets/no-background.jpeg"; 

    img.onload = () => {
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offscreen.width = canvasWidth;
      offscreen.height = canvasHeight;

      const scale = 0.8;
      const imgAspect = img.width / img.height;

      let drawHeight = canvasHeight * scale;
      let drawWidth = drawHeight * imgAspect;

      if (drawWidth > canvasWidth * scale) {
        drawWidth = canvasWidth * scale;
        drawHeight = drawWidth / imgAspect;
      }

      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;

      offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      const imageData = offCtx.getImageData(0, 0, canvasWidth, canvasHeight);
      const pixels = imageData.data;

      const lines: Particle[] = [];
      const rowGap = size <= 280 ? 5 : 6;

      for (let y = 0; y < canvasHeight; y += rowGap) {
        let x = 0;
        while (x < canvasWidth) {
          const i = (y * canvasWidth + x) * 4;
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          
          // Calculate brightness for JPEG background filtering
          const brightness = (r + g + b) / (3 * 255);

          // Skip dark background pixels (JPEG has no alpha)
          if (brightness > 0.05) {
            const lineLength = Math.floor(
              3 + brightness * (size <= 280 ? 8 : 15)
            );

            const scatterX = (Math.random() - 0.5) * 400;
            const scatterY = (Math.random() - 0.5) * 400;

            lines.push({
              x: x + scatterX,
              y: y + scatterY,
              targetX: x,
              targetY: y,
              vx: 0,
              vy: 0,
              length: lineLength,
              baseAlpha: 0.4 + brightness * 0.6,
              currentAlpha: 0,
              delay: Math.random() * 0.4,
              randomColor: LIGHT_PALETTE[Math.floor(Math.random() * LIGHT_PALETTE.length)]
            });

            x += lineLength + 2;
          } else {
            x += 4;
          }
        }
      }

      linesRef.current = lines;
      imageLoadedRef.current = true;
      startTimeRef.current = performance.now();
    };

    const draw = () => {
      animationId = requestAnimationFrame(draw);

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (!imageLoadedRef.current || startTimeRef.current === null) return;

      const lines = linesRef.current;
      const mouse = mouseRef.current;
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      lines.forEach((p) => {
        const particleTime = elapsed - p.delay;

        if (particleTime < 0) return;

        const fadeProgress = Math.min(particleTime / 1.5, 1);
        const easedFade = 1 - Math.pow(1 - fadeProgress, 2);
        p.currentAlpha = p.baseAlpha * easedFade;

        const moveProgress = Math.min(particleTime / 2.5, 1);
        const easedMove = 1 - Math.pow(1 - moveProgress, 3);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 60;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 2;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;

        const pullStrength = 0.01 + easedMove * 0.07;
        p.vx += dx * pullStrength;
        p.vy += dy * pullStrength;

        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Condition: Multi-color for Light, Solid #F5F5F5 for Dark
        ctx.strokeStyle = theme === 'dark' ? '#F5F5F5' : p.randomColor;
        
        // Intensity scaling: brighter pixels and proximity increase alpha/strength
        let intensity = p.currentAlpha;
        if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 80;
            
            if (dist < radius) {
                // Increase intensity/glow when hovering
                intensity = Math.min(1.0, intensity * (1.2 + (1 - dist / radius) * 0.5));
            }
        }

        ctx.globalAlpha = intensity;
        
        // Slightly thicker strokes for stronger visual presence
        ctx.lineWidth = size <= 280 ? 2 : 2.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchmove", handleTouchMove);
    canvas.addEventListener("touchend", handleLeave);

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleLeave);
    };
  }, [size, theme]);

  return (
    <div className="relative flex items-center justify-center p-4">
        {/* Subtle glow behind the portrait */}
        <div 
          className="absolute w-[80%] h-[80%] bg-accent-primary/20 blur-[100px] rounded-full pointer-events-none" 
        />
        <canvas
          ref={canvasRef}
          className="relative z-10"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            cursor: "crosshair",
          }}
        />
    </div>
  );
};

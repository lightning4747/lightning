import { useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

export const BlueprintGrid = () => {
  const { theme } = useTheme();
  const gridRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (theme === 'dark') return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;

      // Extremely subtle parallax for the grid to create depth
      const factor = 15; 
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${x * factor}px, ${y * factor}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [theme]);

  if (theme === 'dark') return null;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden origin-center scale-120">
      <div 
        ref={gridRef}
        className="absolute inset-[-200px] opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #1a1a1a 1px, transparent 1px),
            linear-gradient(to bottom, #1a1a1a 1px, transparent 1px),
            linear-gradient(to right, #1a1a1a 1px, transparent 1px),
            linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
          willChange: 'transform'
        }}
      />
      {/* Blueprint measurement marks or crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08]">
        <div className="w-[85%] h-[1px] bg-text-primary" />
        <div className="h-[85%] w-[1px] bg-text-primary" />
      </div>
    </div>
  );
};

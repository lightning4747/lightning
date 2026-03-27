import { useRef, useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';

interface FloatingObject {
  id: string;
  src: string;
  isImage: boolean; // to handle sizing/invert logic for different asset types
  depth: number;
  href: string;
  position: { top: string; left: string };
  rotation: number;
  size: number;
}

const objects: FloatingObject[] = [
  { 
    id: 'katana',   
    src: '/assets/sword-removebg-preview.png', 
    isImage: true, 
    depth: 0.6, 
    href: '/games', 
    position: { top: '15%', left: '15%' }, 
    rotation: -18, 
    size: 210 
  },
  { 
    id: 'book',     
    src: '/assets/Book_in_heraldry_svg_element.svg', 
    isImage: false, 
    depth: 0.35, 
    href: '/books', 
    position: { top: '72%', left: '72%' }, 
    rotation: 12, 
    size: 65 
  },
  { 
    id: 'leetcode', 
    src: '/assets/leetcode.svg', 
    isImage: false, 
    depth: 0.5, 
    href: 'https://leetcode.com/u/lightning47/', 
    position: { top: '18%', left: '78%' }, 
    rotation: 5, 
    size: 50 
  },
  { 
    id: 'github',   
    src: '/assets/github-142-svgrepo-com.svg', 
    isImage: false, 
    depth: 0.45, 
    href: 'https://github.com/lightning4747', 
    position: { top: '70%', left: '18%' }, 
    rotation: -10, 
    size: 48 
  },
  { 
    id: 'email',    
    src: '/assets/Gmail_icon_(2020).svg', 
    isImage: true, 
    depth: 0.25, 
    href: 'mailto:vignesh112847@gmail.com', 
    position: { top: '48%', left: '85%' }, 
    rotation: 6, 
    size: 42 
  },
];

export const ParallaxField = () => {
  const { theme } = useTheme();
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const innerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (theme === 'dark') return;

    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) return; // already scheduled
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth) - 0.5;
        const y = (e.clientY / innerHeight) - 0.5;

        const factor = 120;
        const activationRadius = 400;

        objects.forEach((obj) => {
          const ref = itemRefs.current[obj.id];
          const inner = innerRefs.current[obj.id];
          
          if (ref && inner) {
            const moveX = x * obj.depth * factor;
            const moveY = y * obj.depth * factor;
            ref.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${obj.rotation}deg)`;

            const objX = innerWidth * (parseFloat(obj.position.left) / 100);
            const objY = innerHeight * (parseFloat(obj.position.top) / 100);
            
            const dx = e.clientX - objX - moveX;
            const dy = e.clientY - objY - moveY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const influence = Math.max(0, 1 - (distance / activationRadius));
            const easedInfluence = influence * influence;

            const opacity = 0.35 + 0.65 * easedInfluence;
            const scale = 1.0 + 0.25 * easedInfluence;
            const grayscale = 100 - (100 * easedInfluence);

            inner.style.opacity = opacity.toString();
            inner.style.transform = `scale(${scale})`;
            inner.style.filter = `grayscale(${grayscale}%) drop-shadow(0 0 20px rgba(0,0,0,${0.1 + (0.1 * easedInfluence)}))`;
          }
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, [theme]);

  if (theme === 'dark') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {objects.map((obj) => (
        <div
          key={obj.id}
          ref={(el) => { itemRefs.current[obj.id] = el; }}
          className="absolute pointer-events-auto"
          style={{ 
            top: obj.position.top, 
            left: obj.position.left,
            willChange: 'transform'
          }}
        >
          <a
            href={obj.href}
            target={obj.href.startsWith('http') ? '_blank' : undefined}
            rel={obj.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="block p-4"
          >
            <div 
              ref={(el) => { innerRefs.current[obj.id] = el; }}
              className="transition-all duration-300 ease-out flex items-center justify-center cursor-pointer"
              style={{ 
                width: obj.size,
                height: 'auto',
                opacity: 0.35,
                filter: 'grayscale(100%)',
                willChange: 'opacity, transform, filter'
              }}
            >
              <img 
                src={obj.src} 
                alt={obj.id} 
                className="w-full h-auto object-contain"
                draggable={false}
              />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
};

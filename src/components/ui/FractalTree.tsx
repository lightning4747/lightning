import React from "react";
import { ReactP5Wrapper } from "react-p5-wrapper";
import type { Sketch } from "react-p5-wrapper";
import { useTheme } from "../../hooks/useTheme";

const sketch: Sketch = (p5) => {
  let angle: number;
  let isDark = false;

  p5.updateWithProps = (props) => {
    isDark = props.theme === "dark";
  };

  p5.setup = () => {
    p5.createCanvas(400, 400, p5.P2D);
    angle = p5.PI / 4;
  };

  p5.draw = () => {
    p5.clear();
    p5.translate(200, p5.height - 20);
    
    angle = p5.map(p5.sin(p5.frameCount * 0.015), -1, 1, p5.PI / 2.5, p5.PI / 12);
    
    // Dynamic stroke color: Blue for Light, Neon Teal for Dark
    if (isDark) {
      p5.stroke(78, 205, 196, 220); // Neon Teal (#4ECDC4)
    } else {
      p5.stroke(59, 130, 246, 200); // Blue-500
    }
    
    p5.strokeWeight(1.5);
    branch(110);
  };

  function branch(len: number) {
    p5.line(0, 0, 0, -len);
    p5.translate(0, -len);
    
    if (len > 4) {
      p5.push();
      p5.rotate(angle);
      p5.strokeWeight(p5.max(0.5, len * 0.02));
      branch(len * 0.67);
      p5.pop();
      
      p5.push();
      p5.rotate(-angle);
      p5.strokeWeight(p5.max(0.5, len * 0.02));
      branch(len * 0.67);
      p5.pop();
    }
  }
};

export const FractalTree: React.FC = () => {
  const { theme } = useTheme();
  return (
    <div id="fractal-tree" className="flex items-center justify-center scale-90 md:scale-100">
      <ReactP5Wrapper sketch={sketch} theme={theme} />
    </div>
  );
};

export default FractalTree;

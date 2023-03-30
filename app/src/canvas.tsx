import { useEffect, useRef } from "react";
import { Simulation } from 'simulation-wasm';
import { SimulationView } from "./simulation";

const sim = new Simulation(Simulation.default_config());

export const Canvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    console.log('useEffect');
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const simV = new SimulationView(sim, canvas);
    console.log('created simV', sim);
    (window as any).sim = simV;
    let frameCount = 0;
    let animationFrameId: number;
    const render = () => {
      frameCount++;
      simV.draw();
      animationFrameId = window.requestAnimationFrame(render);
    };
    simV.setup();
    render();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas ref={ref} />
  );
}
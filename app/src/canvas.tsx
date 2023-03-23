import { useEffect, useRef, useState } from "react";
import { Simulation } from 'simulation-wasm';
import { SimulationView } from "./simulation";

export const Canvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [sim] = useState(new Simulation(Simulation.default_config()));

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    // Put the simulation on the window so we can debug it
    (window as any).sim = new SimulationView(sim, ref.current)
  })

  return (
    <canvas ref={ref} />
  );
}
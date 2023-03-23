import { Simulation } from "simulation-wasm";
import { Viewport } from "../viewport";
import { setup } from "./setup";
import { draw } from "./draw";

export class SimulationView {
  #sim: Simulation;
  #canvas: HTMLCanvasElement;
  #viewport: Viewport;
  #active: boolean;
  #animalColors: Map<string, string>;

  constructor(sim: Simulation, canvas: HTMLCanvasElement) {
    this.#sim = sim;
    this.#canvas = canvas;
    this.#active = true;
    this.#viewport = new Viewport(canvas);
    this.#animalColors = new Map<string, string>();

    const config = sim.config();

    if (this.#animalColors.size === 0) {
      for (let i = 0; i < config.world_animals; i += 1) {
        for (let j = 0; j < config.eye_cells; j += 1) {
          const r = Math.floor(Math.random() * 255);
          const g = Math.floor(Math.random() * 255);
          const b = Math.floor(Math.random() * 255);
          this.#animalColors.set(`${i}:${j}`, `rgba(${r}, ${g}, ${b}`);
        }
      }
    }

    setup(this);
    draw(this);
  }

  get active() {
    return this.#active;
  }

  get viewport() {
    return this.#viewport;
  }

  get animalColors() {
    return this.#animalColors;
  }

  togglePause() {
    this.#active = !this.#active;
    return this.#active;
  }

  step() {
    return this.#sim.step();
  }

  world() {
    return this.#sim.world();
  }

  config() {
    return this.#sim.config();
  }

  age() {
    return this.#sim.age();
  }

  generation() {
    return this.#sim.generation();
  }

  train() {
    return this.#sim.train();
  }
}

import { Simulation } from "simulation-wasm";
import { Viewport } from "../viewport";
import { setup } from "./setup";
import { draw } from "./draw";

export class SimulationView {
  #sim: Simulation;
  #canvas: HTMLCanvasElement;
  #viewport: Viewport;
  #active: boolean;

  #stepByFrame: number;

  constructor(sim: Simulation, canvas: HTMLCanvasElement) {
    this.#sim = sim;
    this.#canvas = canvas;
    this.#active = true;
    this.#viewport = new Viewport(canvas);
    this.#stepByFrame = 1;
  }

  setup() {
    setup(this);
  }

  draw() {
    draw(this);
  }

  get active() {
    return this.#active;
  }

  get viewport() {
    return this.#viewport;
  }

  get stepByFrame() {
    return this.#stepByFrame;
  }

  set stepByFrame(value: number) {
    this.#stepByFrame = value;
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

import { SimulationView } from ".";

export const setup = (sim: SimulationView) => {
  sim.viewport.onmousemove((e) => {
    // important: correct mouse position:
    const rect = sim.viewport.getBoundingClientRect();
    const x = (e.clientX - rect.left) / sim.viewport.size();
    const y = (e.clientY - rect.top) / sim.viewport.size();

    const world = sim.world();

    for (const animal of world.animals) {
      if (
        Math.sqrt(Math.pow(animal.x - x, 2) + Math.pow(animal.y - y, 2)) < 0.005
      ) {
        console.log(
          `Animal: (${animal.x.toFixed(4)},${animal.y.toFixed(
            4
          )}) r: ${animal.rotation.toFixed(4)} (${(
            (animal.rotation * 180) /
            Math.PI
          ).toFixed(2)}˚) s: ${animal.speed.toFixed(4)} vision: ${animal.vision}`
        );
        break;
      }
    }
  });
};

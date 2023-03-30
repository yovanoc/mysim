import { SimulationView } from ".";

export const draw = (sim: SimulationView) => {
  // console.log(sim.active)
  if (sim.active) {
    for (let i = 0; i < sim.stepByFrame; i += 1) {
      const stats = sim.step();
      if (stats) {
        console.log(stats);
      }
    }
  }

  const config = sim.config();
  const world = sim.world();

  const v = sim.viewport;

  v.clear();

  // console.log(sim.age(), sim.generation())

  for (const food of world.foods) {
    v.drawCircle(
      food.x,
      food.y,
      config.food_size / 2.0,
      "rgb(0, 221, 255)"
    );
  }

  for (let animIdx = 0; animIdx < config.world_animals; animIdx += 1) {
    const animal = world.animals[animIdx];
    v.drawTriangle(
      animal.x,
      animal.y,
      config.food_size,
      animal.rotation,
      "rgb(255, 255, 255)"
    );

    // draw line for the orientation
    const dist = config.eye_fov_range;
    v.drawLine(
      animal.x,
      animal.y,
      animal.x - Math.sin(animal.rotation) * dist,
      animal.y + Math.cos(animal.rotation) * dist,
      "rgb(150, 150, 150, 0.08)"
    );
    const startAngle = animal.rotation - config.eye_fov_angle / 2 + Math.PI / 2;
    // v.drawFovCone(
    //   {
    //     x: animal.x,
    //     y: animal.y,
    //     startAngle,
    //     endAngle: startAngle + config.eye_fov_angle,
    //     range: config.eye_fov_range,
    //     fillStyle: "rgba(0, 221, 255, 0.04)",
    //     strokeStyle: "rgba(0, 221, 255, 0.2)"
    //   }
    // );

    const anglePerCell = config.eye_fov_angle / config.eye_cells;

    for (let cellId = 0; cellId < config.eye_cells; cellId += 1) {
      const angleFrom =
        startAngle
        + cellId * anglePerCell;

      const angleTo = angleFrom + anglePerCell;
      const energy = animal.vision[cellId];

      v.drawFovCone(
        {
          x: animal.x,
          y: animal.y,
          startAngle: angleFrom,
          endAngle: angleTo,
          range: config.eye_fov_range,
          fillStyle: energy === 0
            ? "rgba(0, 0, 0, 0.08)"
            : `rgba(0, 221, 255, ${energy * 0.4})`,
          strokeStyle: "rgba(0, 221, 255, 0.02)"
        }
      );

      v.drawArc(
        animal.x,
        animal.y,
        config.food_size * 2.5,
        angleFrom,
        angleTo,
        `rgba(0, 221, 255, ${energy})`
      );
    }
  }
};

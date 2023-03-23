import { SimulationView } from ".";

export const draw = (sim: SimulationView) => {
  if (sim.active) {
    const stats = sim.step();

    if (stats) {
      console.log(stats);
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
      animal.x + Math.cos(animal.rotation) * dist,
      animal.y + Math.sin(animal.rotation) * dist,
      "rgb(150, 150, 150)"
    );
    v.drawFovCone(
      animal.x,
      animal.y,
      config.eye_fov_angle,
      animal.rotation,
      config.eye_fov_range,
      "rgba(0, 221, 255, 0.05)"
    );

    const anglePerCell = config.eye_fov_angle / config.eye_cells;

    for (let cellId = 0; cellId < config.eye_cells; cellId += 1) {
      const angleFrom =
        animal.rotation
        - config.eye_fov_angle / 2.0
        + cellId * anglePerCell
        // + 0;
        // + Math.PI / 2.0;

      const angleTo = angleFrom + anglePerCell;
      const energy = animal.vision[cellId];

      for (let i = angleFrom; i < angleTo; i += 0.01) {
        v.drawLine(
          animal.x,
          animal.y,
          animal.x + Math.cos(i) * config.eye_fov_range,
          animal.y + Math.sin(i) * config.eye_fov_range,
          energy === 0
            ? "rgba(0, 0, 0, 0.09)"
            : `${sim.animalColors.get(`${animIdx}:${cellId}`)}, ${energy * 0.5})`
        );
      }
      // v.drawFovCone(
      //   animal.x,
      //   animal.y,
      //   config.eye_fov_angle / config.eye_cells,
      //   angleFrom,
      //   config.eye_fov_range,
      //   energy === 0
      //     ? "rgba(0, 0, 0, 0.08)"
      //     : `${sim.animalColors.get(`${animIdx}:${cellId}`)}, ${energy})`
      // );

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

  // requestAnimationFrame(() => draw(sim));
};

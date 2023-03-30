use nannou::prelude::*;
use rand::rngs::ThreadRng;
use rand::thread_rng;
use simulation::{Animal, Food, Simulation};

trait Render {
    fn render(&self, draw: &Draw, config: &simulation::Config);
}

impl Render for Food {
    fn render(&self, draw: &Draw, config: &simulation::Config) {
        let pos = self.position();
        draw.ellipse()
            .x_y(pos.x, pos.y)
            .radius(config.food_size / 2.0)
            .rgb(0.0, 221.0, 255.0);
    }
}

impl Render for Animal {
    fn render(&self, draw: &Draw, config: &simulation::Config) {
        let pos = self.position();
        let rot = self.rotation().angle();
        let start_point = pt2(pos.x, pos.y);
        let end_point = pt2(
            pos.x - rot.sin() * config.eye_fov_range,
            pos.y + rot.cos() * config.eye_fov_range,
        );

        // direction line
        draw.line()
            .start(start_point)
            .end(end_point)
            .weight(0.00008)
            .rgba(90.0, 80.0, 70.0, 0.0001);
        // global shape
        let point1 = pt2(
            pos.x - rot.sin() * config.food_size * 1.5,
            pos.y + rot.cos() * config.food_size * 1.5,
        );
        let point2 = pt2(
            pos.x - (rot + 2.0 / 3.0 * PI).sin() * config.food_size,
            pos.y + (rot + 2.0 / 3.0 * PI).cos() * config.food_size,
        );
        let point3 = pt2(
            pos.x - (rot - 2.0 / 3.0 * PI).sin() * config.food_size,
            pos.y + (rot - 2.0 / 3.0 * PI).cos() * config.food_size,
        );
        draw.tri().points(point1, point2, point3).color(WHITE);

        // render eyes
        let angle_per_cell = config.eye_fov_angle / config.eye_cells as f32;
        let vision = self.vision();

        for cell_id in 0..config.eye_cells {
            let angle_from =
                rot - config.eye_fov_angle / 2.0 + cell_id as f32 * angle_per_cell + PI / 2.0;
            let angle_to = angle_from + angle_per_cell;
            let energy = vision[cell_id];
            // for (let i = angleFrom; i < angleTo; i += 0.01) {
            //   v.drawLine(
            //     animal.x,
            //     animal.y,
            //     animal.x + Math.cos(i) * config.eye_fov_range,
            //     animal.y + Math.sin(i) * config.eye_fov_range,
            //     energy === 0
            //       ? "rgba(0, 0, 0, 0.09)"
            //       : `${sim.animalColors.get(`${animIdx}:${cellId}`)}, ${energy * 0.5})`
            //   );
            // }
            let mut i = angle_from;
            while i < angle_to {
                draw.line()
                    .start(start_point)
                    .end(pt2(
                        pos.x + i.cos() * config.eye_fov_range,
                        pos.y + i.sin() * config.eye_fov_range,
                    ))
                    .weight(0.00008)
                    .rgba(0.0, 0.0, 0.0, energy * 5.0);
                i += 0.01;
            }
        }
    }
}

impl Render for Simulation {
    fn render(&self, draw: &Draw, config: &simulation::Config) {
        let world = self.world();
        for food in world.foods() {
            food.render(draw, config);
        }
        for animal in world.animals() {
            animal.render(draw, config);
        }
    }
}

fn main() {
    nannou::app(model).update(update).view(view).run();
}

struct Model {
    active: bool,
    simulation: Simulation,
    rng: ThreadRng,
}

fn model(app: &App) -> Model {
    app.new_window()
        .size(950, 950)
        .title("MySim!")
        .key_pressed(key_pressed)
        .build()
        .unwrap();
    let mut rng = thread_rng();
    Model {
        active: true,
        rng: rng.clone(),
        simulation: Simulation::random(Default::default(), &mut rng),
    }
}

fn key_pressed(_app: &App, model: &mut Model, key: Key) {
    match key {
        Key::P => {
            model.active = !model.active;
        }
        Key::Space => {
            let stats = model.simulation.train(&mut model.rng);
            println!("{:?}", stats)
        }
        Key::T => {
            for _ in 0..50 {
                let stats = model.simulation.train(&mut model.rng);
                println!("{:?}", stats)
            }
        }
        _ => {}
    }
}

fn update(_app: &App, model: &mut Model, _update: Update) {
    if !model.active {
        return;
    }
    if let Some(stats) = model.simulation.step(&mut model.rng) {
        println!("{:?}", stats)
    }
}

fn view(app: &App, model: &Model, frame: Frame) {
    let mut draw = app.draw();
    let (width, height) = frame.rect().w_h();
    draw = draw
        .x_y(-width * 0.5, -height * 0.5)
        .scale_x(width)
        .scale_y(height);

    let config = model.simulation.config();

    draw.background().rgb(0.5, 0.5, 0.5);

    let w = app.window_rect();
    app.main_window().set_title(&format!("MySim! {}", app.fps()));
    // draw.text(&format!("FPS: {}", app.fps()))
    //     .color(RED)
    //     .x_y(w.right() - 10.0, w.top() - 10.0)
    //     // .font_size(14)
    //     .wh(vec2(0.5, 0.5));

    // draw.rect()
    //     .x_y(0.5, 0.5)
        // .wh(vec2(0.5, 0.5))
        // .color(BLACK);

    model.simulation.render(&draw, config);

    draw.to_frame(app, &frame).unwrap();
}

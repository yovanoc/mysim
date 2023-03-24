export class Viewport {
  #el: HTMLCanvasElement;

  #ctx: CanvasRenderingContext2D;

  constructor(el: HTMLCanvasElement) {
    this.#el = el;
    const ctx = this.#el.getContext("2d");
    if (!ctx) {
      throw new Error("Could not get canvas context");
    }
    this.#ctx = ctx;
  }

  onmousemove(cb: HTMLCanvasElement["onmousemove"]) {
    this.#el.onmousemove = cb;
  }

  getBoundingClientRect: HTMLCanvasElement["getBoundingClientRect"] = (
    ...args
  ) => this.#el.getBoundingClientRect(...args);

  clear() {
    const pixelRatio = window.devicePixelRatio || 1;

    const size = Math.min(window.innerWidth - 200, window.innerHeight - 30);
    this.#el.width = size * pixelRatio;
    this.#el.height = size * pixelRatio;
    this.#el.style.width = size + "px";
    this.#el.style.height = size + "px";
    this.#el.style.border = "1px solid #111";
    this.#el.style.backgroundColor = "#333";

    this.#ctx.clearRect(0, 0, this.size(), this.size());
  }

  drawCircle(x: number, y: number, radius: number, style: string) {
    x *= this.size();
    y *= this.size();
    radius *= this.size();

    this.#ctx.beginPath();
    this.#ctx.arc(x, y, radius, 0.0, 2.0 * Math.PI);
    this.#ctx.fillStyle = style;
    this.#ctx.fill();
  }

  drawArc(
    x: number,
    y: number,
    radius: number,
    angleFrom: number,
    angleTo: number,
    style: string
  ) {
    x *= this.size();
    y *= this.size();
    radius *= this.size();

    this.#ctx.beginPath();
    this.#ctx.arc(x, y, radius, angleFrom, angleTo);
    this.#ctx.strokeStyle = style;
    this.#ctx.lineWidth = 0.002 * this.size();
    this.#ctx.stroke();
  }

  drawLine(fromX: number, fromY: number, x: number, y: number, style: string) {
    x *= this.size();
    y *= this.size();
    fromX *= this.size();
    fromY *= this.size();

    this.#ctx.beginPath();
    this.#ctx.moveTo(fromX, fromY);
    this.#ctx.lineTo(x, y);
    this.#ctx.lineWidth = 0.002 * this.size();
    this.#ctx.strokeStyle = style;
    this.#ctx.stroke();
  }

  drawFovCone(
    x: number,
    y: number,
    fovAngle: number,
    rotation: number,
    range: number,
    style: string
  ) {
    x *= this.size();
    y *= this.size();

    // Calculate the coordinates of the FOV endpoints
    const fovHalfAngle = fovAngle / 2;
    const fovStartRotation = rotation - fovHalfAngle
    const fovEndRotation = rotation + fovHalfAngle
    const fovStartX = x;
    const fovStartY = y;
    const fovEndX1 = fovStartX - Math.sin(fovStartRotation) * range;
    const fovEndY1 = fovStartY + Math.cos(fovStartRotation) * range;
    const fovEndX2 = fovStartX - Math.sin(fovEndRotation) * range;
    const fovEndY2 = fovStartY + Math.cos(fovEndRotation) * range;

    this.#ctx.beginPath();
    this.#ctx.moveTo(fovStartX, fovStartY);
    this.#ctx.lineTo(fovEndX1, fovEndY1);
    this.#ctx.arc(
      fovStartX,
      fovStartY,
      range * this.size(),
      fovStartRotation,
      fovEndRotation
    );
    this.#ctx.lineTo(fovStartX, fovStartY);
    this.#ctx.fillStyle = style;
    this.#ctx.fill();
  }

  drawTriangle(
    x: number,
    y: number,
    size: number,
    rotation: number,
    style: string
  ) {
    x *= this.size();
    y *= this.size();
    size *= this.size();

    this.#ctx.beginPath();

    this.#ctx.moveTo(
      x + Math.cos(rotation) * size * 1.5,
      y + Math.sin(rotation) * size * 1.5
    );

    this.#ctx.lineTo(
      x + Math.cos(rotation + (2.0 / 3.0) * Math.PI) * size,
      y + Math.sin(rotation + (2.0 / 3.0) * Math.PI) * size
    );

    this.#ctx.lineTo(
      x + Math.cos(rotation - (2.0 / 3.0) * Math.PI) * size,
      y + Math.sin(rotation - (2.0 / 3.0) * Math.PI) * size
    );

    this.#ctx.lineTo(
      x + Math.cos(rotation) * size * 1.5,
      y + Math.sin(rotation) * size * 1.5
    );

    this.#ctx.fillStyle = style;
    this.#ctx.fill();
  }

  drawBoid(
    x: number,
    y: number,
    size: number,
    rotation: number,
    style: string
  ) {
    x *= this.size();
    y *= this.size();
    size *= this.size();

    this.#ctx.save();
    this.#ctx.translate(x, y);
    this.#ctx.rotate(rotation);
  
    this.#ctx.beginPath();
    this.#ctx.moveTo(0, 0);
    this.#ctx.lineTo(size, size / 2);
    this.#ctx.lineTo(0, size);
    this.#ctx.closePath();
  
    this.#ctx.fillStyle = style;
    this.#ctx.fill();
  
    this.#ctx.restore();
  }

  size() {
    return this.#el.width;
  }
}

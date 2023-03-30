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

    const size = Math.min(window.innerWidth - 20, window.innerHeight - 30);
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
    { x, y, startAngle, endAngle, range, fillStyle, strokeStyle }: {
      x: number,
      y: number,
      startAngle: number,
      endAngle: number,
      range: number,
      fillStyle: string,
      strokeStyle: string,
    }
  ) {
    x *= this.size();
    y *= this.size();
    range *= this.size();

    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.arc(x, y, range, startAngle, endAngle);
    this.#ctx.closePath();
    this.#ctx.fillStyle = fillStyle;
    this.#ctx.fill();

    // Draw the lines from the center point to the edges of the FOV
    this.#ctx.beginPath();
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + range * Math.cos(startAngle), y + range * Math.sin(startAngle));
    this.#ctx.moveTo(x, y);
    this.#ctx.lineTo(x + range * Math.cos(endAngle), y + range * Math.sin(endAngle));
    this.#ctx.strokeStyle = strokeStyle;
    this.#ctx.stroke();
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
      x - Math.sin(rotation) * size * 1.5,
      y + Math.cos(rotation) * size * 1.5
    );

    this.#ctx.lineTo(
      x - Math.sin(rotation + (2.0 / 3.0) * Math.PI) * size,
      y + Math.cos(rotation + (2.0 / 3.0) * Math.PI) * size
    );

    this.#ctx.lineTo(
      x - Math.sin(rotation - (2.0 / 3.0) * Math.PI) * size,
      y + Math.cos(rotation - (2.0 / 3.0) * Math.PI) * size
    );

    this.#ctx.lineTo(
      x - Math.sin(rotation) * size * 1.5,
      y + Math.cos(rotation) * size * 1.5
    );

    this.#ctx.fillStyle = style;
    this.#ctx.fill();
  }

  size() {
    return this.#el.width;
  }
}

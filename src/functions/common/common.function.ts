import { ICommonFn } from "./common.interface";

export function setTransperantCanvasBackground(canvas: HTMLCanvasElement | null) {
  if (canvas === null) return;  
  const context = canvas.getContext('2d');
  if (context === null) return;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = width;
  canvas.height = height;
  
  context.clearRect(0, 0, width, height);
}

export function drawCircle(canvas: HTMLCanvasElement | null, options: ICommonFn.DrawCircleOptions) {
  if (canvas === null) return;  
  const context = canvas.getContext('2d');
  if (context === null) return;
  context.beginPath();

  context.arc(options.x, options.y, options.radius, options.startAngle, options.endAngle);
  
  if (typeof options.fillColor === 'string') {
    context.fillStyle = options.fillColor;
    context.fill();
  }

  if (options.stroke !== undefined) {
    if (typeof options.stroke.strokeColor === 'string') {
      context.strokeStyle = options.stroke.strokeColor;
    }
    const strokeWidth = options.stroke.strokeWidth ?? 1;
    context.lineWidth = strokeWidth;
    context.stroke();
  }

  context.closePath();
}

export function drawLine(canvas: HTMLCanvasElement | null, options: ICommonFn.DrawLineOptions) {
  if (canvas === null) return;  
  const context = canvas.getContext('2d');
  if (context === null) return;
  context.beginPath();

  context.moveTo(options.startPoint.x, options.startPoint.y);
  context.lineTo(options.endPoint.x, options.endPoint.y);

  if (options.stroke !== undefined) {
    if (typeof options.stroke.strokeColor === 'string') {
      context.strokeStyle = options.stroke.strokeColor;
    }
    const strokeWidth = options.stroke.strokeWidth ?? 1;
    context.lineWidth = strokeWidth;
    context.stroke();
  }

  context.closePath();
}

export function drawPolygon(canvas: HTMLCanvasElement | null, options: ICommonFn.DrawPolygonOptions) {
  if (canvas === null) return;  
  const context = canvas.getContext('2d');
  if (context === null) return;
  context.beginPath();

  if (options.coordinates === undefined) return;
  if (options.coordinates.length <= 1) return;

  const firstCoordinate = options.coordinates[0];
  context.moveTo(firstCoordinate.x, firstCoordinate.y);

  const convertedCoorinates = [ ...options.coordinates ];
  convertedCoorinates.push(options.coordinates[0]);
  for (let i = 1; i < convertedCoorinates.length; i++) {
    const currentCoordinate = convertedCoorinates[i];
    context.lineTo(currentCoordinate.x, currentCoordinate.y);
  }

  if (typeof options.fillColor === 'string') {
    context.fillStyle = options.fillColor;
    context.fill();
  }

  if (options.stroke !== undefined) {
    if (typeof options.stroke.strokeColor === 'string') {
      context.strokeStyle = options.stroke.strokeColor;
    }
    const strokeWidth = options.stroke.strokeWidth ?? 1;
    context.lineWidth = strokeWidth;
    context.stroke();
  }

  context.closePath();
}

export function drawText(canvas: HTMLCanvasElement | null, options: ICommonFn.DrawTextOptions) {
  if (canvas === null) return;  
  const context = canvas.getContext('2d');
  if (context === null) return;
  context.beginPath();

  const font = `${options.fontSize ?? 10}px ${options.fontFamily ?? 'serif'}`;
  context.font = font;

  const textAlign = options.textAlign ?? 'center';
  context.textAlign = textAlign;

  const textBaseline = options.textBaseline ?? 'middle';
  context.textBaseline = textBaseline;

  const textDirection = options.textDirection ?? 'inherit';
  context.direction = textDirection;

  if (options.stroke !== undefined) {
    const strokeWidth = options.stroke.strokeWidth ?? 0;
    if (strokeWidth > 0) {
      if (typeof options.stroke.strokeColor === 'string') {
        context.strokeStyle = options.stroke.strokeColor;
      }
      context.lineWidth = strokeWidth;
      context.strokeText(options.text, options.x, options.y);
    }
  }

  if (typeof options.fillColor === 'string') {
    context.fillStyle = options.fillColor;
    context.fill();
  }

  context.fillText(options.text, options.x, options.y);

  context.closePath();
}

export function getCanvasBoundingClientRect(canvas: HTMLCanvasElement | null) {
  if (canvas === null) return undefined;
  return canvas.getBoundingClientRect(); 
}

export function getTwoPointDistance(target1: ICommonFn.Coordinate, target2: ICommonFn.Coordinate) {
  const x = target2.x - target1.x;
  const y = target2.y - target1.y;
  return Math.sqrt((x * x) + (y * y));
}

export function getPercent(target: number, value: number) {
  return (value * 100) / target;
}
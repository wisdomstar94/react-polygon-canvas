export declare namespace ICommonFn {
  export interface Coordinate {
    x: number;
    y: number;
  }

  export interface DrawOptionsStroke {
    strokeColor?: string;
    strokeWidth?: number;
  }

  export interface DrawCircleOptions {
    /** 원 중심의 x 좌표 */
    x: number;
    /** 원 중심의 y 좌표 */
    y: number;
    /** 반지름 */
    radius: number;
    startAngle: number;
    endAngle: number;
    fillColor?: string;
    stroke?: DrawOptionsStroke;
  }

  export interface DrawLineOptions {
    startPoint: Coordinate;
    endPoint: Coordinate;
    stroke?: DrawOptionsStroke;
  }

  export interface DrawPolygonOptions {
    coordinates?: Coordinate[];
    fillColor?: string;
    stroke?: DrawOptionsStroke;
  }

  export interface DrawTextOptions {
    text: string;
    x: number;
    y: number;
    fontFamily?: string;
    fontSize?: number;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    textDirection?: CanvasDirection;
    fillColor?: string;
    stroke?: DrawOptionsStroke;
  }
}
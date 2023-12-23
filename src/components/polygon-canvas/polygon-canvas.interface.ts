export declare namespace IPolygonCanvas {
  export interface Coordinate {
    x: number;
    y: number;
  }

  export type CanvasSelectInfoType = 'point' | 'polygon' | '';

  export interface CanvasSelectInfo {
    type: CanvasSelectInfoType;
    index?: number;
  }

  export interface Props {
    className?: string;

    coordinates?: Coordinate[];
    pointRadius?: number;

    fontSize?: number;
    fontColor?: string;
    fontFamily?: string;
    fontStrokeColor?: string;
    fontStrokeWidth?: number;

    polygonFillColor?: string;
    polygonStrokeWidth?: number;
    polygonStrokeColor?: string;

    pointFillColor?: string;
    pointStrokeWidth?: number;
    pointStrokeColor?: string;

    isAllowControl?: boolean;
    isShow?: boolean;
    onControlEndedCoordinates?: (coordinates: Coordinate[] | undefined) => void;
  }
}
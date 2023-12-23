import { RefObject } from "react";

export declare namespace IUseCanvasCalculator {
  export interface Coordinate {
    x: number;
    y: number;
  }

  export interface MouseUpInfo {
    timestamp: number;
  }

  export interface Props {
    canvasRef: RefObject<HTMLCanvasElement>;
    onCanvasMouseDown?: () => void;
    onCanvasMouseMove?: () => void;
    onCanvasMouseUp?: () => void;
    onCanvasClick?: () => void;
  } 
}
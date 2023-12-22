import { useEffect, useState } from "react";
import { IUseCanvasCalculator } from "./use-canvas-calculator.interface";
import { useAddEventListener } from '@wisdomstar94/react-add-event-listener';
import { getCanvasBoundingClientRect } from "@/functions/common/common.function";

export function useCanvasCalculator(props: IUseCanvasCalculator.Props) {
  const canvasRef = props.canvasRef;

  const [isPressing, setIsPressing] = useState(false);
  const [mouseUpInfo, setMouseUpInfo] = useState<IUseCanvasCalculator.MouseUpInfo>();
  const [mouseDownedCanvasClientRect, setMouseDownedCanvasClientRect] = useState<DOMRect>();
  
  const [mouseDownedAfterScrollX, setMouseDownedAfterScrollX] = useState(0);
  const [mouseDownedAfterScrollY, setMouseDownedAfterScrollY] = useState(0);
  const [mouseDownedCanvasCoordinate, setMouseDownedCanvasCoordinate] = useState<IUseCanvasCalculator.Coordinate>();
  const [mouseCurrentCanvasCoordinate, setMouseCurrentCanvasCoordinate] = useState<IUseCanvasCalculator.Coordinate>();

  const [mouseClickedCanvasCoordinate, setMouseClickedCanvasCoordinate] = useState<IUseCanvasCalculator.Coordinate>();

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  useAddEventListener({
    domEventRequiredInfo: {
      target: canvasRef,
      eventName: `click`,
      eventListener(event) {
        const _mouseClickedCanvasClientRect = getCanvasBoundingClientRect(canvasRef.current);

        const mouseClientX = event.clientX;
        const mouseClientY = event.clientY;
        setMouseClickedCanvasCoordinate({ x: mouseClientX - (_mouseClickedCanvasClientRect?.left ?? mouseClientX), y: mouseClientY - (_mouseClickedCanvasClientRect?.top ?? mouseClientY) });
      },
    },
  });

  useAddEventListener({
    domEventRequiredInfo: {
      target: canvasRef,
      eventName: `mousedown`,
      eventListener(event) {
        const _mouseDownedCanvasClientRect = getCanvasBoundingClientRect(canvasRef.current);
        setMouseDownedCanvasClientRect(_mouseDownedCanvasClientRect);
        setMouseDownedAfterScrollX(0);
        setMouseDownedAfterScrollY(0);
        setDx(0);
        setDy(0);
        setIsPressing(true);

        const mouseClientX = event.clientX;
        const mouseClientY = event.clientY;
        setMouseDownedCanvasCoordinate({ x: mouseClientX - (_mouseDownedCanvasClientRect?.left ?? mouseClientX), y: mouseClientY - (_mouseDownedCanvasClientRect?.top ?? mouseClientY) });
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: `mousemove`,
      eventListener(event) {
        if (!isPressing) return;
        if (mouseDownedCanvasClientRect === undefined) return;
        const currentCanvasClientRect = getCanvasBoundingClientRect(canvasRef.current);
        if (currentCanvasClientRect === undefined) return;
        setMouseDownedAfterScrollY(mouseDownedCanvasClientRect.top - currentCanvasClientRect.top);
        setMouseDownedAfterScrollX(mouseDownedCanvasClientRect.left - currentCanvasClientRect.left);

        // const _mouseCurrentCanvasCoordinate: IUseCanvasCalculator.Coordinate = { x: event.clientX - (mouseDownedClientCoordinate?.x ?? event.clientX) + mouseDownedAfterScrollX, y: event.clientY - (mouseDownedClientCoordinate?.y ?? event.clientY) + mouseDownedAfterScrollY };
        const _mouseCurrentCanvasCoordinate: IUseCanvasCalculator.Coordinate = { x: event.clientX - (currentCanvasClientRect?.left ?? event.clientX), y: event.clientY - (currentCanvasClientRect?.top ?? event.clientY) };
        setMouseCurrentCanvasCoordinate(_mouseCurrentCanvasCoordinate);

        const dx = _mouseCurrentCanvasCoordinate.x - (mouseDownedCanvasCoordinate?.x ?? _mouseCurrentCanvasCoordinate.x);
        setDx(prev => dx);

        const dy = _mouseCurrentCanvasCoordinate.y - (mouseDownedCanvasCoordinate?.y ?? _mouseCurrentCanvasCoordinate.y);
        setDy(prev => dy);
      },
    },
  });

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: `mouseup`,
      eventListener(event) {
        setIsPressing(false);
        if (isPressing) {
          setMouseUpInfo({ timestamp: Date.now() });
        }
      },
    },
  });

  return {
    isPressing,
    mouseDownedCanvasClientRect,
    mouseDownedAfterScrollX,
    mouseDownedAfterScrollY,
    mouseDownedCanvasCoordinate,
    mouseCurrentCanvasCoordinate,
    dx,
    dy,
    mouseUpInfo,
    mouseClickedCanvasCoordinate,
  };
}
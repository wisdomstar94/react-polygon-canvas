import { useCallback, useEffect, useRef, useState } from "react";
import { IPolygonCanvas } from "./polygon-canvas.interface";
import styles from './polygon-canvas.module.css';
import { drawCircle, drawPolygon, drawText, getPercent, getTwoPointDistance, setTransperantCanvasBackground } from "@/functions/common/common.function";
import { useCanvasCalculator } from "@/hooks/use-canvas-calculator/use-canvas-calculator.hook";
import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { polygonContains } from 'd3';

export function PolygonCanvas(props: IPolygonCanvas.Props) {
  const [coordinates, setCoordinates] = useState(props.coordinates);
  useEffect(() => { setCoordinates(props.coordinates) }, [props.coordinates]);

  const [savedPercentCoordinates, setSavedPercentCoordinates] = useState<IPolygonCanvas.Coordinate[]>();

  // const [selectedCoordinateIndex, setSelectedCoordinateIndex] = useState<number>();
  const [canvasSelectInfo, setCanvasSelectInfo] = useState<IPolygonCanvas.CanvasSelectInfo>();

  const onControlEndedCoordinates = props.onControlEndedCoordinates;
  const isAllowControl = props.isAllowControl ?? true;
  const pointRadius = props.pointRadius ?? 10;

  const fontSize = props.fontSize ?? 10;
  const fontColor = props.fontColor ?? '#ffffff';
  const fontFamily = props.fontFamily ?? 'sans-serif';
  const fontStrokeColor = props.fontStrokeColor ?? 'rgba(0, 0, 0, 0)';
  const fontStrokeWidth = props.fontStrokeWidth ?? 0;
  const polygonFillColor = props.polygonFillColor ?? 'rgba(255, 0, 0, 0.5)';
  const polygonStrokeWidth = props.polygonStrokeWidth ?? 1;
  const polygonStrokeColor = props.polygonStrokeColor ?? 'rgba(0, 0, 0, 0)';
  const pointFillColor = props.pointFillColor ?? 'rgba(255, 0, 0, 0.8)';
  const pointStrokeWidth = props.pointStrokeWidth ?? 1;
  const pointStrokeColor = props.pointStrokeColor ?? 'rgba(0, 0, 0, 0)';
  
  const isShow = props.isShow ?? true;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCalculator = useCanvasCalculator({ 
    canvasRef, 
    onCanvasMouseDown() {
      if (!isAllowControl) return;
      if (canvasCalculator.mouseDownedCanvasCoordinate === undefined) return;
      const info = getCanvasSelectInfo(canvasCalculator.mouseDownedCanvasCoordinate.x, canvasCalculator.mouseDownedCanvasCoordinate.y);
      setCanvasSelectInfo(info);
    },
    onCanvasMouseMove() {
      if (!isAllowControl) return;
      if (!isAllowControl) return;
      if (coordinates === undefined) return;
      if (canvasSelectInfo === undefined) return;

      if (canvasSelectInfo.type === 'point') {
        setCoordinates(prev => {
          if (prev === undefined) return undefined;
          return prev.map((item, index) => {
            if (index !== canvasSelectInfo.index) {
              return item;
            }
            const propsCoordinate = (props.coordinates ?? [])[index];
            return {
              ...item,
              x: propsCoordinate.x + canvasCalculator.dx,
              y: propsCoordinate.y + canvasCalculator.dy,
            };
          });
        });
      }

      if (canvasSelectInfo.type === 'polygon') {
        setCoordinates(prev => {
          if (prev === undefined) return undefined;
          return prev.map((item, index) => {
            const propsCoordinate = (props.coordinates ?? [])[index];
            return {
              ...item,
              x: propsCoordinate.x + canvasCalculator.dx,
              y: propsCoordinate.y + canvasCalculator.dy,
            };
          });
        });
      }
    },
    onCanvasMouseUp() {
      if (!isAllowControl) return;
      if (typeof onControlEndedCoordinates === 'function') {
        onControlEndedCoordinates(coordinates);
      }
    },
    onCanvasClick() {
      if (!isAllowControl) return;
      if (canvasCalculator.mouseClickedCanvasCoordinate === undefined) return;
      if (canvasSelectInfo === undefined) return;
      
      if (canvasSelectInfo.type === '') {
        const _selectedCoordinateIndex = getSelectedPointCoordinateIndex(canvasCalculator.mouseClickedCanvasCoordinate.x, canvasCalculator.mouseClickedCanvasCoordinate.y);
        if (_selectedCoordinateIndex !== undefined) return;
  
        const newCoordinates = [...(coordinates ?? [])];
        newCoordinates.push({ x: canvasCalculator.mouseClickedCanvasCoordinate.x, y: canvasCalculator.mouseClickedCanvasCoordinate.y });
        if (typeof onControlEndedCoordinates === 'function') {
          onControlEndedCoordinates(newCoordinates);
        }
      }
    },
  });

  const getSelectedPointCoordinateIndex = useCallback((x: number, y: number) => {
    if (coordinates === undefined) return undefined;

    const targetIndexes: number[] = [];
    for (let i = 0; i < coordinates.length; i++) {
      const coordinate = coordinates[i];
      const distance = getTwoPointDistance({ x: coordinate.x, y: coordinate.y }, { x, y });
      if (distance <= pointRadius) {
        targetIndexes.push(i);
      }
    }

    if (targetIndexes.length === 0) return undefined;

    return Math.max(...targetIndexes);
  }, [coordinates, pointRadius]);

  const drawCanvas = useCallback(() => {
    if (isShow !== true) return;
    if (coordinates === undefined) return;
    if (coordinates.length === 0) return;

    setTransperantCanvasBackground(canvasRef.current);
    const canvas = canvasRef.current;

    if (canvas !== null) {
      const canvasWidth = canvas.clientWidth;
      const canvasHeight = canvas.clientHeight;
      
      setSavedPercentCoordinates(coordinates?.map(item => {
        return {
          x: getPercent(canvasWidth, item.x),
          y: getPercent(canvasHeight, item.y),
        };
      }));
    }
      
    drawPolygon(canvasRef.current, {
      coordinates,
      fillColor: polygonFillColor,
      stroke: {
        strokeColor: polygonStrokeColor,
        strokeWidth: polygonStrokeWidth,
      },
    });

    let index = 0;
    for (const coordinate of coordinates) {
      const { x, y } = coordinate;
      drawCircle(canvasRef.current, {
        x,
        y,
        radius: pointRadius,
        startAngle: 0,
        endAngle: Math.PI * 2,
        fillColor: pointFillColor,
        stroke: {
          strokeColor: pointStrokeColor,
          strokeWidth: pointStrokeWidth,
        },
      });
      drawText(canvasRef.current, {
        x,
        y,
        text: `${index + 1}`,
        fillColor: fontColor,
        fontSize: fontSize,
        fontFamily: fontFamily,
        stroke: {
          strokeColor: fontStrokeColor,
          strokeWidth: fontStrokeWidth,
        },
      });
      index++;
    }
  }, [coordinates, fontColor, fontFamily, fontSize, fontStrokeColor, fontStrokeWidth, isShow, pointFillColor, pointRadius, pointStrokeColor, pointStrokeWidth, polygonFillColor, polygonStrokeColor, polygonStrokeWidth]);

  const isPolygonTouched = useCallback((x: number, y: number) => {
    if (coordinates === undefined) return false;

    const data: Array<[number, number]> = coordinates.map(item => {
      return [item.x, item.y];
    });
    
    return polygonContains(data, [x, y]);
  }, [coordinates]);

  const getCanvasSelectInfo = useCallback((x: number, y: number) => {
    const info: IPolygonCanvas.CanvasSelectInfo = {
      type: '',
    };

    const _selectedCoordinateIndex = getSelectedPointCoordinateIndex(x, y);
    if (_selectedCoordinateIndex !== undefined) {
      info.type = 'point';
      info.index = _selectedCoordinateIndex;
      return info;
    }

    const isPolygonTouch = isPolygonTouched(x, y);
    if (isPolygonTouch) {
      info.type = 'polygon';
      return info;
    }

    return info;
  }, [getSelectedPointCoordinateIndex, isPolygonTouched]);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: `resize`,
      eventListener(event) {
        const canvas = canvasRef.current;
        if (canvas === null) return;
        if (savedPercentCoordinates === undefined) return;

        const canvasWidth = canvas.clientWidth;
        const canvasHeight = canvas.clientHeight;

        const newCoordinates = coordinates?.map((item, index) => {
          const targetSavedPercentCoordinate = savedPercentCoordinates[index];
          return {
            ...item,
            x: canvasWidth * (targetSavedPercentCoordinate.x / 100),
            y: canvasHeight * (targetSavedPercentCoordinate.y / 100),
          };
        });
        if (typeof onControlEndedCoordinates === 'function') {
          onControlEndedCoordinates(newCoordinates);
        }
      },
    },
  });

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // useEffect(() => {
  //   if (!isAllowControl) return;
  //   if (coordinates === undefined) return;
  //   if (canvasCalculator.mouseDownedCanvasCoordinate === undefined) return;

  //   const info = getCanvasSelectInfo(canvasCalculator.mouseDownedCanvasCoordinate.x, canvasCalculator.mouseDownedCanvasCoordinate.y);
  //   setCanvasSelectInfo(info);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [canvasCalculator.mouseDownedCanvasCoordinate, isAllowControl, pointRadius]);

  // useEffect(() => {
  //   if (!canvasCalculator.isPressing) return;
  //   if (!isAllowControl) return;
  //   if (coordinates === undefined) return;
  //   if (canvasSelectInfo === undefined) return;

  //   if (canvasSelectInfo.type === 'point') {
  //     setCoordinates(prev => {
  //       if (prev === undefined) return undefined;
  //       return prev.map((item, index) => {
  //         if (index !== canvasSelectInfo.index) {
  //           return item;
  //         }
  //         const propsCoordinate = (props.coordinates ?? [])[index];
  //         return {
  //           ...item,
  //           x: propsCoordinate.x + canvasCalculator.dx,
  //           y: propsCoordinate.y + canvasCalculator.dy,
  //         };
  //       });
  //     });
  //   }

  //   if (canvasSelectInfo.type === 'polygon') {
  //     setCoordinates(prev => {
  //       if (prev === undefined) return undefined;
  //       return prev.map((item, index) => {
  //         const propsCoordinate = (props.coordinates ?? [])[index];
  //         return {
  //           ...item,
  //           x: propsCoordinate.x + canvasCalculator.dx,
  //           y: propsCoordinate.y + canvasCalculator.dy,
  //         };
  //       });
  //     });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [canvasCalculator.isPressing, canvasCalculator.dx, canvasCalculator.dy, canvasSelectInfo, isAllowControl]);

  // useEffect(() => {
  //   if (canvasCalculator.mouseUpInfo === undefined) return;
    
  //   if (typeof onControlEndedCoordinates === 'function') {
  //     onControlEndedCoordinates(coordinates);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [canvasCalculator.mouseUpInfo]);

  // useEffect(() => {
  //   if (canvasCalculator.mouseClickedCanvasCoordinate === undefined) return;
  //   if (canvasSelectInfo === undefined) return;
    
  //   if (canvasSelectInfo.type === '') {
  //     const _selectedCoordinateIndex = getSelectedPointCoordinateIndex(canvasCalculator.mouseClickedCanvasCoordinate.x, canvasCalculator.mouseClickedCanvasCoordinate.y);
  //     if (_selectedCoordinateIndex !== undefined) return;

  //     const newCoordinates = [...(coordinates ?? [])];
  //     newCoordinates.push({ x: canvasCalculator.mouseClickedCanvasCoordinate.x, y: canvasCalculator.mouseClickedCanvasCoordinate.y });
  //     if (typeof onControlEndedCoordinates === 'function') {
  //       onControlEndedCoordinates(newCoordinates);
  //     }
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [canvasCalculator.mouseClickedCanvasCoordinate, canvasSelectInfo]);

  return (
    <>
      {
        isShow !== true ? 
        null : 
        <canvas 
          ref={canvasRef} className={props.className ?? styles['canvas']} />
      }
    </>
  );
}

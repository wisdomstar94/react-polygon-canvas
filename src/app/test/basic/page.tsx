"use client"

import { PolygonCanvas } from "@/components/polygon-canvas/polygon-canvas.component";
import { IPolygonCanvas } from "@/components/polygon-canvas/polygon-canvas.interface";
import { useEffect, useState } from "react";

export default function Page() {
  const [coordinates, setCoordinates] = useState<IPolygonCanvas.Coordinate[]>();

  // useEffect(() => {
  //   setCoordinates(prev => {
  //     return [
  //       { x: 10, y: 40, },
  //       { x: 40, y: 54, },
  //       { x: 50, y: 68, },
  //       { x: 5, y: 70, },
  //     ];
  //   });
  // }, []);

  return (
    <>
      <div className="w-[300%] h-[700px]">

      </div>
      <div className="w-[150%] flex flex-wrap items-center justify-center relative">
        <div className="w-[30%] bg-red-100 block aspect-video relative">
          <PolygonCanvas 
            coordinates={coordinates}
            pointRadius={10}
            pointStrokeColor="rgba(0, 0, 0, 0.9)"
            fontColor="rgba(255, 255, 255, 1)"
            // fontStrokeColor="rgba(255, 255, 255, 1)"
            // fontStrokeWidth={3}
            polygonStrokeColor="rgba(41, 173, 239, 1)"
            polygonFillColor="rgba(246, 195, 27, 0.7)"
            fontSize={12}
            onControlEndedCoordinates={(newCoordinates) => {
              setCoordinates(newCoordinates);
              // setCoordinates([...coordinates ?? []]);
            }}
            />
        </div>
      </div>
      <div className="w-full h-[700px]">

      </div>
      <div className="w-full h-[700px]">

      </div>
      <div className="w-full h-[700px]">

      </div>
    </>
  );
}
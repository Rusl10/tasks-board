

import GridBackground from "./GridBackground";
import { Point } from "../types/index";
import './Canvas.css';

interface ICanvasProps {
  canvasPosition: Point
  scale: number
}

export function Canvas({canvasPosition, scale, mousePos}: ICanvasProps) {
  return (
    <div 
    className="wrapper">
      <GridBackground offset={canvasPosition} scale={scale} mousePos={mousePos} />
    </div>
  )
}



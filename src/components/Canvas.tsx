

import GridBackground from "./GridBackground"
import './Canvas.css'
import { Point } from "../types/index"

interface ICanvasProps {
  canvasPosition: Point
  scale: number
}

export function Canvas({canvasPosition, scale}: ICanvasProps) {
  return (
    <div 
    className="wrapper">
      <GridBackground offset={canvasPosition} scale={scale} />
    </div>
  )
}



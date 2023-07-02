

import { MutableRefObject } from "react"
import GridBackground from "./GridBackground"
import './Canvas.css'
import { Point } from "../types/index"

interface ICanvasProps {
  elementRef: MutableRefObject<HTMLDivElement>
  canvasPosition: Point
  scale: number
}

export function Canvas({elementRef, canvasPosition, scale}: ICanvasProps) {
  return (
    <div ref={elementRef} 
    className="wrapper">
      <GridBackground offset={canvasPosition} scale={scale} />
    </div>
  )
}



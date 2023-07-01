import { PropsWithChildren, useEffect, useRef, useState } from "react"
import { Point } from "../types"
import useScale from "../hooks/useScale"
import useMousePos from "../hooks/useMousePos"
import './Canvas.css'
import { useLatest } from "../hooks/useLatest"
import GridBackground from "./GridBackground"

export function Canvas(props: PropsWithChildren<unknown>) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [canvasPosition, setCanvasPosition] = useState<Point>({x: 0, y: 0})
  const scale = useScale(ref)
  const latestScaleRef = useLatest(scale)
  useEffect(() => {
    const prevMousePosition = {
      x: 0,
      y: 0
    };
    const handleMouseMove = (e: MouseEvent) => {
      const mouseMovePageX = e.pageX;
      const mouseMovePageY = e.pageY;
      const deltaX = mouseMovePageX - prevMousePosition.x;
      const deltaY = mouseMovePageY - prevMousePosition.y;
      prevMousePosition.x = mouseMovePageX;
      prevMousePosition.y = mouseMovePageY;
      setCanvasPosition(prevPosition => {
        return {
          x: prevPosition.x + deltaX / latestScaleRef.current,
          y: prevPosition.y + deltaY / latestScaleRef.current
        }
      })
    }
    
    const handleMouseDown = (e: MouseEvent) => {
      if(e.button > 0) return;
      prevMousePosition.x = e.pageX;
      prevMousePosition.y = e.pageY;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])
  
  const mousePosRef = useMousePos(ref)

  return (
    <div ref={ref} 
    className="wrapper" style={{position: 'relative'}}>
      <GridBackground offset={canvasPosition} scale={scale} />
    </div>
  )
}



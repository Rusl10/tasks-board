import { useEffect, useRef, useState } from "react"
import { Point } from "./types"
import './App.css';
import { Canvas } from './components/Canvas';
import { CardsField } from './components/CardsField';
import useScale from "./hooks/useScale"
import { useLatest } from "./hooks/useLatest"


export const App = () => {
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
  
  // const mousePosRef = useMousePos(ref)
  return (
    <>
      <CardsField />
      <Canvas 
        elementRef={ref}
        canvasPosition={canvasPosition}
        scale={scale}
      />
    </>
  );
};

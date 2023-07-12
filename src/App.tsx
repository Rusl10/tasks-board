import { useEffect, useRef, useState } from "react"
import { Point } from "./types"
import './App.css';
import { Canvas } from './components/Canvas';
import { CardsField } from './components/CardsField';
import useScale from "./hooks/useScale"
import { useLatest } from "./hooks/useLatest"


export const App = () => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [canvasPosition, setCanvasPosition] = useState<Point>({x: 0, y: 0});
  const [newCardPoint, setNewCardPoint] = useState<Point | null>(null);
  const [isNewCardMode, setIsNewCardMode] = useState(false);
  const scale = useScale(ref);
  const latestIsNewCardModeRef = useLatest(isNewCardMode)
  const latestCanvasPositionRef = useLatest(canvasPosition)
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
          x: prevPosition.x + deltaX,
          y: prevPosition.y + deltaY
        }
      })
    }
    
    const handleMouseDown = (e: MouseEvent) => {
      if(latestIsNewCardModeRef.current) {
        console.log('-latestCanvasPositionRef.current.x + e.clientX', -latestCanvasPositionRef.current.x + e.clientX)
        setNewCardPoint({
          x: -latestCanvasPositionRef.current.x + e.clientX,
          y: -latestCanvasPositionRef.current.y + e.clientY
        })
        setIsNewCardMode(false);
      } else if(e.button === 0) {
        prevMousePosition.x = e.pageX;
        prevMousePosition.y = e.pageY;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }
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
  const buttonText = isNewCardMode ? 'Отменить' : 'Добавить карточку'
  return (
    <div ref={ref}>
      <button onMouseDown={(e) => {
        e.stopPropagation();
        console.log('setIsNewCardMode');
        setIsNewCardMode(!isNewCardMode)
      }}>{buttonText}</button>
      <CardsField 
        canvasPosition={canvasPosition}
        scale={scale}
        newCardPoint={newCardPoint}
      />
      <Canvas 
        canvasPosition={canvasPosition}
        scale={scale}
      />
    </div>
  );
};

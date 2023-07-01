import { RefObject, useEffect, useRef } from "react";

export default function useMousePos(ref: RefObject<HTMLDivElement>) {
  const mousePosRef = useRef({
      x: 0,
      y: 0
    });

  useEffect(() => {
    /// ! heed add wheel event
    const element = ref.current;
    if (!element) return;
    const refCurrent = ref.current;
    const handleMouseMove = (e: MouseEvent) => {

      // weak place
      const mouseMoveX = e.clientX;
      const mouseMoveY = e.clientY;
      mousePosRef.current.x = mouseMoveX;
      mousePosRef.current.y = mouseMoveY;
    }

    const handleWheelEvent = (e: WheelEvent) => {
      const mouseMoveX = e.clientX;
      const mouseMoveY = e.clientY;

      console.log('wheel mouseMoveX', mouseMoveX)
    }

    refCurrent.addEventListener('mousemove', handleMouseMove)
    refCurrent.addEventListener('wheel', handleWheelEvent)
    return () => {
      refCurrent?.removeEventListener('mousemove', handleMouseMove)
      refCurrent.removeEventListener('wheel', handleWheelEvent);
    }
  }, [ref])

  return mousePosRef
}

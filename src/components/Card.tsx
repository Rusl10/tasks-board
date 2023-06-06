// import React from 'react';
import { memo, RefObject, useEffect, useRef, useState } from 'react';
import { useLatest } from '../hooks/useLatest';
import { newUserCoordsObj } from '../utils/index';
import './Card.css';
import { rafThrottle } from '../utils/index';
import { useCombinedRef } from '../hooks/useCombinedRef';

interface ICoordObj {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const initialData = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    id: '',
}

interface ICardProps {
  onRemoveCard: (id: string) => void;
  coord: ICoordObj,
  changeCoordsArray: (cardCoords: ICoordObj) => boolean;
  elementRef: RefObject<HTMLDivElement>;
}

export const Card = memo(({
  onRemoveCard,
  coord,
  elementRef,
  changeCoordsArray
}: ICardProps): JSX.Element => {
   console.log('card render')
  const { 
    left, 
    top, 
    id,
  } = coord;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [temporaryCoords, setTemporaryCoords] = useState(initialData);
  const coordLatestRef = useLatest(coord)
  const combinedRef = useCombinedRef(cardRef, elementRef)
  const temporaryCoordsRef = useLatest(temporaryCoords);
  useEffect(() => {
    const cardEl = cardRef.current;

    if (!cardEl) return;
    
    const offset = {
      x: 0,
      y: 0,
    };
    
    const handleMouseMove = rafThrottle((event) => {

      const mouseMovePageX = event.pageX;
      const mouseMovePageY = event.pageY;
      const newCoordsObj = newUserCoordsObj(mouseMovePageX, mouseMovePageY, offset.x, offset.y, id);
      setTemporaryCoords(newCoordsObj);
    })
    const handleMouseUp = () => {
      // сетим координаты, только если карточка была сдвинута
      if (temporaryCoordsRef.current.id !== '') {
        changeCoordsArray(temporaryCoordsRef.current);
        setTemporaryCoords(initialData);
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp);
    }
    const handleMouseDown = (event) => {
      offset.x =  event.pageX - coordLatestRef.current.left;
      offset.y = event.pageY - coordLatestRef.current.top;

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    cardEl.addEventListener('mousedown', handleMouseDown)
    return () => {
      cardEl.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [coord.id])

  return (
    <div 
      className='card' 
      style={{
        transform: `translate(${temporaryCoords.left !== 0 ? temporaryCoords.left : left}px, ${temporaryCoords.top !== 0 ? temporaryCoords.top : top}px)`
      }}
      ref={combinedRef}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemoveCard(id);
      }}
    >
      <p contentEditable>Введите текст...</p>
    </div>
  );
});

// import React from 'react';
import { memo, MouseEvent, useEffect, useRef, useState } from 'react';
import { useLatest } from '../hooks/useLatest';
import { newUserCoordsObj } from '../utils/index';
import './Card.css';

interface ICoordObj {
  isActive: boolean;
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
    isActive: false
}

interface ICardProps {
  onRemoveCard: (id: string) => void;
  coord: ICoordObj,
  changeCoordsArray: (cardCoords: ICoordObj) => boolean;
}

export const Card = memo(({
  onRemoveCard,
  coord,
  changeCoordsArray
}: ICardProps): JSX.Element => {
  // console.log('card render')
  const { 
    left, 
    top, 
    id,
    isActive
  } = coord;
  const cardRef = useRef(null)
  const [temporaryCoords, setTemporaryCoords] = useState(initialData)
  const temporaryCoordsRef = useLatest(temporaryCoords);
  const [isPressed, setIsPressed] = useState(false);
  useEffect(() => {
    if(!isPressed) return;
    function onMouseMove(event: MouseEvent) {
      const mouseMovePageX = event.pageX;
      const mouseMovePageY = event.pageY;
  
      const newCoordsObj = newUserCoordsObj(mouseMovePageX, mouseMovePageY, id, true);
      setTemporaryCoords(newCoordsObj);
    }

    function onMouseUp() {
      // сетим координаты, только если карточка была сдвинута
    if (temporaryCoordsRef.current.id !== '') {
      // maybe we have to set isActive to false
      changeCoordsArray(temporaryCoordsRef.current);
      setTemporaryCoords(initialData)
    }
      setIsPressed(false);
    }
  
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp);
    }
  }, [isPressed])
  const onMouseDownHandler = () => {
    setIsPressed(true);
  };
  return (
    <div 
      className='card' 
      ref={cardRef}
      style={{
        top: temporaryCoords.top !== 0 ? (temporaryCoords.top + 'px') : top,
        left: temporaryCoords.left !== 0 ? (temporaryCoords.left + 'px') : left,
        // почему без этого карточка не будет вызываться onMouseUp
        // удалить эту логику
        // zIndex: isActive ? 1000 : 0
      }}
      onMouseDown={(e) => onMouseDownHandler(e)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemoveCard(id);
      }}
    >
      <p contentEditable={!isActive}>Введите текст...</p>
    </div>
  );
});

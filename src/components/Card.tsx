// import React from 'react';
import { memo, MouseEvent } from 'react';
import './Card.css';

interface ICoordObj {
  isActive: boolean;
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface ICardProps {
  onMouseDown: (id: string, e: MouseEvent, cardCoords: ICoordObj) => void;
  onRemoveCard: (id: string) => void;
  coord: ICoordObj
}

export const Card = memo(({
  onMouseDown,
  onRemoveCard,
  coord
}: ICardProps): JSX.Element => {
  // console.log('card render')
  const { 
    left, 
    top, 
    id,
    isActive
  } = coord;
  return (
    <div 
      className='card' 
      style={{
        top: top + 'px',
        left: left + 'px',
        // почему без этого карточка не будет вызываться onMouseUp
        zIndex: isActive ? 1000 : 0
      }}
      onMouseDown={(e) => onMouseDown(id, e, coord)}
    >
      <p contentEditable={!isActive}>Введите текст...</p>
      <button onClick={() => onRemoveCard(id)}>remove</button>
    </div>
  );
});

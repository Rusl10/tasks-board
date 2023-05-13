// import React from 'react';
import { DragEvent, memo } from 'react';
import './Card.css';

interface ICardProps {
  onDragEnd: (id: string, e: DragEvent) => void;
  onRemoveCard: (id: string) => void;
  coord: {
    id: string;
    top: number;
    left: number;
    right: number;
    bottom: number;
  }
}

export const Card = memo(({
  onDragEnd,
  onRemoveCard,
  coord
}: ICardProps): JSX.Element => {
  console.log('card render')
  const { 
    left, 
    top, 
    id 
  } = coord;
  return (
    <div 
      className='card' 
      onDragEnd={(e) => onDragEnd(id, e)}
      draggable 
      style={{
        top: top + 'px',
        left: left + 'px',
      }}
    >
      <p contentEditable>Введите текст...</p>
      <button onClick={() => onRemoveCard(id)}>remove</button>
    </div>
  );
});

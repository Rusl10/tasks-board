// import React from 'react';
import { DragEventHandler, memo } from 'react';
import './Card.css';

interface ICardProps {
  refCb: (element: HTMLElement | null) => void;
  onDragEnd: DragEventHandler<HTMLDivElement>;
  onRemoveCard: (id: string) => void;
  id: string;
}

export const Card = memo(({
  refCb, 
  onDragEnd,
  onRemoveCard,
  id
}: ICardProps): JSX.Element => {
  console.log('card render')
  console.log('id', id)
  return (
    <div 
      className='card' 
      onDragEnd={onDragEnd}
      draggable 
      ref={refCb}
    >
      <p contentEditable>Введите текст...</p>
      <button onClick={() => onRemoveCard(id)}>remove</button>
    </div>
  );
});

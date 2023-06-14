// import React from 'react';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLatest } from '../hooks/useLatest';
import { newUserCoordsObj } from '../utils/index';
import './Card.css';
import { rafThrottle } from '../utils/index';

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

const MIN_TEXTAREA_HEIGHT = 32;

interface ICardProps {
  onRemoveCard: (id: string) => void;
  coord: ICoordObj,
  changeCoordsArray: (cardCoords: ICoordObj) => boolean;
  //elementRef: RefObject<HTMLDivElement>;
  attachRO: (element: HTMLElement) => void;
  detachRO: () => void;
}

export const Card = memo(({
  onRemoveCard,
  coord,
  changeCoordsArray,
  attachRO,
  detachRO
}: ICardProps): JSX.Element => {
   //console.log('card render')
  const { 
    left, 
    top, 
    id,
  } = coord;
  const [text, setText] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [temporaryCoords, setTemporaryCoords] = useState(initialData);
  const coordLatestRef = useLatest(coord);
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
      //event.preventDefault();
      if (event.which == 2) return;
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

  useEffect(() => {
    if (!isFocused || !cardRef?.current) return;
    attachRO(cardRef.current);
    return () => {
      detachRO();
    }
  }, [isFocused])

  useLayoutEffect(() => {
    if(!textAreaRef?.current) return;
    textAreaRef.current.style.height = 'inherit';

    textAreaRef.current.style.height = `${Math.max(
      textAreaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [text])
  const actualLeftCoords = temporaryCoords.left || left;
  const actualTopCoords = temporaryCoords.top || top;
  return (
    <div 
      className='card' 
      style={{
        transform: `translate(${actualLeftCoords}px, ${actualTopCoords}px)`
      }}
      ref={cardRef}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemoveCard(id);
      }}
    >
      <textarea 
        onFocus={() => setIsFocused(true)}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        ref={textAreaRef}
        onMouseMove={(e) => {
          e.stopPropagation();
        }}
        onBlur={() => setIsFocused(false)}
        value={text}
        style={{minHeight: MIN_TEXTAREA_HEIGHT}}
        onChange={(e) => {
          const target = e.target;
          setText(target.value);

        }}
      ></textarea>
    </div>
  );
});

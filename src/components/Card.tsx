// import React from 'react';
import { memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLatest } from '../hooks/useLatest';
import { rafThrottle, DEFAULT_ELEMENT_SIZE } from '../utils/index';
import './Card.css';
import { useEvent } from '../hooks/useEvent';

interface ICard {
  id: string;
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
}

const initialData = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 0,
    id: '',
}

const MIN_TEXTAREA_HEIGHT = 32;

interface ICardProps {
  onRemoveCard: (id: string) => void;
  cardData: ICard,
  changeCardsArray: (cardData: ICard) => void;
  //elementRef: RefObject<HTMLDivElement>;
  // attachRO: (element: HTMLElement) => void;
  // detachRO: () => void;
}

export const Card = memo(({
  onRemoveCard,
  cardData,
  changeCardsArray,
  // attachRO,
  // detachRO
}: ICardProps): JSX.Element => {
   //console.log('card render')
  const { 
    left, 
    top,
    id,
  } = cardData;
  const [text, setText] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tempCardData, setTempCardData] = useState(initialData);
  const cardLatestDataRef = useLatest(cardData);
  const latestTempCardDataRef = useLatest(tempCardData);
  useEffect(() => {
    const cardEl = cardRef.current;

    if (!cardEl) return;
    
    const offset = {
      x: 0,
      y: 0,
    };
    
    const handleMouseMove = rafThrottle((event: MouseEvent) => {
      const mouseMovePageX = event.pageX;
      const mouseMovePageY = event.pageY;
      const calcLeftFromOffset = mouseMovePageX -  offset.x;
      const calcTopFromOffset = mouseMovePageY -  offset.y;
      const newCardData = {
        id,
        height: cardLatestDataRef.current.height,
        left: calcLeftFromOffset,
        right: calcLeftFromOffset +  DEFAULT_ELEMENT_SIZE,
        top: calcTopFromOffset,
        bottom: calcTopFromOffset + cardLatestDataRef.current.height,
      }
      setTempCardData(newCardData);
    })
    const handleMouseUp = () => {
      // сетим координаты, только если карточка была сдвинута
      if (latestTempCardDataRef.current.id !== '') {
        changeCardsArray(latestTempCardDataRef.current);
        setTempCardData(initialData);
      }
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp);
    }
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button > 0) return;
      offset.x =  event.offsetX;
      offset.y = event.offsetY;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    cardEl.addEventListener('mousedown', handleMouseDown)
    return () => {
      cardEl.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [cardData.id])

  useEffect(() => {
    if (!isFocused || !cardRef?.current) return;
    const resizeCb = (entries: ResizeObserverEntry[]) => {
      console.log('resizeCb')
      changeCardsArray({
        ...cardData,
        height: entries[0].borderBoxSize[0].blockSize,
        bottom: cardData.top + entries[0].borderBoxSize[0].blockSize
      })
    }
    const resizeObserver = new ResizeObserver(resizeCb);
    resizeObserver.observe(cardRef.current)
    return () => {
      resizeObserver.disconnect();
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
  const actualLeftCoords = tempCardData.left || left;
  const actualTopCoords = tempCardData.top || top;
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

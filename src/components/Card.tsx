// import React from 'react';
import {
  ChangeEvent,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useLatest } from '../hooks/useLatest';
import { rafThrottle } from '../utils/index';
import './Card.css';
import { ICard, Point } from '../types';
import { registerResizeObserverCb } from '../utils/sizeObserver';

const MIN_TEXTAREA_HEIGHT = 18;

interface ICardProps {
  onRemoveCard: (id: string) => void;
  cardData: ICard;
  changeCardsArray: (cardData: ICard) => void;
  scale: number;
}

export const Card = memo(function Card({
  onRemoveCard,
  cardData,
  changeCardsArray,
  scale,
}: ICardProps): JSX.Element {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tempCardData, setTempCardData] = useState<ICard>(cardData);
  const cardLatestDataRef = useLatest(cardData);
  const latestTempCardDataRef = useLatest(tempCardData);
  const latestScaleRef = useLatest(scale);
  useEffect(() => {
    const cardEl = cardRef.current;

    if (!cardEl) return;
    let prevMouseMosition: Point;

    const handleMouseMove = rafThrottle((event: MouseEvent) => {
      const deltaX = event.clientX - prevMouseMosition.x;
      const deltaY = event.clientY - prevMouseMosition.y;
      prevMouseMosition = {
        x: event.clientX,
        y: event.clientY,
      };
      console.log('scale', latestScaleRef.current);
      setTempCardData((prevCardData) => {
        return {
          ...prevCardData,
          top: prevCardData.top + deltaY / latestScaleRef.current,
          left: prevCardData.left + deltaX / latestScaleRef.current,
        };
      });
    });
    const handleMouseUp = () => {
      // сетим координаты, только если карточка была сдвинута
      if (
        latestTempCardDataRef.current.left !== cardLatestDataRef.current.left ||
        latestTempCardDataRef.current.top !== cardLatestDataRef.current.top
      ) {
        changeCardsArray(latestTempCardDataRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button > 0) return;
      prevMouseMosition = {
        x: event.clientX,
        y: event.clientY,
      };
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    cardEl.addEventListener('mousedown', handleMouseDown);
    return () => {
      cardEl.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cardData.id]);

  useEffect(() => {
    const cardEl = cardRef.current;
    if (!isFocused || !cardEl) return;
    return registerResizeObserverCb(cardEl, (entry) => {
      setTempCardData({
        ...latestTempCardDataRef.current,
        height: entry.borderBoxSize[0].blockSize,
      });
    });
  }, [isFocused]);

  useLayoutEffect(() => {
    if (!textAreaRef.current) return;
    textAreaRef.current.style.height = 'inherit';

    textAreaRef.current.style.height = `${Math.max(
      textAreaRef.current.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [tempCardData.text]);

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTempCardData({
      ...latestTempCardDataRef.current,
      text: e.target.value,
    });
  };

  const handleTextAreaBlur = () => {
    changeCardsArray(latestTempCardDataRef.current);
    setIsFocused(false);
  };

  const handleDoubleClick = () => {
    if (!textAreaRef.current) return;
    textAreaRef.current.focus();
  };

  const actualCard = tempCardData || cardData;

  return (
    <div
      className="card"
      style={{
        transform: `translate(${actualCard.left}px, ${actualCard.top}px)`,
      }}
      ref={cardRef}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemoveCard(actualCard.id);
      }}
      onDoubleClick={handleDoubleClick}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
      onDragStart={(e) => {
        e.preventDefault();
      }}
    >
      <textarea
        onFocus={(e) => {
          setIsFocused(true);
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        ref={textAreaRef}
        onMouseMove={(e) => {
          e.stopPropagation();
        }}
        onBlur={handleTextAreaBlur}
        value={actualCard.text}
        style={{
          minHeight: MIN_TEXTAREA_HEIGHT,
        }}
        onChange={handleTextareaChange}
      ></textarea>
    </div>
  );
});

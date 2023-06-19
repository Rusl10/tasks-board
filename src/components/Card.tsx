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
import { ICard } from '../types';
import { registerCallback } from '../utils/sizeObserver';

const MIN_TEXTAREA_HEIGHT = 32;

interface ICardProps {
  onRemoveCard: (id: string) => void;
  cardData: ICard;
  changeCardsArray: (cardData: ICard) => void;
}

export const Card = memo(
  ({ onRemoveCard, cardData, changeCardsArray }: ICardProps): JSX.Element => {
    //console.log('card render')
    const { left, top, id } = cardData;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [tempCardData, setTempCardData] = useState<ICard>(cardData);
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
        const calcLeftFromOffset = mouseMovePageX - offset.x;
        const calcTopFromOffset = mouseMovePageY - offset.y;
        const newCardData = {
          ...cardLatestDataRef.current,
          left: calcLeftFromOffset,
          top: calcTopFromOffset,
        };
        setTempCardData(newCardData);
      });
      const handleMouseUp = () => {
        // сетим координаты, только если карточка была сдвинута
        if (
          latestTempCardDataRef.current.left !==
            cardLatestDataRef.current.left ||
          latestTempCardDataRef.current.top !== cardLatestDataRef.current.top
        ) {
          changeCardsArray(latestTempCardDataRef.current);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      const handleMouseDown = (event: MouseEvent) => {
        if (event.button > 0) return;
        offset.x = event.offsetX;
        offset.y = event.offsetY;
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
      return registerCallback(cardEl, (entry) => {
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

    const actualLeftCoords = tempCardData?.left || left;
    const actualTopCoords = tempCardData?.top || top;
    return (
      <div
        className="card"
        style={{
          transform: `translate(${actualLeftCoords}px, ${actualTopCoords}px)`,
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
          onBlur={handleTextAreaBlur}
          value={tempCardData.text}
          style={{ minHeight: MIN_TEXTAREA_HEIGHT }}
          onChange={handleTextareaChange}
        ></textarea>
      </div>
    );
  }
);

import { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from 'react';
import { useLatest } from '../hooks/useLatest';
import { rafThrottle } from '../utils/index';
import { ICard, Point } from '../types';
import { registerResizeObserverCb } from '../utils/sizeObserver';
import './Card.css';

const MIN_TEXTAREA_HEIGHT = 18;

interface ICardProps {
  cardData: ICard;
  scale: number;
  onRemoveCard: (id: string) => void;
  changeCardsArray: (cardData: ICard) => void;
}

export const Card = memo(
  ({
    onRemoveCard,
    cardData,
    changeCardsArray,
    scale,
  }: ICardProps): JSX.Element => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [tempCardData, setTempCardData] = useState<ICard | null>(null);

    const latestCardDataRef = useLatest(cardData);
    const latestTempCardDataRef = useLatest(tempCardData);
    const latestScaleRef = useLatest(scale);

    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const cardEl = cardRef.current;

      if (!cardEl) return;
      let prevMousePosition: Point;

      const handleMouseMove = rafThrottle((event: MouseEvent) => {
        const tempCardData = latestTempCardDataRef.current;

        if (!tempCardData) {
          return;
        }

        const deltaX = event.clientX - prevMousePosition.x;
        const deltaY = event.clientY - prevMousePosition.y;

        prevMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };

        setTempCardData({
          ...tempCardData,
          top: tempCardData.top + deltaY / latestScaleRef.current,
          left: tempCardData.left + deltaX / latestScaleRef.current,
        });
      });

      const handleMouseUp = () => {
        // сетим координаты, только если карточка была сдвинута
        if (
          latestTempCardDataRef.current &&
          (latestTempCardDataRef.current.left !==
            latestCardDataRef.current.left ||
            latestTempCardDataRef.current.top !== latestCardDataRef.current.top)
        ) {
          changeCardsArray(latestTempCardDataRef.current);
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
      const handleMouseDown = (event: MouseEvent) => {
        if (event.button > 0) return;
        prevMousePosition = {
          x: event.clientX,
          y: event.clientY,
        };
        setTempCardData(latestCardDataRef.current);
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
        const tempCardData = latestTempCardDataRef.current;

        if (!tempCardData) {
          return;
        }

        setTempCardData({
          ...tempCardData,
          height: entry.borderBoxSize[0].blockSize,
        });
      });
    }, [isFocused]);

    const textAreaRow = useMemo(() => {
      const text = tempCardData ? tempCardData.text : cardData.text;

      return text.split('\n').length + 1;
    }, [tempCardData, cardData]);

    const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      if (!tempCardData) {
        return;
      }
      setTempCardData({ ...tempCardData, text: e.target.value });
    };

    const handleTextAreaBlur = () => {
      if (!tempCardData) {
        return;
      }
      setTempCardData(null);
      changeCardsArray(tempCardData);
      setIsFocused(false);
    };

    const handleDoubleClick = () => {
      if (!textAreaRef.current) return;
      textAreaRef.current.focus();
      setTempCardData(cardData);
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
          onRemoveCard(cardData.id);
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
          onFocus={() => {
            setIsFocused(true);
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          ref={textAreaRef}
          onMouseMove={(e) => {
            e.stopPropagation();
          }}
          rows={textAreaRow}
          onBlur={handleTextAreaBlur}
          value={actualCard.text}
          style={{
            minHeight: MIN_TEXTAREA_HEIGHT,
          }}
          onChange={handleTextareaChange}
        ></textarea>
      </div>
    );
  }
);
